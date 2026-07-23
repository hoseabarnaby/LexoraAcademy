(() => {
  const $=(q,r=document)=>r.querySelector(q);
  const esc=(s='')=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const LABELS={
    english:{title:'IELTS Exam Center',subtitle:'Academic & General Training',voice:'en-GB',all:'Semua band'},
    mandarin:{title:'HSK Exam Center',subtitle:'听力 · 阅读 · 语法 · 写作',voice:'zh-CN',all:'Semua level HSK'},
    japanese:{title:'JLPT Exam Center',subtitle:'文字・語彙 · 文法 · 読解 · 聴解',voice:'ja-JP',all:'Semua level JLPT'},
    german:{title:'Deutsch Exam Center',subtitle:'Goethe / CEFR · Lesen · Hören · Schreiben',voice:'de-DE',all:'Semua level CEFR'}
  };
  let bank={},view='library',active=null,qi=0,answers={},startedAt=0,timer=null,remaining=0,filters={level:'all',skill:'all',q:''};
  const mode=()=>window.LexoraApp?.getMode?.()||localStorage.getItem('lexora-mode')||'english';
  const pack=()=>bank[mode()]||bank.english||{sets:[],levels:[],name:'English'};
  const root=()=>$('#examCenterRoot');
  const typeLabel=t=>({tfng:'T/F/NG',ynng:'Y/N/NG',mcq:'Pilihan Ganda',completion:'Isian',matching:'Matching',summary:'Summary','matching-heading':'Matching Headings',pinyin:'Pinyin','word-order':'Susun Kalimat',translation:'Terjemahan','kanji-reading':'Kanji Reading',article:'Artikel','error-correction':'Koreksi Kalimat',transformation:'Transformasi','sentence-star':'Sentence Order',essay:'Writing',speaking:'Speaking'}[t]||t);
  async function init(){
    try{bank=await fetch('data/exam-center.json').then(r=>{if(!r.ok)throw Error('Exam bank tidak ditemukan');return r.json()});render();
      document.addEventListener('click',handle);document.addEventListener('input',handleInput);document.addEventListener('change',handleInput);
      window.addEventListener('lexora:mode-change',refreshMode);window.addEventListener('lexora-mode-change',refreshMode);
    }catch(e){console.error(e);if(root())root().innerHTML='<div class="exam-empty">Exam bank gagal dimuat. Muat ulang halaman.</div>'}
  }
  function refreshMode(){clearInterval(timer);view='library';active=null;qi=0;answers={};filters={level:'all',skill:'all',q:''};render()}
  function render(){if(!root())return;view==='library'?renderLibrary():view==='test'?renderTest():renderResult()}
  function renderLibrary(){
    const p=pack(),m=LABELS[mode()]||LABELS.english,skills=[...new Set(p.sets.map(x=>x.skill))];
    root().innerHTML=`<section class="exam-hero"><div><span class="exam-overline">${esc(m.subtitle)}</span><h3>${esc(m.title)}</h3><p>Pilih latihan berdasarkan level dan skill. Semua set memakai materi orisinal Lexora, variasi tipe soal, timer, bukti jawaban, dan pembahasan.</p></div><div class="exam-hero-stats"><div><b>${p.sets.length}</b><small>Set latihan</small></div><div><b>${p.sets.reduce((a,s)=>a+s.questions.length,0)}</b><small>Soal & tugas</small></div><div><b>${skills.length}</b><small>Skill</small></div></div></section>
    <section class="exam-filterbar"><label><span>Level</span><select id="examLevel"><option value="all">${esc(m.all)}</option>${p.levels.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label><label><span>Skill</span><select id="examSkill"><option value="all">Semua skill</option>${skills.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label><label class="exam-search"><span>Cari latihan</span><input id="examSearch" placeholder="Reading, listening, grammar…"></label></section>
    <div class="exam-grid" id="examGrid"></div>`;
    $('#examLevel').value=filters.level;$('#examSkill').value=filters.skill;$('#examSearch').value=filters.q;filterCards();
  }
  function filterCards(){
    const p=pack(),q=filters.q.toLowerCase();const arr=p.sets.filter(s=>(filters.level==='all'||s.level===filters.level)&&(filters.skill==='all'||s.skill===filters.skill)&&(!q||`${s.title} ${s.skill} ${s.level}`.toLowerCase().includes(q)));
    const grid=$('#examGrid');if(!grid)return;
    grid.innerHTML=arr.length?arr.map(s=>{const types=[...new Set(s.questions.map(q=>typeLabel(q.type)))];return `<article class="exam-card"><div class="exam-card-head"><span class="exam-chip">${esc(s.level)}</span><span>⏱ ${s.time} menit</span></div><div class="exam-card-icon">${s.skill==='Reading'?'📖':s.skill==='Listening'?'🎧':s.skill==='Writing'?'✍️':s.skill==='Speaking'?'🎙️':s.skill==='Grammar'?'🧩':'📝'}</div><h4>${esc(s.title)}</h4><p>${esc(s.skill)} · ${s.questions.length} soal/tugas</p><div class="exam-type-list">${types.map(t=>`<span>${esc(t)}</span>`).join('')}</div><button class="primary exam-start" data-exam-start="${esc(s.id)}">Mulai latihan</button></article>`}).join(''):'<div class="exam-empty">Belum ada set yang cocok dengan filter ini.</div>';
  }
  function start(id){active=pack().sets.find(s=>s.id===id);if(!active)return;view='test';qi=0;answers={};startedAt=Date.now();remaining=(active.time||20)*60;startTimer();render();scrollTo({top:0,behavior:'smooth'})}
  function startTimer(){clearInterval(timer);timer=setInterval(()=>{remaining=Math.max(0,remaining-1);const el=$('#examTimer');if(el)el.textContent=fmt(remaining);if(!remaining){clearInterval(timer);finish()}},1000)}
  const fmt=x=>`${String(Math.floor(x/60)).padStart(2,'0')}:${String(x%60).padStart(2,'0')}`;
  const current=()=>active.questions[qi];
  function renderTest(){
    const q=current(),done=Object.values(answers).filter(x=>String(x).trim()).length,pct=Math.round(done/active.questions.length*100);
    root().innerHTML=`<button class="exam-back" data-exam-back>← Kembali ke daftar</button><div class="exam-shell"><main class="exam-main"><header class="exam-test-head"><div><span>${esc(active.level)} · ${esc(active.skill)}</span><h3>${esc(active.title)}</h3></div><strong id="examTimer">${fmt(remaining)}</strong></header>
    ${active.passage?`<article class="exam-passage"><div class="exam-passage-label">PASSAGE</div>${esc(active.passage).replace(/\n/g,'<br>')}</article>`:''}
    ${active.transcript?`<article class="exam-audio"><div><span>🎧 Listening audio</span><small>Putar audio. Transcript hanya untuk review setelah selesai.</small></div><button class="secondary" data-exam-audio>▶ Putar</button></article>`:''}
    <article class="exam-question"><div class="exam-question-meta">Soal ${qi+1} dari ${active.questions.length} · ${esc(typeLabel(q.type))}</div><h4>${esc(q.prompt)}</h4>${answerUI(q)}</article>
    <footer class="exam-nav"><button class="secondary" data-exam-prev ${qi===0?'disabled':''}>← Sebelumnya</button>${qi===active.questions.length-1?'<button class="primary" data-exam-finish>Kirim jawaban</button>':'<button class="primary" data-exam-next>Berikutnya →</button>'}</footer></main>
    <aside class="exam-side"><div class="exam-side-title"><b>Progress</b><span>${done}/${active.questions.length}</span></div><div class="exam-progressbar"><i style="width:${pct}%"></i></div><div class="exam-number-grid">${active.questions.map((_,i)=>`<button class="exam-number ${String(answers[i]??'').trim()?'done':''} ${i===qi?'current':''}" data-exam-go="${i}">${i+1}</button>`).join('')}</div><p>Jawaban tersimpan selama sesi. Kamu bebas berpindah nomor.</p></aside></div>`;
  }
  function answerUI(q){const val=answers[qi]??'';if(q.options)return `<div class="exam-options">${q.options.map(o=>`<button class="exam-option ${val===o?'selected':''}" data-exam-option="${esc(o)}"><i></i><span>${esc(o)}</span></button>`).join('')}</div>`;if(q.type==='essay')return `<textarea class="exam-answer exam-textarea" data-exam-text placeholder="Tulis jawabanmu di sini…">${esc(val)}</textarea><div class="exam-wordcount" id="examWordCount">${wordCount(val)} / minimal ${q.minWords||0} kata</div>`;if(q.type==='speaking')return `<div class="exam-speaking-box"><b>Persiapan ${q.prep||0} detik · Bicara ${q.speak||60} detik</b><textarea class="exam-answer" data-exam-text placeholder="Tulis poin atau transcript latihan…">${esc(val)}</textarea></div>`;return `<input class="exam-answer" data-exam-text value="${esc(val)}" placeholder="Ketik jawaban…">`}
  const wordCount=v=>String(v||'').trim()?String(v).trim().split(/\s+/).length:0;
  function playAudio(){if(!active?.transcript||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(active.transcript);u.lang=(LABELS[mode()]||LABELS.english).voice;u.rate=.88;window.speechSynthesis.speak(u)}
  function finish(){clearInterval(timer);window.speechSynthesis?.cancel?.();view='result';render();scrollTo({top:0,behavior:'smooth'});saveResult()}
  const normalize=s=>String(s??'').trim().toLowerCase().replace(/[。.!?！？,，]/g,'').replace(/\s+/g,' ');
  function mark(q,a){if(['essay','speaking'].includes(q.type)){const wc=wordCount(a);return{gradable:false,ok:wc>=(q.minWords||1),note:q.type==='essay'?`${wc} kata ditulis. Lanjutkan ke AI Feedback untuk evaluasi rinci.`:'Speaking task selesai setelah kamu merekam atau melatih jawabannya.'}}const accepts=[q.answer,...(q.accept||[])].map(normalize);return{gradable:true,ok:accepts.includes(normalize(a)),note:q.explain||''}}
  function renderResult(){
    const marked=active.questions.map((q,i)=>mark(q,answers[i])),grad=marked.filter(x=>x.gradable),correct=grad.filter(x=>x.ok).length,score=grad.length?Math.round(correct/grad.length*100):0;
    const isObjective=grad.length>0;const resultValue=isObjective?`${score}%`:'✓';const resultTitle=isObjective?`${correct} benar dari ${grad.length} soal objektif`:'Tugas latihan berhasil disimpan';const resultText=isObjective?'Review bukti dan pembahasan sebelum mengulang.':'Gunakan AI Feedback atau Speaking Check untuk evaluasi rinci—Lexora tidak memberi skor palsu pada jawaban uraian.';
    root().innerHTML=`<section class="exam-result"><div class="exam-score-ring" style="--score:${isObjective?score:100}"><strong>${resultValue}</strong></div><div><span>TEST SELESAI</span><h3>${resultTitle}</h3><p>${resultText}</p></div></section>${active.transcript?`<details class="exam-review-transcript"><summary>📄 Lihat listening transcript</summary><p>${esc(active.transcript)}</p></details>`:''}<div class="exam-review">${active.questions.map((q,i)=>{const m=marked[i];return `<article class="exam-review-item ${m.ok?'correct':'wrong'}"><div class="review-status">${m.ok?'✓':'!'}</div><div><b>${i+1}. ${esc(q.prompt)}</b><p>Jawabanmu: <strong>${esc(answers[i]||'Belum dijawab')}</strong></p>${q.answer?`<p>Jawaban benar: <strong>${esc(q.answer)}</strong></p>`:''}${q.evidence?`<blockquote><b>Bukti:</b> ${esc(q.evidence)}</blockquote>`:''}<p class="review-explain">${esc(m.note)}</p></div></article>`}).join('')}</div><div class="exam-result-actions"><button class="secondary" data-exam-library>Kembali ke daftar</button><button class="primary" data-exam-retry>Ulangi test</button></div>`;
  }
  function saveResult(){try{const key='lexora_exam_results_v2',arr=JSON.parse(localStorage.getItem(key)||'[]');arr.unshift({id:active.id,mode:mode(),title:active.title,scoreAt:new Date().toISOString(),answers});localStorage.setItem(key,JSON.stringify(arr.slice(0,50)))}catch{}}
  function handle(e){const t=e.target.closest('[data-exam-start],[data-exam-option],[data-exam-next],[data-exam-prev],[data-exam-finish],[data-exam-go],[data-exam-back],[data-exam-library],[data-exam-retry],[data-exam-audio]');if(!t)return;if(t.dataset.examStart)start(t.dataset.examStart);else if(t.dataset.examOption!=null){answers[qi]=t.dataset.examOption;renderTest()}else if(t.hasAttribute('data-exam-next')){if(qi<active.questions.length-1)qi++;renderTest()}else if(t.hasAttribute('data-exam-prev')){if(qi>0)qi--;renderTest()}else if(t.hasAttribute('data-exam-finish'))finish();else if(t.dataset.examGo!=null){qi=+t.dataset.examGo;renderTest()}else if(t.hasAttribute('data-exam-audio'))playAudio();else if(t.hasAttribute('data-exam-back')||t.hasAttribute('data-exam-library')){clearInterval(timer);window.speechSynthesis?.cancel?.();view='library';active=null;render()}else if(t.hasAttribute('data-exam-retry'))start(active.id)}
  function handleInput(e){if(e.target.id==='examLevel'){filters.level=e.target.value;filterCards()}if(e.target.id==='examSkill'){filters.skill=e.target.value;filterCards()}if(e.target.id==='examSearch'){filters.q=e.target.value;filterCards()}if(e.target.matches('[data-exam-text]')){answers[qi]=e.target.value;const w=$('#examWordCount');if(w)w.textContent=`${wordCount(e.target.value)} / minimal ${current().minWords||0} kata`}}
  document.addEventListener('DOMContentLoaded',init);
  window.LexoraExamCenter={render,refreshMode};
})();
