
(() => {
  const $ = (q, r=document) => r.querySelector(q);
  const esc = (v='') => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const LANG = {
    english:{name:'English & IELTS',flag:'🇬🇧',exam:'IELTS',levels:['Foundation','Band 4–5','Band 5.5–6','Band 6.5–7','Band 7.5+'],skills:['Vocabulary','Grammar','Reading','Listening','Writing','Speaking'],accent:'IELTS'},
    mandarin:{name:'Mandarin HSK',flag:'🇨🇳',exam:'HSK',levels:['HSK 1','HSK 2','HSK 3','HSK 4','HSK 5','HSK 6'],skills:['Hanzi','Vocabulary','Grammar','Listening','Reading','Tone & Speaking'],accent:'HSK'},
    japanese:{name:'Japanese JLPT',flag:'🇯🇵',exam:'JLPT',levels:['N5','N4','N3','N2','N1'],skills:['Kana','Kanji','Vocabulary','Grammar','Reading','Listening'],accent:'JLPT'},
    german:{name:'German Goethe / CEFR',flag:'🇩🇪',exam:'Goethe',levels:['A1','A2','B1','B2','C1','C2'],skills:['Vocabulary','Grammar','Reading','Listening','Writing','Speaking'],accent:'CEFR'}
  };
  const KEY='lexora-learning-plan-v3';
  const defaults={goal:'study',minutes:30,days:5,diagnostic:{},mastery:{},tasks:{},review:[],weeklyXp:0,lastStudy:null};
  let plan={...defaults,...safeParse(localStorage.getItem(KEY))};
  function safeParse(x){try{return JSON.parse(x||'{}')}catch{return {}}}
  function mode(){return window.LexoraApp?.getMode?.()||localStorage.getItem('lexora-mode')||'english'}
  function cfg(){return LANG[mode()]||LANG.english}
  function save(){localStorage.setItem(KEY,JSON.stringify(plan)); try{window.lexoraCloudSave?.()}catch{}}
  function mastery(skill){const key=mode()+':'+skill; return Number(plan.mastery[key]||0)}
  function setMastery(skill,n){plan.mastery[mode()+':'+skill]=Math.max(0,Math.min(100,Math.round(n)));save()}
  function today(){return new Date().toISOString().slice(0,10)}
  function recommendations(){
    const c=cfg(); const ordered=[...c.skills].sort((a,b)=>mastery(a)-mastery(b));
    return [
      {icon:'🧠',title:`Review ${ordered[0]}`,desc:'Ulangi kesalahan yang paling sering muncul.',action:'review',xp:30},
      {icon:'🎯',title:`Focused ${ordered[1]} Drill`,desc:'10 soal adaptif sesuai kemampuanmu.',action:'drill',xp:45},
      {icon:'📝',title:`${c.exam} Mini Test`,desc:'Simulasi singkat dengan evaluasi per skill.',action:'mock',xp:80},
      {icon:'🎧',title:'Listening Sprint',desc:'Dictation, missing words, dan shadowing.',action:'listening',xp:55}
    ];
  }
  function render(){
    const root=$('#learningSystemRoot'); if(!root)return; const c=cfg();
    const avg=Math.round(c.skills.reduce((s,x)=>s+mastery(x),0)/c.skills.length)||0;
    const weak=[...c.skills].sort((a,b)=>mastery(a)-mastery(b))[0];
    root.innerHTML=`
      <section class="learning-hero">
        <div><span class="learning-kicker">${c.flag} PERSONAL LEARNING SYSTEM</span><h1>Jalur belajar ${esc(c.name)}</h1><p>Diagnostik, roadmap, review kesalahan, latihan adaptif, dan simulasi ujian dalam satu alur.</p></div>
        <div class="readiness-ring" style="--p:${avg}"><strong>${avg}%</strong><span>Exam readiness</span></div>
      </section>
      <section class="learning-stat-grid">
        <article><span>Target belajar</span><strong>${plan.minutes} menit</strong><small>${plan.days} hari per minggu</small></article>
        <article><span>Fokus terlemah</span><strong>${esc(weak)}</strong><small>Prioritas latihan hari ini</small></article>
        <article><span>Review queue</span><strong>${plan.review.length}</strong><small>Kesalahan menunggu diulang</small></article>
        <article><span>Weekly XP</span><strong>${plan.weeklyXp}</strong><small>Target 500 XP</small></article>
      </section>
      <section class="learning-layout">
        <div class="learning-main">
          <article class="learning-card">
            <div class="learning-head"><div><span class="learning-kicker">STEP 1</span><h2>Diagnostic Check</h2><p>Ukur kemampuan awal agar soal tidak terlalu mudah atau terlalu sulit.</p></div><button class="primary" data-learn-action="diagnostic">Mulai diagnostik</button></div>
            <div class="skill-bars">${c.skills.map(s=>`<div class="skill-row"><div><b>${esc(s)}</b><span>${mastery(s)}%</span></div><div class="skill-track"><i style="width:${mastery(s)}%"></i></div></div>`).join('')}</div>
          </article>
          <article class="learning-card">
            <div class="learning-head"><div><span class="learning-kicker">TODAY</span><h2>Rencana belajar hari ini</h2><p>Selesaikan berurutan agar vocabulary, pemahaman, dan produksi bahasa seimbang.</p></div><button class="secondary" data-learn-action="settings">Atur target</button></div>
            <div class="daily-timeline">${recommendations().map((r,i)=>`<button class="timeline-task ${plan.tasks[today()+':'+r.action]?'done':''}" data-task="${r.action}" data-skill="${esc(c.skills[Math.min(i,c.skills.length-1)])}"><span>${r.icon}</span><div><small>${i+1<4?'SESSION '+(i+1):'CHALLENGE'}</small><b>${esc(r.title)}</b><p>${esc(r.desc)}</p></div><em>+${r.xp} XP</em></button>`).join('')}</div>
          </article>
          <article class="learning-card">
            <div class="learning-head"><div><span class="learning-kicker">ERROR NOTEBOOK</span><h2>Review kesalahan</h2><p>Setiap jawaban salah masuk antrean dan dijadwalkan ulang dengan spaced repetition.</p></div><button class="secondary" data-learn-action="add-review">Tambah contoh</button></div>
            <div class="review-list">${plan.review.length?plan.review.slice(0,8).map((x,i)=>`<div class="review-item"><span>${x.icon||'📌'}</span><div><b>${esc(x.title)}</b><p>${esc(x.note)}</p><small>Review berikutnya: ${esc(x.due||'hari ini')}</small></div><button data-review-done="${i}">Sudah paham</button></div>`).join(''):'<div class="learning-empty">Belum ada kesalahan. Jawaban yang salah dari latihan akan muncul di sini.</div>'}</div>
          </article>
        </div>
        <aside class="learning-side">
          <article class="learning-card path-card"><span class="learning-kicker">ROADMAP</span><h2>${esc(c.exam)} Journey</h2><div class="roadmap">${c.levels.map((l,i)=>`<div class="roadmap-node ${avg>=Math.round((i+1)/c.levels.length*100)?'passed':avg>=Math.round(i/c.levels.length*100)?'current':''}"><i>${i+1}</i><div><b>${esc(l)}</b><small>${i===0?'Fundamental skills':i===c.levels.length-1?'Exam mastery':'Skill development'}</small></div></div>`).join('')}</div></article>
          <article class="learning-card"><span class="learning-kicker">WEEKLY PLAN</span><h2>Jadwal seimbang</h2><div class="week-plan">${['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map((d,i)=>`<div class="${i<plan.days?'active':''}"><b>${d}</b><span>${i<plan.days?['Vocab','Grammar','Listening','Reading','Output'][i%5]:'Rest'}</span></div>`).join('')}</div></article>
          <article class="learning-card quality-card"><span class="learning-kicker">QUALITY PROMISE</span><h2>Materi terasa tidak sesuai?</h2><p>Laporkan langsung beserta nama lesson dan screenshot. Tim admin bisa menandai prioritas, membalas, dan memperbaiki statusnya.</p><button class="secondary full" data-open-quality>Laporkan kualitas materi</button></article>
        </aside>
      </section>
      <div class="learning-modal" id="learningModal"><div class="learning-modal-card"><button data-close-learning>✕</button><div id="learningModalBody"></div></div></div>`;
    bind();
  }
  function bind(){
    document.querySelectorAll('[data-learn-action]').forEach(b=>b.onclick=()=>action(b.dataset.learnAction));
    document.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>completeTask(b));
    document.querySelectorAll('[data-review-done]').forEach(b=>b.onclick=()=>{plan.review.splice(Number(b.dataset.reviewDone),1);save();render()});
    document.querySelector('[data-open-quality]')?.addEventListener('click',()=>document.querySelector('[data-bug-open]')?.click());
    document.querySelector('[data-close-learning]')?.addEventListener('click',closeModal);
  }
  function modal(html){$('#learningModalBody').innerHTML=html;$('#learningModal').classList.add('show')}
  function closeModal(){$('#learningModal')?.classList.remove('show')}
  function action(a){
    if(a==='diagnostic') return diagnostic();
    if(a==='settings') return modal(`<span class="learning-kicker">STUDY SETTINGS</span><h2>Atur target belajarmu</h2><label>Menit per hari<input id="lpMinutes" type="number" min="10" max="180" value="${plan.minutes}"></label><label>Hari per minggu<input id="lpDays" type="number" min="1" max="7" value="${plan.days}"></label><button class="primary full" id="saveLp">Simpan target</button>`), setTimeout(()=>$('#saveLp').onclick=()=>{plan.minutes=Number($('#lpMinutes').value)||30;plan.days=Number($('#lpDays').value)||5;save();closeModal();render()},0);
    if(a==='add-review'){const skill=cfg().skills.sort((x,y)=>mastery(x)-mastery(y))[0];plan.review.unshift({title:`${skill}: contoh kesalahan`,note:'Tuliskan pola atau kata yang masih sering salah.',due:'hari ini',icon:'📌'});save();render()}
  }
  function diagnostic(){
    const c=cfg(); let i=0,score={};
    const qs=c.skills.map((s,n)=>({skill:s,q:`Seberapa yakin kamu dengan ${s}?`,opts:[['Masih pemula',20],['Cukup paham',45],['Lumayan kuat',70],['Sangat yakin',90]]}));
    const draw=()=>{const q=qs[i];modal(`<span class="learning-kicker">DIAGNOSTIC ${i+1}/${qs.length}</span><h2>${esc(q.q)}</h2><p>Pilih jujur. Hasil ini hanya untuk mengatur tingkat latihan.</p><div class="diag-options">${q.opts.map(o=>`<button data-diag="${o[1]}">${o[0]}</button>`).join('')}</div>`);document.querySelectorAll('[data-diag]').forEach(b=>b.onclick=()=>{score[q.skill]=Number(b.dataset.diag);i++;if(i<qs.length)draw();else{Object.entries(score).forEach(([s,v])=>setMastery(s,v));plan.diagnostic[mode()]={at:Date.now(),score};save();modal(`<div class="diag-result">🎯</div><h2>Diagnostic selesai</h2><p>Roadmap dan latihan harian sudah disesuaikan dengan kemampuanmu.</p><button class="primary full" id="finishDiag">Lihat learning path</button>`);$('#finishDiag').onclick=()=>{closeModal();render()}}})}
    draw();
  }
  function completeTask(btn){
    const key=today()+':'+btn.dataset.task;if(plan.tasks[key])return;
    plan.tasks[key]=true;plan.weeklyXp+=Number((btn.querySelector('em')?.textContent||'0').replace(/\D/g,''))||30;setMastery(btn.dataset.skill,mastery(btn.dataset.skill)+4);plan.lastStudy=Date.now();save();btn.classList.add('done');
    try{window.toast?.('Misi selesai! XP dan mastery bertambah.')}catch{}
    if(btn.dataset.task==='listening') document.querySelector('[data-page="listening"]')?.click();
    if(btn.dataset.task==='drill') document.querySelector('[data-page="practice"]')?.click();
  }
  // Track wrong answers from existing practice output, without changing old system.
  const observer=new MutationObserver(()=>{const r=$('#moduleResult');if(!r||!r.textContent.includes('❌'))return;const sig=r.textContent.slice(0,120);if(plan.review.some(x=>x.sig===sig))return;plan.review.unshift({sig,title:`${cfg().exam} practice mistake`,note:'Periksa kembali jawaban salah dan alasan kuncinya.',due:'besok',icon:'🧠'});save()});
  document.addEventListener('DOMContentLoaded',()=>{render();const target=$('#moduleResult');if(target)observer.observe(target,{childList:true,subtree:true,characterData:true});document.querySelectorAll('[data-page="learning"]').forEach(b=>b.addEventListener('click',()=>setTimeout(render,0)));window.addEventListener('lexora:mode-change',()=>setTimeout(render,0));});
  window.renderLearningSystem=render;
})();
