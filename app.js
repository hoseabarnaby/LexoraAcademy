const PATHS = {
  ielts: 'data/ielts-vocabulary.json',
  hsk: 'data/hsk-vocabulary.json',
  jlpt: 'data/jlpt-vocabulary.json',
  german: 'data/german-vocabulary.json',
  listening: 'data/listening-library.json',
  expressions: 'data/expressions-idioms.json',
  englishGrammar: 'data/english-grammar.json',
  mandarinGrammar: 'data/mandarin-grammar.json',
  japaneseGrammar: 'data/japanese-grammar.json',
  germanGrammar: 'data/german-grammar.json'
};

const MODE_ASSETS = {
  english: { vocabKey:'ielts', vocabPath:PATHS.ielts, grammarKey:'englishGrammar', grammarPath:PATHS.englishGrammar, bankKey:'englishBank', build:(v,g)=>buildEnglishPracticeBank(v,g,state.data.expressions||[]) },
  mandarin: { vocabKey:'hsk', vocabPath:PATHS.hsk, grammarKey:'mandarinGrammar', grammarPath:PATHS.mandarinGrammar, bankKey:'mandarinBank', build:(v,g)=>buildMandarinPracticeBank(v,g) },
  japanese: { vocabKey:'jlpt', vocabPath:PATHS.jlpt, grammarKey:'japaneseGrammar', grammarPath:PATHS.japaneseGrammar, bankKey:'japaneseBank', build:(v,g)=>buildJapanesePracticeBank(v,g) },
  german: { vocabKey:'german', vocabPath:PATHS.german, grammarKey:'germanGrammar', grammarPath:PATHS.germanGrammar, bankKey:'germanBank', build:(v,g)=>buildGermanPracticeBank(v,g) }
};


const MODE_ORDER = ['english', 'mandarin', 'japanese', 'german'];
const IELTS_LEVEL_ORDER = ['Band 5', 'Band 5-6', 'Band 6', 'Band 6-7', 'Band 7', 'Band 7-8', 'Band 8-9'];
const HSK_LEVEL_ORDER = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];
const JLPT_LEVEL_ORDER = ['JLPT N5', 'JLPT N4', 'JLPT N3', 'JLPT N2', 'JLPT N1'];
const GERMAN_LEVEL_ORDER = ['CEFR A1', 'CEFR A2', 'CEFR B1', 'CEFR B2', 'CEFR C1', 'CEFR C2'];

const CONFIG = {
  english: {
    lang: 'English', speech: 'en-US', className: 'english-mode',
    brand: 'English IELTS Studio', badge: 'ENGLISH MODE', title: 'IELTS English', desc: 'Vocabulary, reading, listening, writing, speaking.',
    next: 'Pindah ke Mandarin 中文', topNext: '中文 Mandarin', mobileNext: '中',
    levels: IELTS_LEVEL_ORDER, vocabKey: 'ielts', bankKey: 'englishBank',
    labels: {dashboard:'Dashboard', vocabulary:'Vocabulary', practice:'IELTS Practice', listening:'Listening', check:'Practice Check', expressions:'Expressions', achievements:'Achievements', progress:'Progress'},
    pageTitles: {dashboard:'English Dashboard', vocabulary:'English Vocabulary', practice:'IELTS Practice', listening:'English Listening', check:'English Practice Check', expressions:'English Expressions', achievements:'Achievements', progress:'English Progress'},
    hero: ['Start with English first','Belajar IELTS dibuat simpel','Mulai dari English IELTS. Untuk Mandarin/Jepang, klik tombol mode di kanan atas atau sidebar.','Start English Vocabulary'],
    dashboard: ['IELTS words','IELTS modules','English lessons','English Progress'],
    vocab: ['English vocabulary','IELTS vocabulary list dulu, flashcard belakangan','Semua kata English tampil sebagai list. Klik kata untuk detail, lalu tandai Learned atau Difficult.','Cari word / meaning / example...'],
    practice: ['IELTS practice','Bank soal English: 40 soal per practice','Setiap materi punya banyak practice. Klik Pilih untuk mulai mengerjakan.'],
    listening: ['English listening','English listening library','Pilih topik, dengarkan audio/video, lalu latihan dengan Dictation, Missing Words, Word Catch, atau Shadowing.'],
    check: ['English checker','English Writing & Speaking','Latihan writing dan speaking dengan tampilan bersih.','English Writing Check','English Speaking Check'],
    expr: ['English expressions','Useful IELTS expressions & idioms','Frasa untuk IELTS Writing dan Speaking agar jawaban lebih natural.'],
    flow: '<b>English Flow</b><br>1. Vocabulary<br>2. Practice soal<br>3. Listening<br>4. Progress',
    quick: [
      ['1','Vocabulary List','Mulai dari IELTS 5000+ word list.','vocabulary'],
      ['2','IELTS Practice','Reading, listening, writing, speaking.','practice'],
      ['3','Listening Library','English videos/audio + soal.','listening'],
      ['4','Writing & Speaking Check','Koreksi jawaban English.','check']
    ],
    writingTasks: ['IELTS Task 2','IELTS Task 1','IELTS Short Answer','Scholarship Essay'],
    writingPlaceholder: 'Write your IELTS paragraph / essay here...',
    speakingPrompts: [
      {label:'IELTS Part 2: Future goal', target:'Describe a goal you want to achieve in the future. You should say what it is, why you want it, and how you will achieve it.'},
      {label:'IELTS Part 1: Study', target:'Do you prefer studying alone or with friends? Explain your answer.'},
      {label:'IELTS Part 3: Technology', target:'How has technology changed education in your country?'}
    ],
    dailyTitle: 'Daily English Boost'
  },
  mandarin: {
    lang: 'Mandarin', speech: 'zh-CN', className: 'mandarin-mode',
    brand: 'Mandarin HSK Studio', badge: 'MANDARIN MODE', title: 'HSK Mandarin 中文', desc: 'HSK 1–6, hanzi, pinyin, writing, speaking, tone.',
    next: 'Pindah ke Japanese JLPT 日本語', topNext: '日本語 JLPT', mobileNext: '日',
    levels: HSK_LEVEL_ORDER, vocabKey: 'hsk', bankKey: 'mandarinBank',
    labels: {dashboard:'Dashboard', vocabulary:'HSK Vocabulary', practice:'HSK Practice', listening:'Mandarin Listening', check:'Practice Check', expressions:'Frasa & Chengyu', achievements:'Achievements', progress:'Progress'},
    pageTitles: {dashboard:'Mandarin Dashboard', vocabulary:'HSK Vocabulary', practice:'HSK Practice', listening:'Mandarin Listening', check:'Mandarin Practice Check', expressions:'Mandarin Frasa & Chengyu', achievements:'Achievements', progress:'Mandarin Progress'},
    hero: ['Mandarin page','Belajar HSK Mandarin tanpa campur IELTS','Ini halaman Mandarin khusus: HSK vocabulary, practice, listening, writing, speaking, dan tone trainer 1–4.','Start HSK Vocabulary'],
    dashboard: ['HSK words','HSK modules','Mandarin lessons','Mandarin Progress'],
    vocab: ['Mandarin vocabulary','HSK 1–6 vocabulary list dulu','Semua HSK 1–6 tampil sebagai list. Klik Hanzi untuk detail, pinyin, arti, contoh, lalu tandai Learned atau Difficult.','Cari hanzi / pinyin / arti...'],
    practice: ['HSK practice','Bank soal Mandarin: 40 soal per practice','Setiap level HSK punya banyak practice. Klik Pilih untuk mulai mengerjakan.'],
    listening: ['Mandarin listening','Mandarin HSK listening library','Pilih topik HSK, dengarkan target yang sesuai lesson, lalu latihan secara interaktif.'],
    check: ['Mandarin checker','Mandarin Writing, Speaking, Tone','Latihan writing, speaking, dan nada Mandarin dengan tampilan bersih.','Mandarin Writing Check','Mandarin Speaking Check'],
    expr: ['Mandarin phrases','Mandarin phrases & 成语','Frasa Mandarin, pola kalimat, dan chengyu untuk memperkaya jawaban.'],
    flow: '<b>Mandarin Flow</b><br>1. HSK 1–6 vocabulary<br>2. Practice soal<br>3. Listening<br>4. Tone trainer',
    quick: [
      ['1','HSK 1–6 Vocabulary','Hanzi, pinyin, arti, contoh.','vocabulary'],
      ['2','HSK Practice','Meaning, pinyin, hanzi, short answer.','practice'],
      ['3','Mandarin Listening','Materi HSK + pertanyaan.','listening'],
      ['4','Tone + Speaking Check','Latihan nada 1–4 dan speaking.','check']
    ],
    writingTasks: ['HSK Short Writing','HSK Sentence Building','Chinese Self Introduction','Scholarship Study Plan 中文'],
    writingPlaceholder: '在这里写中文作文 / 句子 / 自我介绍...',
    speakingPrompts: [
      {label:'HSK 1: 自我介绍', target:'你好，我叫Hosea。我是学生。我喜欢学习中文。'},
      {label:'HSK 2: 爱好', target:'我的爱好是学习语言和听音乐。'},
      {label:'HSK 3: 学习计划', target:'因为我想去中国留学，所以我每天学习中文。'},
      {label:'Tone drill: ma1 ma2 ma3 ma4', target:'妈 麻 马 骂'}
    ],
    dailyTitle: 'Daily Mandarin Boost'
  },
  japanese: {
    lang: 'Japanese', speech: 'ja-JP', className: 'japanese-mode',
    brand: 'Japanese JLPT Studio', badge: 'JAPANESE MODE', title: 'JLPT Japanese 日本語', desc: 'JLPT N5–N1 dengan 11.800+ vocab full-style, kana, kanji, grammar, listening, speaking.',
    next: 'Switch to English IELTS', topNext: 'English IELTS', mobileNext: 'EN',
    levels: JLPT_LEVEL_ORDER, vocabKey: 'jlpt', bankKey: 'japaneseBank',
    labels: {dashboard:'Dashboard', vocabulary:'JLPT Vocabulary', practice:'JLPT Practice', listening:'Japanese Listening', check:'Practice Check', expressions:'Japanese Phrases', achievements:'Achievements', progress:'Progress'},
    pageTitles: {dashboard:'Japanese Dashboard', vocabulary:'JLPT Vocabulary', practice:'JLPT Practice', listening:'Japanese Listening', check:'Japanese Practice Check', expressions:'Japanese Phrases', achievements:'Achievements', progress:'Japanese Progress'},
    hero: ['Japanese JLPT page','Belajar JLPT Jepang dari N5 sampai N1','Mode Jepang sekarang berisi 11.800+ JLPT-style vocabulary, 250 grammar patterns, 100 listening drills, practice bank, dan AI feedback.','Start JLPT Vocabulary'],
    dashboard: ['JLPT words','JLPT modules','Japanese lessons','Japanese Progress'],
    vocab: ['Japanese vocabulary','JLPT N5–N1 full-style vocabulary list','11.800+ kosakata/word family Jepang disusun per level JLPT. Klik kata untuk detail kanji, kana, romaji, arti, dan contoh.','Cari kanji / kana / romaji / arti...'],
    practice: ['JLPT practice','Bank soal JLPT: 40 soal per practice','Latihan vocab, kanji, kana, romaji, grammar, reading, dan listening per level JLPT. Sekarang ada 20 set per level.'],
    listening: ['Japanese listening','100 Japanese JLPT listening drills','Pilih topik JLPT, dengarkan target yang sesuai lesson, lalu latihan Dictation, Missing, Word Catch, atau Shadowing.'],
    check: ['Japanese checker','Japanese Writing & Speaking','Latihan menulis dan speaking bahasa Jepang dengan bantuan AI feedback.','Japanese Writing Check','Japanese Speaking Check'],
    expr: ['Japanese phrases','250 Japanese grammar patterns','Pola kalimat Jepang N5–N1 untuk JLPT, conversation, writing, dan reading.'],
    flow: '<b>Japanese Flow</b><br>1. 11.800+ JLPT vocab<br>2. Kana/kanji/romaji practice<br>3. 100 listening drills<br>4. Writing & speaking' ,
    quick: [
      ['1','11.800+ JLPT Vocabulary','Kanji, kana, romaji, arti.','vocabulary'],
      ['2','JLPT Practice','Vocab, kanji, grammar, reading.','practice'],
      ['3','Japanese Listening','Latihan listening JLPT.','listening'],
      ['4','Writing & Speaking Check','Koreksi bahasa Jepang.','check']
    ],
    writingTasks: ['JLPT Short Writing','Japanese Sentence Building','Japanese Self Introduction','Study Plan 日本語'],
    writingPlaceholder: 'ここに日本語の文 / 自己紹介 / JLPT作文を書いてください...',
    speakingPrompts: [
      {label:'JLPT N5: 自己紹介', target:'はじめまして。私はホセアです。高校生です。日本語を勉強しています。'},
      {label:'JLPT N4: 趣味', target:'私の趣味は音楽を聞くことと、言語を勉強することです。'},
      {label:'JLPT N3: 学習計画', target:'将来日本へ行きたいので、毎日日本語を勉強するようにしています。'},
      {label:'Kana pronunciation drill', target:'あ い う え お、か き く け こ、さ し す せ そ'}
    ],
    dailyTitle: 'Daily Japanese Boost'
  },
  german: {
    lang: 'German', speech: 'de-DE', className: 'german-mode',
    brand: 'German CEFR Studio', badge: 'GERMAN MODE', title: 'Deutsch · Goethe / CEFR', desc: 'German A1–C2, vocabulary, grammar, listening, writing, speaking.',
    next: 'Pilih Bahasa', topNext: 'Pilih Bahasa', mobileNext: 'DE',
    levels: GERMAN_LEVEL_ORDER, vocabKey: 'german', bankKey: 'germanBank',
    labels: {dashboard:'Dashboard', vocabulary:'German Vocabulary', practice:'German Practice', listening:'German Listening', check:'Practice Check', expressions:'German Phrases', achievements:'Achievements', progress:'Progress'},
    pageTitles: {dashboard:'German Dashboard', vocabulary:'German Vocabulary', practice:'German CEFR Practice', listening:'German Listening', check:'German Practice Check', expressions:'German Phrases', achievements:'Achievements', progress:'German Progress'},
    hero: ['Deutsch lernen','Belajar bahasa Jerman dari A1 sampai C2','Mode Jerman disusun berdasarkan level CEFR A1–C2 dengan vocabulary, grammar, listening, writing, speaking, dan AI feedback.','Start German Vocabulary'],
    dashboard: ['German words','German modules','German lessons','German Progress'],
    vocab: ['German vocabulary','Deutsch A1–C2 vocabulary list','Kosakata dan frasa Jerman disusun per level CEFR. Klik kata untuk melihat arti, contoh, grammar note, lalu simpan ke akun.','Cari Deutsch / arti / contoh...'],
    practice: ['German practice','Bank soal German CEFR: 40 soal per practice','Latihan vocabulary, sentence meaning, grammar, dan level A1–C2.'],
    listening: ['German listening','German listening A1–C2','Pilih lesson Deutsch, dengarkan target, lalu latihan Dictation, Missing Words, Word Catch, atau Shadowing.'],
    check: ['German checker','German Writing & Speaking','Latihan menulis dan speaking Deutsch dengan AI feedback sesuai level CEFR.','German Writing Check','German Speaking Check'],
    expr: ['German phrases','German phrases & grammar','Frasa dan pola kalimat Deutsch A1–C2 untuk conversation dan ujian bahasa.'],
    flow: '<b>German Flow</b><br>1. Vocabulary A1–C2<br>2. Practice soal<br>3. Listening Lab<br>4. Writing & speaking',
    quick: [
      ['1','German Vocabulary','Vocabulary & phrases A1–C2.','vocabulary'],
      ['2','German Practice','Vocab, grammar, sentence meaning.','practice'],
      ['3','German Listening','Dictation, Missing, Word Catch.','listening'],
      ['4','Writing & Speaking Check','AI feedback bahasa Jerman.','check']
    ],
    writingTasks: ['Goethe / CEFR Writing','German Sentence Building','German Self Introduction','Study Plan Deutsch'],
    writingPlaceholder: 'Schreibe hier deinen deutschen Text / deine Sätze...',
    speakingPrompts: [
      {label:'A1: Sich vorstellen', target:'Hallo, ich heiße Hosea. Ich bin Schüler und lerne Deutsch.'},
      {label:'A2: Mein Alltag', target:'Jeden Morgen gehe ich zur Schule und am Abend lerne ich Sprachen.'},
      {label:'B1: Zukunftspläne', target:'In Zukunft möchte ich im Ausland studieren, weil ich neue Erfahrungen sammeln will.'},
      {label:'B2: Bildung und Technologie', target:'Digitale Technologien können den Unterricht verbessern, wenn sie sinnvoll eingesetzt werden.'}
    ],
    dailyTitle: 'Daily German Boost'
  }
};


const WRITING_PROMPTS = {
  english: {
    'IELTS Task 2': [
      { type:'Agree or Disagree', minWords:250, time:'40 menit', title:'Education and practical skills', prompt:'Some people believe that schools should teach practical life skills, such as managing money and cooking, in addition to academic subjects. To what extent do you agree or disagree?' },
      { type:'Discuss Both Views', minWords:250, time:'40 menit', title:'Online and classroom learning', prompt:'Some people think online education is more effective than classroom learning, while others believe face-to-face teaching is better. Discuss both views and give your own opinion.' },
      { type:'Advantages and Disadvantages', minWords:250, time:'40 menit', title:'Living in a large city', prompt:'More young people are choosing to live in large cities. What are the advantages and disadvantages of this development?' },
      { type:'Problem and Solution', minWords:250, time:'40 menit', title:'Traffic congestion', prompt:'Traffic congestion is becoming a serious problem in many cities. What are the main causes of this problem, and what measures can be taken to solve it?' },
      { type:'Two-part Question', minWords:250, time:'40 menit', title:'Social media use', prompt:'People are spending more time on social media than ever before. Why has this happened? Is this a positive or negative development?' },
      { type:'Agree or Disagree', minWords:250, time:'40 menit', title:'Free university education', prompt:'Some people believe that university education should be free for all students. To what extent do you agree or disagree?' },
      { type:'Discuss Both Views', minWords:250, time:'40 menit', title:'Working from home', prompt:'Some people believe working from home benefits employees and companies, while others think it creates more problems than advantages. Discuss both views and give your opinion.' },
      { type:'Problem and Solution', minWords:250, time:'40 menit', title:'Declining physical activity', prompt:'Many children today do less physical activity than in the past. Why is this happening, and what can parents and schools do about it?' }
    ],
    'IELTS Task 1': [
      { type:'Academic Task 1 · Table', minWords:150, time:'20 menit', title:'International students', prompt:'The table shows the number of international students at three universities in 2015 and 2025. University A: 2,400 → 4,100; University B: 3,000 → 3,600; University C: 1,800 → 3,900. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.' },
      { type:'Academic Task 1 · Line graph', minWords:150, time:'20 menit', title:'Public transport use', prompt:'A line graph shows the percentage of commuters using public transport in City X from 2010 to 2025: 2010 = 28%, 2015 = 34%, 2020 = 31%, 2025 = 46%. Summarise the main trends and compare the figures.' },
      { type:'Academic Task 1 · Process', minWords:150, time:'20 menit', title:'Recycling plastic bottles', prompt:'Describe a process in which used plastic bottles are collected, sorted, cleaned, crushed, melted, and manufactured into new products. Summarise the stages in a clear sequence.' },
      { type:'General Task 1 · Formal letter', minWords:150, time:'20 menit', title:'Complaint about a course', prompt:'You recently attended a short course but were dissatisfied with its organisation. Write a letter to the course manager. Describe the course, explain the problems, and say what action you would like the manager to take.' }
    ],
    'IELTS Short Answer': [
      { type:'Short response', minWords:40, time:'5 menit', title:'Study habits', prompt:'What is one study habit that has helped you learn more effectively? Explain why it works for you and give one example.' },
      { type:'Short response', minWords:40, time:'5 menit', title:'Technology in education', prompt:'Mention one benefit and one drawback of using technology in the classroom.' },
      { type:'Short response', minWords:40, time:'5 menit', title:'Future goal', prompt:'Describe one academic or career goal you want to achieve in the next five years.' }
    ],
    'Scholarship Essay': [
      { type:'Motivation essay', minWords:180, time:'30 menit', title:'Why you deserve the scholarship', prompt:'Explain your academic goals, the challenges you have overcome, and how this scholarship would help you contribute to your community.' },
      { type:'Study plan', minWords:180, time:'30 menit', title:'Your study and career plan', prompt:'Describe the field you want to study, why you chose it, and what you plan to do after graduation.' }
    ]
  },
  mandarin: {
    'HSK Short Writing': [
      { type:'短文写作', minWords:60, time:'15 分钟', title:'我的学习计划', prompt:'请写一篇短文，介绍你的中文学习计划。你为什么学习中文？你每天怎么学习？你的目标是什么？' },
      { type:'短文写作', minWords:60, time:'15 分钟', title:'我最喜欢的一天', prompt:'请写一篇短文，介绍你最喜欢的一天。你做了什么？和谁在一起？为什么难忘？' }
    ],
    'HSK Sentence Building': [
      { type:'造句', minWords:20, time:'8 分钟', title:'使用关联词', prompt:'请用“因为……所以……”、“虽然……但是……”和“如果……就……”各写一个句子。' },
      { type:'造句', minWords:20, time:'8 分钟', title:'描述日常活动', prompt:'请用“先、然后、最后”写三到五个句子，描述你一天的活动。' }
    ],
    'Chinese Self Introduction': [
      { type:'自我介绍', minWords:50, time:'10 分钟', title:'介绍你自己', prompt:'请介绍你的名字、年龄、学校、兴趣、家庭和未来计划。' }
    ],
    'Scholarship Study Plan 中文': [
      { type:'留学计划', minWords:120, time:'25 分钟', title:'中国留学计划', prompt:'请说明你为什么想去中国学习、想学什么专业、如何提高中文水平，以及毕业后的计划。' }
    ]
  },
  japanese: {
    'JLPT Short Writing': [
      { type:'短作文', minWords:80, time:'15分', title:'私の勉強計画', prompt:'日本語を勉強する理由、毎日の勉強方法、そして将来の目標について書いてください。' },
      { type:'短作文', minWords:80, time:'15分', title:'忘れられない日', prompt:'あなたの忘れられない一日について、何をしたか、誰といたか、なぜ大切だったかを書いてください。' }
    ],
    'Japanese Sentence Building': [
      { type:'文作り', minWords:25, time:'8分', title:'文法を使う', prompt:'「ので」「ながら」「ように」を使って、それぞれ一つずつ文を作ってください。' },
      { type:'文作り', minWords:25, time:'8分', title:'毎日の生活', prompt:'「まず、次に、最後に」を使って、あなたの一日の流れを書いてください。' }
    ],
    'Japanese Self Introduction': [
      { type:'自己紹介', minWords:60, time:'10分', title:'自己紹介', prompt:'名前、年齢、学校、趣味、家族、将来の夢について自己紹介を書いてください。' }
    ],
    'Study Plan 日本語': [
      { type:'留学計画', minWords:140, time:'25分', title:'日本での勉強計画', prompt:'日本で何を勉強したいか、なぜその分野を選んだか、日本語をどう上達させるか、卒業後に何をしたいかを書いてください。' }
    ]
  },
  german: {
    'Goethe / CEFR Writing': [
      { type:'CEFR A2–B1 Writing', minWords:80, time:'20 menit', title:'Meine Lernziele', prompt:'Schreibe über deine Lernziele. Warum lernst du Deutsch, wie lernst du jeden Tag und was möchtest du in Zukunft erreichen?' },
      { type:'CEFR B1 Writing', minWords:100, time:'25 menit', title:'Online lernen', prompt:'Online-Unterricht wird immer beliebter. Beschreibe Vorteile und Nachteile und erkläre deine Meinung.' },
      { type:'CEFR B2 Writing', minWords:150, time:'30 menit', title:'Technologie in der Bildung', prompt:'Sollten Schulen mehr digitale Technologien im Unterricht einsetzen? Begründe deine Meinung mit Beispielen.' }
    ],
    'German Sentence Building': [
      { type:'Satzbau A1–A2', minWords:30, time:'10 menit', title:'Verbposition', prompt:'Schreibe fünf Sätze über deinen Alltag. Verwende heute, weil, aber und dann. Achte auf die Verbposition.' },
      { type:'Satzbau B1', minWords:50, time:'12 menit', title:'Nebensätze', prompt:'Schreibe Sätze mit weil, obwohl, wenn und damit. Verbinde die Sätze zu einem kurzen Text.' }
    ],
    'German Self Introduction': [
      { type:'Vorstellung A1', minWords:60, time:'12 menit', title:'Stell dich vor', prompt:'Stell dich vor. Schreibe über deinen Namen, dein Alter, deine Schule, deine Hobbys, deine Familie und deine Zukunftspläne.' }
    ],
    'Study Plan Deutsch': [
      { type:'Studienplan B1–B2', minWords:140, time:'30 menit', title:'Mein Studienplan', prompt:'Erkläre, was du studieren möchtest, warum du dieses Fach gewählt hast, wie du dein Deutsch verbessern willst und was du nach dem Studium machen möchtest.' }
    ]
  }
};

const state = {
  mode: 'english', page: 'dashboard',
  data: { ielts: [], hsk: [], jlpt: [], german: [], listening: [], expressions: [], englishGrammar: [], mandarinGrammar: [], japaneseGrammar: [], germanGrammar: [], englishBank: [], mandarinBank: [], japaneseBank: [], germanBank: [] },
  vocabLevel: 'all', vocabQuery: '', vocabLimit: 80, selectedWord: null,
  practiceType: 'all', practiceLevel: 'all', practiceQuery: '', selectedLesson: null, selectedModule: null,
  flashWords: [], flashIndex: 0, flashBack: false, recognition: null, currentTone: null, lastToneAnalysis: null, toneRecording: false, writingPromptIndex: 0, appReady: false, listeningMode: 'dictation', listeningHearts: 3, listeningCombo: 0, listeningHintUsed: false, listeningWordSequence: [], listeningAwarded: false, listeningPlaybackRate: .75, listeningSpeechRecognition: null, loadedModes: {}, modeLoadPromise: null
};

const defaultProgress = { learned: {}, hard: {}, saved: {}, donePractice: {}, scores: [], stats: { aiChecks: 0, tonePassed: 0, xp: 0, listeningCorrect: 0, listeningComboBest: 0, shadowingDone: 0, listeningHighAccuracy: 0, listeningDays: {}, listeningDaily: { day: '', correct: 0, rewarded: false } } };
const defaultAchievements = { unlocked: {} };
let progress = loadProgress();
let achievements = loadAchievements();
let savedWritings = [];
let resolveAppReady;
const appReadyPromise = new Promise(resolve => { resolveAppReady = resolve; });
let vocabRenderTimer = null;
let lastVocabKey = '';
let lastVocabData = [];

function $(q, root = document){ return root.querySelector(q); }
function $all(q, root = document){ return [...root.querySelectorAll(q)]; }
function esc(v=''){ return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function norm(v=''){ return String(v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }

function inlineMarkdown(raw=''){
  let text=esc(raw);
  text=text.replace(/\[\[BR\]\]/g,'<br>');
  text=text.replace(/`([^`]+)`/g,'<code>$1</code>');
  text=text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  text=text.replace(/__([^_]+)__/g,'<strong>$1</strong>');
  text=text.replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');
  return text;
}
function isTableDivider(line=''){ return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line); }
function tableCells(line=''){ return line.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim()); }
function markdownToSafeHtml(raw=''){
  const normalized=String(raw||'').replace(/<br\s*\/?\s*>/gi,'[[BR]]').replace(/\r\n?/g,'\n').trim();
  if(!normalized) return '';
  const lines=normalized.split('\n');
  const out=[]; let i=0;
  while(i<lines.length){
    const line=lines[i]; const trimmed=line.trim();
    if(!trimmed){ i++; continue; }
    if(trimmed.startsWith('```')){
      const code=[]; i++;
      while(i<lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      if(i<lines.length) i++;
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); continue;
    }
    if(line.includes('|') && i+1<lines.length && isTableDivider(lines[i+1])){
      const headers=tableCells(line); i+=2; const rows=[];
      while(i<lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(tableCells(lines[i++]));
      out.push(`<div class="ai-table-wrap"><table><thead><tr>${headers.map(x=>`<th>${inlineMarkdown(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${headers.map((_,idx)=>`<td>${inlineMarkdown(row[idx]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    const heading=trimmed.match(/^(#{1,4})\s+(.+)$/);
    if(heading){ const level=Math.min(4,heading[1].length+2); out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); i++; continue; }
    if(/^---+$/.test(trimmed)){ out.push('<hr>'); i++; continue; }
    if(/^>\s?/.test(trimmed)){ const quote=[]; while(i<lines.length && /^>\s?/.test(lines[i].trim())) quote.push(lines[i++].trim().replace(/^>\s?/,'')); out.push(`<blockquote>${inlineMarkdown(quote.join(' '))}</blockquote>`); continue; }
    if(/^[-*•]\s+/.test(trimmed)){
      const items=[]; while(i<lines.length && /^[-*•]\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^[-*•]\s+/,'')); out.push(`<ul>${items.map(x=>`<li>${inlineMarkdown(x)}</li>`).join('')}</ul>`); continue;
    }
    if(/^\d+[.)]\s+/.test(trimmed)){
      const items=[]; while(i<lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+[.)]\s+/,'')); out.push(`<ol>${items.map(x=>`<li>${inlineMarkdown(x)}</li>`).join('')}</ol>`); continue;
    }
    const paragraph=[trimmed]; i++;
    while(i<lines.length){
      const next=lines[i].trim();
      if(!next || next.startsWith('```') || /^(#{1,4})\s+/.test(next) || /^[-*•]\s+/.test(next) || /^\d+[.)]\s+/.test(next) || /^>\s?/.test(next) || /^---+$/.test(next) || (lines[i].includes('|') && i+1<lines.length && isTableDivider(lines[i+1]))) break;
      paragraph.push(next); i++;
    }
    out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
  }
  return out.join('');
}
function setResultMarkdown(target,text){ const el=typeof target==='string'?$(target):target; if(!el) return; el.innerHTML=markdownToSafeHtml(text); }
function setResultText(target,text){ const el=typeof target==='string'?$(target):target; if(!el) return; el.textContent=text; }

function cfg(){ return CONFIG[state.mode] || CONFIG.english; }
function isEnglish(){ return state.mode === 'english'; }
function isMandarin(){ return state.mode === 'mandarin'; }
function isJapanese(){ return state.mode === 'japanese'; }
function isGerman(){ return state.mode === 'german'; }
function usesWordSpacing(){ return isEnglish() || isGerman(); }
function normalizeProgress(raw={}){
  const incomingStats=raw.stats||{};
  return {
    learned:{...(raw.learned||{})}, hard:{...(raw.hard||{})}, saved:{...(raw.saved||{})}, donePractice:{...(raw.donePractice||{})},
    scores:Array.isArray(raw.scores)?raw.scores:[],
    stats:{...defaultProgress.stats,...incomingStats,listeningDays:{...(incomingStats.listeningDays||{})},listeningDaily:{...defaultProgress.stats.listeningDaily,...(incomingStats.listeningDaily||{})}}
  };
}
function normalizeAchievements(raw={}){ return { unlocked:{...(raw.unlocked||{})} }; }
function save(){
  if(Array.isArray(progress.scores) && progress.scores.length>500) progress.scores=progress.scores.slice(-500);
  checkAchievements();
  localStorage.setItem('lexora-split-progress', JSON.stringify(progress));
  localStorage.setItem('lexora-achievements', JSON.stringify(achievements));
  window.LexoraCloud?.queueSave?.({progress, achievements, lastMode:state.mode});
}
function loadProgress(){ try { return normalizeProgress(JSON.parse(localStorage.getItem('lexora-split-progress') || '{}')); } catch { return normalizeProgress(); } }
function loadAchievements(){ try { return normalizeAchievements(JSON.parse(localStorage.getItem('lexora-achievements') || '{}')); } catch { return normalizeAchievements(); } }
function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }
async function loadJson(path){ const r = await fetch(path); if(!r.ok) throw new Error(path); return r.json(); }

function showModeLoading(mode, show=true){
  const overlay=$('#modeLoadingOverlay');
  if(!overlay) return;
  const c=CONFIG[mode]||CONFIG.english;
  $('#modeLoadingTitle').textContent=show?`Menyiapkan ${c.title}…`:'Materi siap';
  $('#modeLoadingText').textContent='Kosakata dan latihan dimuat hanya saat dibutuhkan supaya Lexora lebih ringan.';
  overlay.classList.toggle('show',!!show);
  overlay.setAttribute('aria-hidden',String(!show));
}
async function ensureModeData(mode){
  if(state.loadedModes[mode]) return;
  const asset=MODE_ASSETS[mode];
  if(!asset) return;
  if(state.modeLoadPromise?.mode===mode) return state.modeLoadPromise.promise;
  showModeLoading(mode,true);
  const promise=(async()=>{
    const [vocab,grammar]=await Promise.all([loadJson(asset.vocabPath),loadJson(asset.grammarPath)]);
    state.data[asset.vocabKey]=vocab;
    state.data[asset.grammarKey]=grammar;
    state.data[asset.bankKey]=asset.build(vocab,grammar);
    state.loadedModes[mode]=true;
  })().finally(()=>{state.modeLoadPromise=null;showModeLoading(mode,false)});
  state.modeLoadPromise={mode,promise};
  return promise;
}

function vocabData(){ return state.data[cfg().vocabKey] || []; }
function practiceData(){ return state.data[cfg().bankKey] || []; }
function listeningData(){ return state.data.listening.filter(x => x.language === cfg().lang); }
function expressionData(){ return state.data.expressions.filter(x => x.language === cfg().lang); }
function levelList(){ return cfg().levels; }
function levelOrderIndex(level){ const i = levelList().indexOf(level); return i === -1 ? 999 : i; }

function uniqueBy(arr, keyFn){ const seen = new Set(); return arr.filter(item => { const key = keyFn(item); if(seen.has(key)) return false; seen.add(key); return true; }); }
function shuffleClone(items){ const arr=[...items]; for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function buildOptions(correct, pool){ const others = uniqueBy((pool||[]).filter(x => x && norm(x) !== norm(correct)), x => norm(x)).slice(0, 3); return shuffleClone([correct || '-', ...others]); }
function chunkCycle(items, start, count){ if(!items.length) return []; const out=[]; for(let i=0;i<count;i++) out.push(items[(start+i) % items.length]); return out; }
function difficultyLabel(n, hardFrom=8){ return n <= 3 ? 'Mudah' : n <= hardFrom ? 'Sedang' : 'Menantang'; }
function learnerCount(){ return ''; }

function buildEnglishPracticeBank(vocab, grammar, expressions){
  const materials = [
    {key:'Vocabulary', title:'Vocabulary Builder', level:'Band 5-6'},
    {key:'Grammar', title:'Grammar Builder', level:'Band 5-6'},
    {key:'Reading', title:'Reading Skills', level:'Band 6-7'},
    {key:'Mixed', title:'IELTS Mixed Test', level:'Band 6-7'}
  ];
  const passages = [
    'Online learning offers flexibility, but students still need discipline and time management.',
    'Public transport helps reduce traffic congestion and pollution when it is reliable.',
    'Technology can improve education because students get more access to resources.',
    'Healthy routines can improve study performance and concentration.'
  ];
  const all = [];
  materials.forEach((mat, mi) => {
    for(let set=1; set<=10; set++){
      const words = chunkCycle(vocab, mi*400 + (set-1)*40, 40);
      const g = chunkCycle(grammar, set-1, Math.min(4, grammar.length));
      const expr = chunkCycle(expressions.filter(x => x.language === 'English'), (set-1)*3, 3);
      const questions=[];
      if(mat.key === 'Vocabulary' || mat.key === 'Mixed'){
        words.slice(0,10).forEach(w => questions.push({q:`Choose the best meaning of "${w.word}".`, options: buildOptions(w.meaning, words.map(x=>x.meaning)), answer:w.meaning}));
        words.slice(10,20).forEach(w => questions.push({q:`Fill in the blank with the best word: ${(w.example||'').replace(new RegExp(w.word||'', 'i'), '_____')}`, answer:w.word}));
      }
      if(mat.key === 'Grammar' || mat.key === 'Mixed'){
        g.forEach(item => (item.exercise||[]).forEach(ex => questions.push({q:`${item.topic}: ${ex.q}`, options:ex.options, answer:ex.answer})));
      }
      if(mat.key === 'Reading' || mat.key === 'Mixed'){
        const passage = passages[(mi+set-1)%passages.length];
        questions.push({q:`Reading passage: ${passage} What is the main topic?`, options:['Learning / daily life','Weather','Cooking','Shopping'], answer:'Learning / daily life'});
        questions.push({q:`According to the passage, students still need _____.`, answer:'discipline'});
      }
      expr.forEach(ex => questions.push({q:`Choose the meaning of "${ex.phrase}".`, options: buildOptions(ex.meaning, expressions.map(x=>x.meaning)), answer:ex.meaning}));
      let i=0; while(questions.length<40 && words.length){ const w=words[i%words.length]; questions.push(i%2?{q:`Write one synonym/meaning of "${w.word}".`, answer:w.meaning}:{q:`What IELTS band is closest to: ${w.word}?`, options:buildOptions(w.band||w.level||'Band 6', IELTS_LEVEL_ORDER), answer:w.band||w.level||'Band 6'}); i++; }
      all.push({ id:`en-${mat.key.toLowerCase()}-${set}`, type:mat.title, group:mat.title, level:IELTS_LEVEL_ORDER[(set-1)%IELTS_LEVEL_ORDER.length], difficulty:difficultyLabel(set), questionCount:40, reward:'4850 XP', learners:learnerCount(), title:`${mat.title} Practice ${set}`, passage:`Set ${set} · 40 soal · fokus ${mat.title.toLowerCase()}.`, questions:questions.slice(0,40) });
    }
  });
  return all;
}

function buildMandarinPracticeBank(vocab, grammar){
  const all=[];
  HSK_LEVEL_ORDER.forEach((level, li) => {
    const words = vocab.filter(w => (w.hsk || w.level) === level);
    for(let set=1; set<=20; set++){
      const chunk = chunkCycle(words, (set-1)*40, 40); const g = chunkCycle(grammar.filter(x => x.level === level), set-1, 1)[0] || grammar[li%grammar.length] || {}; const questions=[];
      chunk.slice(0,10).forEach(w => questions.push({q:`${w.hanzi} (${w.pinyin}) artinya apa?`, options:buildOptions(w.english||w.meaning, chunk.map(x=>x.english||x.meaning)), answer:w.english||w.meaning}));
      chunk.slice(10,20).forEach(w => questions.push({q:`Pinyin yang benar untuk ${w.hanzi} adalah ...`, options:buildOptions(w.pinyin, chunk.map(x=>x.pinyin)), answer:w.pinyin}));
      chunk.slice(20,30).forEach(w => questions.push({q:`Pilih Hanzi untuk arti "${w.english||w.meaning}".`, options:buildOptions(w.hanzi, chunk.map(x=>x.hanzi)), answer:w.hanzi}));
      if(g.exercise) g.exercise.forEach(ex => questions.push({q:`${g.topic}: ${ex.q}`, options:ex.options, answer:ex.answer}));
      let i=0; while(questions.length<40 && chunk.length){ const w=chunk[i%chunk.length]; questions.push(i%2?{q:`Tulis arti dari ${w.hanzi}.`, answer:w.english||w.meaning}:{q:`Level HSK untuk ${w.hanzi} adalah ...`, options:buildOptions(level, HSK_LEVEL_ORDER), answer:level}); i++; }
      all.push({ id:`zh-${level.replace(/\s+/g,'-').toLowerCase()}-${set}`, type:'HSK Practice', group:'HSK Practice', level, difficulty:li<=1?'Mudah':li<=3?'Sedang':'Menantang', questionCount:40, reward:'4850 XP', learners:'', title:`${level} Practice ${set}`, passage:`Set ${set} · 40 soal · vocab, pinyin, hanzi, dan grammar ${level}.`, questions:questions.slice(0,40) });
    }
  });
  return all;
}

function buildJapanesePracticeBank(vocab, grammar){
  const all=[];
  JLPT_LEVEL_ORDER.forEach((level, li) => {
    const words = vocab.filter(w => (w.jlpt || w.level) === level);
    for(let set=1; set<=20; set++){
      const chunk = chunkCycle(words, (set-1)*40, 40); const g = chunkCycle(grammar.filter(x => x.level === level), set-1, 1)[0] || grammar[li%grammar.length] || {}; const questions=[];
      chunk.slice(0,10).forEach(w => questions.push({q:`${w.kanji} (${w.kana}) artinya apa?`, options:buildOptions(w.meaning, chunk.map(x=>x.meaning)), answer:w.meaning}));
      chunk.slice(10,20).forEach(w => questions.push({q:`Kana yang benar untuk ${w.kanji} adalah ...`, options:buildOptions(w.kana, chunk.map(x=>x.kana)), answer:w.kana}));
      chunk.slice(20,30).forEach(w => questions.push({q:`Pilih kata Jepang untuk arti "${w.meaning}".`, options:buildOptions(w.kanji, chunk.map(x=>x.kanji)), answer:w.kanji}));
      chunk.slice(30,36).forEach(w => questions.push({q:`Romaji yang benar untuk ${w.kanji} adalah ...`, options:buildOptions(w.romaji, chunk.map(x=>x.romaji)), answer:w.romaji}));
      if(g.exercise) g.exercise.forEach(ex => questions.push({q:`${g.topic}: ${ex.q}`, options:ex.options, answer:ex.answer}));
      let i=0; while(questions.length<40 && chunk.length){ const w=chunk[i%chunk.length]; questions.push(i%2?{q:`Tulis arti Indonesia dari ${w.kanji} (${w.kana}).`, answer:w.meaning}:{q:`Level JLPT untuk ${w.kanji} adalah ...`, options:buildOptions(level, JLPT_LEVEL_ORDER), answer:level}); i++; }
      all.push({ id:`jp-${level.replace(/\s+/g,'-').toLowerCase()}-${set}`, type:'JLPT Practice', group:'JLPT Practice', level, difficulty:li<=1?'Mudah':li<=3?'Sedang':'Menantang', questionCount:40, reward:'4850 XP', learners:'', title:`${level} Practice ${set}`, passage:`Set ${set} · 40 soal · vocab, kana, kanji, romaji, grammar ${level}.`, questions:questions.slice(0,40) });
    }
  });
  return all;
}


function buildGermanPracticeBank(vocab, grammar){
  const all=[];
  GERMAN_LEVEL_ORDER.forEach((level, li) => {
    const words=vocab.filter(w=>(w.level||`CEFR ${w.cefr}`)===level);
    const levelGrammar=grammar.filter(x=>x.level===level);
    for(let set=1; set<=20; set++){
      const chunk=chunkCycle(words,(set-1)*40,40);
      const g=chunkCycle(levelGrammar,set-1,2);
      const questions=[];
      chunk.slice(0,12).forEach(w=>questions.push({q:`Apa arti bahasa Indonesia dari "${w.word}"?`,options:buildOptions(w.meaning,chunk.map(x=>x.meaning)),answer:w.meaning}));
      chunk.slice(12,24).forEach(w=>questions.push({q:`Pilih Deutsch yang paling sesuai untuk arti "${w.meaning}".`,options:buildOptions(w.word,chunk.map(x=>x.word)),answer:w.word}));
      chunk.slice(24,32).forEach(w=>questions.push({q:`Level CEFR untuk "${w.word}" adalah ...`,options:buildOptions(level,GERMAN_LEVEL_ORDER),answer:level}));
      g.forEach(item=>(item.exercise||[]).forEach(ex=>questions.push({q:`${item.topic}: ${ex.q}`,options:ex.options,answer:ex.answer})));
      let i=0;
      while(questions.length<40 && chunk.length){
        const w=chunk[i%chunk.length];
        questions.push(i%2?{q:`Tulis arti dari "${w.word}".`,answer:w.meaning}:{q:`Lengkapi pengetahuanmu: "${w.word}" termasuk level ...`,options:buildOptions(level,GERMAN_LEVEL_ORDER),answer:level});
        i++;
      }
      all.push({id:`de-${level.replace(/\s+/g,'-').toLowerCase()}-${set}`,type:'German CEFR Practice',group:'German CEFR Practice',level,difficulty:li<=1?'Mudah':li<=3?'Sedang':'Menantang',questionCount:40,reward:'4850 XP',learners:'',title:`${level} Practice ${set}`,passage:`Set ${set} · 40 soal · Deutsch vocabulary dan grammar ${level}.`,questions:questions.slice(0,40)});
    }
  });
  return all;
}

async function boot(){
  try{
    // Common assets are small. Large vocab banks are loaded per language on demand.
    const [listening,expressions]=await Promise.all([loadJson(PATHS.listening),loadJson(PATHS.expressions)]);
    state.data.listening=listening;
    state.data.expressions=expressions;
    await ensureModeData('english');
    init(); applyMode(); checkAchievements(); renderAll();
    state.appReady=true; resolveAppReady?.();
    document.dispatchEvent(new CustomEvent('lexora:ready'));
    maybeDaily();
  }catch(err){
    document.body.innerHTML = `<main style="max-width:760px;margin:40px auto;font-family:Inter,sans-serif;padding:20px"><h1>Lexora gagal memuat data</h1><p>Jalankan lewat VS Code Live Server / GitHub Pages, jangan double-click file HTML.</p><pre>${esc(err.message)}</pre></main>`;
  }
}

function init(){
  $all('.nav-btn[data-page]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));
  $all('[data-jump]').forEach(b => b.addEventListener('click', () => showPage(b.dataset.jump)));
  $('#menuBtn')?.addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  document.addEventListener('click', e => { if(innerWidth <= 860 && $('#sidebar')?.classList.contains('open') && !$('#sidebar').contains(e.target) && !$('#menuBtn').contains(e.target)) $('#sidebar').classList.remove('open'); });
  ['topSwitchBtn','sideSwitchBtn','heroSwitchBtn'].forEach(id => $('#'+id)?.addEventListener('click', openLanguagePicker));
  $('#closeLanguagePicker')?.addEventListener('click', closeLanguagePicker);
  $('#languagePickerModal')?.addEventListener('click', e => { if(e.target.id==='languagePickerModal') closeLanguagePicker(); });
  $all('[data-language-mode]').forEach(btn => btn.addEventListener('click', () => selectLanguageMode(btn.dataset.languageMode)));
  $('#dailyBtn')?.addEventListener('click', openDaily); $('#openDailyFromDash')?.addEventListener('click', openDaily); $('#closeDaily')?.addEventListener('click', closeDaily); $('#startDailyPractice')?.addEventListener('click', () => { closeDaily(); showPage('practice'); });
  $('#vocabSearch')?.addEventListener('input', e => { state.vocabQuery=e.target.value; state.vocabLimit=80; scheduleRenderVocabulary(); });
  $('#vocabLevel')?.addEventListener('change', e => { state.vocabLevel=e.target.value; state.vocabLimit=80; renderVocabQuickFilters(); renderVocabulary(true); });
  $('#vocabList')?.addEventListener('scroll', () => { const el=$('#vocabList'); if(el.scrollTop + el.clientHeight > el.scrollHeight - 480) loadMoreVocabAuto(); });
  $('#flashcardBtn')?.addEventListener('click', () => openFlashcards(false)); $('#closeFlashcard')?.addEventListener('click', closeFlashcards); $('#flipCard')?.addEventListener('click', flipCard); $all('[data-review]').forEach(b => b.addEventListener('click', () => reviewCard(b.dataset.review)));
  $('#practiceSearch')?.addEventListener('input', e => { state.practiceQuery=e.target.value; renderPractice(); }); $('#practiceType')?.addEventListener('change', e => { state.practiceType=e.target.value; renderPractice(); }); $('#practiceLevel')?.addEventListener('change', e => { state.practiceLevel=e.target.value; renderPractice(); }); $('#closePractice')?.addEventListener('click', closePractice);
  $('#listeningSearch')?.addEventListener('input', renderListening); $('#listeningLevel')?.addEventListener('change', renderListening); $('#randomListening')?.addEventListener('click', randomListening);
  $('#exprSearch')?.addEventListener('input', renderExpressions); $('#exprType')?.addEventListener('change', renderExpressions);
  $('#localWritingCheck')?.addEventListener('click', localWritingCheck); $('#aiWritingCheck')?.addEventListener('click', aiWritingCheck); $('#saveWritingBtn')?.addEventListener('click', saveWritingCloud); $('#writingTask')?.addEventListener('change',()=>{ state.writingPromptIndex=0; renderWritingPrompt(); }); $('#newWritingPrompt')?.addEventListener('click',newWritingPrompt); $('#writingText')?.addEventListener('input',updateWritingWordCount); $('#startSpeak')?.addEventListener('click', startSpeech); $('#stopSpeak')?.addEventListener('click', stopSpeech); $('#aiSpeakingCheck')?.addEventListener('click', aiSpeakingCheck); $('#speakPrompt')?.addEventListener('change', renderSpeakingTarget);
  $('#newTone')?.addEventListener('click', newTone); $('#checkToneInput')?.addEventListener('click', checkToneInput); $('#loadToneWord')?.addEventListener('click', loadToneWord); $('#toneWordSearch')?.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); loadToneWord(); } }); $('#toneQuickWords')?.addEventListener('click',e=>{ const btn=e.target.closest('[data-tone-word]'); if(btn) selectToneWord(btn.dataset.toneWord); }); $('#reviewHardBtn')?.addEventListener('click', () => openFlashcards(true));
  $all('[data-bug-open]').forEach(btn => btn.addEventListener('click', openBugModal)); $('#closeBugModal')?.addEventListener('click', closeBugModal); $('#bugForm')?.addEventListener('submit', submitBugReport); $('#bugImage')?.addEventListener('change', renderBugImagePreview);
  $all('[data-account-open]').forEach(btn=>btn.addEventListener('click',()=>window.LexoraCloud?.openAccount?.()));
}

function openLanguagePicker(){
  const modal=$('#languagePickerModal');
  if(!modal) return;
  $all('[data-language-mode]',modal).forEach(btn=>{
    const active=btn.dataset.languageMode===state.mode;
    btn.classList.toggle('active',active);
    const badge=btn.querySelector('[data-language-status]');
    if(badge) badge.textContent=active?'Sedang dipakai':'Pilih';
  });
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('language-picker-open');
}
function closeLanguagePicker(){
  $('#languagePickerModal')?.classList.remove('show');
  $('#languagePickerModal')?.setAttribute('aria-hidden','true');
  document.body.classList.remove('language-picker-open');
}
async function selectLanguageMode(mode){
  if(!MODE_ORDER.includes(mode)) return;
  closeLanguagePicker();
  try{
    await ensureModeData(mode);
    state.mode=mode;
    state.vocabLevel='all'; state.vocabQuery=''; state.vocabLimit=80; state.selectedWord=null;
    state.practiceType='all'; state.practiceLevel='all'; state.practiceQuery=''; state.selectedLesson=null;
    state.listeningMode='dictation'; resetListeningAttempt();
    ['vocabSearch','practiceSearch','listeningSearch','exprSearch'].forEach(id=>{const el=$('#'+id);if(el)el.value='';});
    showPage('dashboard'); applyMode(); renderAll(); closeDaily(); closePractice(); closeFlashcards(); save(); maybeDaily();
  }catch(error){
    console.error(error); toast('Materi bahasa gagal dimuat. Periksa koneksi lalu coba lagi.');
  }
}
function switchMode(){ openLanguagePicker(); }

function applyMode(){
  const c=cfg();
  document.body.classList.toggle('mandarin-mode', isMandarin());
  document.body.classList.toggle('japanese-mode', isJapanese());
  document.body.classList.toggle('german-mode', isGerman());
  $('#brandSubtitle').textContent=c.brand; $('#modeBadge').textContent=c.badge; $('#modeTitle').textContent=c.title; $('#modeDesc').textContent=c.desc;
  $('#sideSwitchBtn').textContent='Pilih Bahasa'; $('#topSwitchBtn').textContent='Pilih Bahasa'; $('#heroSwitchBtn').textContent='Pilih Bahasa'; $('#topEyebrow').textContent=c.lang + ' learning space'; $('#sidebarNote').innerHTML=c.flow;
  Object.entries(c.labels).forEach(([k,v]) => { const el=$(`[data-label="${k}"]`); if(el) el.textContent=v; });
  $('#heroKicker').textContent=c.hero[0]; $('#heroTitle').textContent=c.hero[1]; $('#heroText').textContent=c.hero[2]; $('#heroPrimary').textContent=c.hero[3];
  $('#dashVocabLabel').textContent=c.dashboard[0]; $('#dashPracticeLabel').textContent=c.dashboard[1]; $('#dashListeningLabel').textContent=c.dashboard[2]; $('#progressPreviewTitle').textContent=c.dashboard[3];
  $('#vocabKicker').textContent=c.vocab[0]; $('#vocabIntroTitle').textContent=c.vocab[1]; $('#vocabIntroText').textContent=c.vocab[2]; $('#vocabSearch').placeholder=c.vocab[3];
  $('#practiceKicker').textContent=c.practice[0]; $('#practiceIntroTitle').textContent=c.practice[1]; $('#practiceIntroText').textContent=c.practice[2];
  $('#listeningKicker').textContent=c.listening[0]; $('#listeningIntroTitle').textContent=c.listening[1]; $('#listeningIntroText').textContent=c.listening[2];
  $('#checkKicker').textContent=c.check[0]; $('#checkIntroTitle').textContent=c.check[1]; $('#checkIntroText').textContent=c.check[2]; $('#writingTitle').textContent=c.check[3]; $('#speakingTitle').textContent=c.check[4];
  $('#exprKicker').textContent=c.expr[0]; $('#exprIntroTitle').textContent=c.expr[1]; $('#exprIntroText').textContent=c.expr[2]; $('#progressTitle').textContent=c.dashboard[3]; $('#toneCard').style.display = isMandarin() ? 'block' : 'none'; $('#dailyTitle').textContent=c.dailyTitle;
  populateVocabLevels(); renderVocabQuickFilters(); populatePracticeFilters(); renderPracticeQuickFilters(); populateListeningLevels(); populateExpressionFilters(); populateWritingTasks(); populateSpeakingPrompts(); if(isMandarin()) newTone(); window.LexoraExamCenter?.refreshMode(); updateTitle();
  localStorage.setItem('lexora-mode',state.mode);
  window.dispatchEvent(new CustomEvent('lexora:mode-change',{detail:{mode:state.mode}}));
  window.dispatchEvent(new CustomEvent('lexora-mode-change',{detail:{mode:state.mode}}));
}

function showPage(page){ state.page=page; if(page==='exam') setTimeout(()=>window.LexoraExamCenter?.render(),0); $all('.page').forEach(p=>p.classList.remove('active')); $(`#${page}Page`)?.classList.add('active'); $all('.nav-btn[data-page]').forEach(b=>b.classList.toggle('active', b.dataset.page===page)); updateTitle(); if(innerWidth<=860) $('#sidebar')?.classList.remove('open'); }
function updateTitle(){ $('#pageTitle').textContent = state.page==='exam' ? `${cfg().lang} Exam Center` : (cfg().pageTitles[state.page] || 'Lexora'); }
function renderAll(){ renderDashboard(); renderVocabulary(); renderPractice(); renderListening(); renderExpressions(); renderAchievements(); renderProgress(); renderDailyPreview(); }

function renderDashboard(){
  $('#dashVocabTotal').textContent = vocabData().length.toLocaleString('id-ID'); $('#dashPracticeTotal').textContent = practiceData().length.toLocaleString('id-ID'); $('#dashListeningTotal').textContent = listeningData().length.toLocaleString('id-ID');
  const ids = relevantIds(); $('#dashLearned').textContent = ids.filter(id=>progress.learned[id]).length; $('#dashHard').textContent = ids.filter(id=>progress.hard[id]).length; $('#dashDone').textContent = practiceData().filter(m=>progress.donePractice[m.id]).length;
  $('#quickGrid').innerHTML = cfg().quick.map(c => `<button class="big-action" data-jump="${c[3]}"><span>${c[0]}</span><b>${esc(c[1])}</b><small>${esc(c[2])}</small></button>`).join('');
  $all('#quickGrid [data-jump]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.jump)));
}
function relevantIds(){ return [...vocabData().map(w=>w.id), ...practiceData().map(m=>m.id)]; }

function populateVocabLevels(){ const levels=[...new Set(vocabData().map(w=>w.level||w.hsk||w.jlpt||w.band).filter(Boolean))].sort((a,b)=>levelOrderIndex(a)-levelOrderIndex(b)||a.localeCompare(b,undefined,{numeric:true})); $('#vocabLevel').innerHTML='<option value="all">All levels</option>'+levels.map(l=>`<option value="${esc(l)}">${esc(l)}</option>`).join(''); }
function renderVocabQuickFilters(){ const wrap=$('#vocabQuickFilters'); if(!wrap) return; const counts={}; vocabData().forEach(w=>{ const lvl=w.level||w.hsk||w.jlpt||w.band||'Other'; counts[lvl]=(counts[lvl]||0)+1; }); const levels=[...$('#vocabLevel').options].slice(1).map(o=>o.value); const chips=['all',...levels].map(level=>{ const count=level==='all'?vocabData().length:(counts[level]||0); const label=level==='all'?'Semua level':level; return `<button class="level-spin${state.vocabLevel===level?' active':''}" data-vocab-chip="${esc(level)}"><b>${esc(label)}</b><small>${count.toLocaleString('id-ID')} words</small></button>`; }); wrap.innerHTML=chips.join(''); $all('[data-vocab-chip]',wrap).forEach(btn=>btn.addEventListener('click',()=>{ state.vocabLevel=btn.dataset.vocabChip; $('#vocabLevel').value=state.vocabLevel; state.vocabLimit=80; renderVocabQuickFilters(); renderVocabulary(true); })); }
function vocabTitle(w){ return isEnglish()?w.word:isMandarin()?w.hanzi:isJapanese()?(w.kanji||w.kana):w.word; }
function vocabSub(w){ return isEnglish()?cleanMeaning(w):isMandarin()?`${w.pinyin||'-'} • ${cleanMeaning(w)}`:isJapanese()?`${w.kana||'-'} • ${w.romaji||'-'} • ${cleanMeaning(w)}`:`${w.level||w.cefr||'CEFR'} • ${cleanMeaning(w)}`; }
function vocabItemText(w){ return isEnglish()?[w.word,w.meaning,w.definition,w.example,(w.synonym||[]).join(' ')].join(' '):isMandarin()?[w.hanzi,w.pinyin,w.meaning,w.english,w.example,w.translation].join(' '):isJapanese()?[w.kanji,w.kana,w.romaji,w.meaning,w.example,w.translation].join(' '):[w.word,w.meaning,w.example,w.translation,w.grammarNote,w.level,w.cefr].join(' '); }
function cleanMeaning(w){ const raw=isEnglish()?(w.meaning||''):isMandarin()?(w.english||w.meaning||''):(w.meaning||w.english||''); if(/seed IELTS word/i.test(raw)) return 'Academic / general English vocabulary'; return raw||'-'; }
function cleanDefinition(w){ const raw=w.definition||''; if(/frequency seed|vocabulary item/i.test(raw)) return 'Tap Explain untuk arti Indonesia, contoh, sinonim, dan cara pakai.'; return raw||'-'; }
function cleanExample(w){ const ex=w.example||''; if(/Try to use/i.test(ex)) return `Make your own sentence with “${vocabTitle(w)}”.`; return ex||'-'; }
function filteredVocab(){ const q=norm(state.vocabQuery); return vocabData().filter(w => (state.vocabLevel==='all'||(w.level||w.hsk||w.jlpt||w.band)===state.vocabLevel) && (!q||norm(vocabItemText(w)).includes(q))).sort((a,b)=>levelOrderIndex(a.level||a.hsk||a.jlpt||a.band)-levelOrderIndex(b.level||b.hsk||b.jlpt||b.band)||String(vocabTitle(a)).localeCompare(String(vocabTitle(b)),undefined,{numeric:true})); }
function getFilteredVocabCached(){ const key=`${state.mode}|${state.vocabLevel}|${norm(state.vocabQuery)}`; if(key!==lastVocabKey){ lastVocabKey=key; lastVocabData=filteredVocab(); } return lastVocabData; }
function scheduleRenderVocabulary(){ clearTimeout(vocabRenderTimer); vocabRenderTimer=setTimeout(()=>renderVocabulary(true),90); }
function loadMoreVocabAuto(){ const data=getFilteredVocabCached(); if(state.vocabLimit>=data.length) return; state.vocabLimit=Math.min(state.vocabLimit+80,data.length); renderVocabulary(false); }
function focusVocabularyDetail(){
  if(window.innerWidth>760) return;
  const detail=$('#vocabDetail');
  if(!detail) return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>detail.scrollIntoView({behavior:'smooth',block:'start',inline:'nearest'})));
}
function renderVocabulary(resetScroll=false){ const data=getFilteredVocabCached(); const visible=Math.min(state.vocabLimit,data.length); $('#vocabCount').textContent=`${visible.toLocaleString('id-ID')} / ${data.length.toLocaleString('id-ID')} words`; let prev=''; const rows=[]; data.slice(0,state.vocabLimit).forEach(w=>{ const level=w.level||w.hsk||w.jlpt||w.band||'Other'; if(state.vocabLevel==='all'&&level!==prev){ rows.push(`<div class="level-divider">${esc(level)}</div>`); prev=level; } const active=state.selectedWord?.id===w.id?' active':''; const marks=`${progress.learned[w.id]?'✓ ':''}${progress.hard[w.id]?'★ ':''}`; const ex=cleanExample(w); rows.push(`<button class="vocab-row vocab-card-row${active}" data-word="${esc(w.id)}"><span class="vocab-main"><b>${esc(vocabTitle(w))}</b><small class="word-sub">${esc(vocabSub(w))}</small><small class="word-example">${esc(ex.slice(0,96))}${ex.length>96?'...':''}</small></span><span class="vocab-side">${marks}<span class="tag">${esc(level)}</span><span class="mini-xp">⚡ +5 XP</span><span class="vocab-cta">Lihat detail ↓</span></span></button>`); }); $('#vocabList').innerHTML = rows.join('') + (visible<data.length?`<div class="vocab-loading-note">Scroll lagi untuk melihat kata berikutnya · ${visible}/${data.length}</div>`:'') || '<p class="muted">Tidak ada kata yang cocok.</p>'; if(resetScroll) $('#vocabList').scrollTop=0; $all('.vocab-row').forEach(b=>b.addEventListener('click',()=>{ state.selectedWord=vocabData().find(w=>w.id===b.dataset.word); renderVocabulary(); renderWordDetail(state.selectedWord); focusVocabularyDetail(); })); if(!state.selectedWord || !vocabData().some(w=>w.id===state.selectedWord?.id)) $('#vocabDetail').innerHTML='<p class="muted">Klik kata di list untuk melihat detail.</p>'; }
function renderWordDetail(w){
  if(!w) return;
  const learned=!!progress.learned[w.id], hard=!!progress.hard[w.id];
  let html='';
  const commonActions=`<div class="detail-actions"><button class="primary" id="markLearned">${learned?'✓ Learned':'Mark learned'}</button><button class="secondary" id="markHard">${hard?'★ Difficult':'☆ Difficult word'}</button>${!isEnglish()?'<button class="secondary" id="speakWord">🔊 Play</button>':''}<button class="secondary" id="saveWordBtn">${progress.saved[w.id]?'🔖 Saved':'♡ Save'}</button><button class="secondary" id="aiExplainWord">Explain</button></div>`;
  if(isEnglish()) html=`<p class="eyebrow">${esc(w.level||w.band||'IELTS')}</p><h3 class="detail-title">${esc(w.word)}</h3><p class="muted">${esc(w.ipa||'')}</p>${commonActions}<div class="info-grid"><div><b>Meaning</b>${esc(cleanMeaning(w))}</div><div><b>Definition</b>${esc(cleanDefinition(w))}</div><div><b>Example</b>${esc(cleanExample(w))}</div><div><b>Synonym</b>${esc((w.synonym||[]).join(', ')||'-')}</div><div><b>Antonym</b>${esc((w.antonym||[]).join(', ')||'-')}</div></div>`;
  else if(isMandarin()) html=`<p class="eyebrow">${esc(w.level||w.hsk||'HSK')}</p><h3 class="detail-title">${esc(w.hanzi)}</h3><p class="muted">${esc(w.pinyin||'')}</p>${commonActions}<div class="info-grid"><div><b>Meaning</b>${esc(cleanMeaning(w))}</div><div><b>English</b>${esc(w.english||'-')}</div><div><b>Example</b>${esc(cleanExample(w))}${w.sentencePinyin?'\n'+esc(w.sentencePinyin):''}${w.translation?'\n'+esc(w.translation):''}</div><div><b>Grammar note</b>${esc(w.grammarNote||'-')}</div><div><b>Tone practice</b>${esc(w.pinyin||'-')}</div></div>`;
  else if(isJapanese()) html=`<p class="eyebrow">${esc(w.level||w.jlpt||'JLPT')}</p><h3 class="detail-title">${esc(w.kanji||w.kana)}</h3><p class="muted">${esc(w.kana||'')} · ${esc(w.romaji||'')}</p>${commonActions}<div class="info-grid"><div><b>Meaning</b>${esc(cleanMeaning(w))}</div><div><b>Kana</b>${esc(w.kana||'-')}</div><div><b>Romaji</b>${esc(w.romaji||'-')}</div><div><b>Example</b>${esc(cleanExample(w))}${w.translation?'\n'+esc(w.translation):''}</div><div><b>Grammar note</b>${esc(w.grammarNote||'-')}</div></div>`;
  else html=`<p class="eyebrow">${esc(w.level||'CEFR')}</p><h3 class="detail-title">${esc(w.word)}</h3><p class="muted">Deutsch · ${esc(w.standard||'Goethe / CEFR-aligned')}</p>${commonActions}<div class="info-grid"><div><b>Arti</b>${esc(cleanMeaning(w))}</div><div><b>Beispiel</b>${esc(cleanExample(w))}</div><div><b>Terjemahan</b>${esc(w.translation||'-')}</div><div><b>Grammar note</b>${esc(w.grammarNote||'-')}</div><div><b>Level</b>${esc(w.level||w.cefr||'-')}</div></div>`;
  $('#vocabDetail').innerHTML=html;
  $('#markLearned').onclick=()=>markWord(w.id,'learned'); $('#markHard').onclick=()=>markWord(w.id,'hard'); $('#saveWordBtn').onclick=()=>markWord(w.id,'saved'); $('#aiExplainWord').onclick=()=>aiExplainWord(w);
  $('#speakWord')?.addEventListener('click',()=>speak(isMandarin()?w.hanzi:isJapanese()?(w.kanji||w.kana):w.word,cfg().speech));
}
function markWord(id,type){ if(type==='learned') progress.learned[id]=Date.now(); if(type==='hard') progress.hard[id]=progress.hard[id]?0:Date.now(); if(type==='saved') progress.saved[id]=progress.saved[id]?0:Date.now(); if(!progress.hard[id]) delete progress.hard[id]; if(!progress.saved[id]) delete progress.saved[id]; save(); renderVocabulary(); if(state.selectedWord) renderWordDetail(state.selectedWord); renderDashboard(); renderProgress(); }

function populatePracticeFilters(){ const types=[...new Set(practiceData().map(m=>m.type||m.group).filter(Boolean))].sort(); const levels=[...new Set(practiceData().map(m=>m.level).filter(Boolean))].sort((a,b)=>levelOrderIndex(a)-levelOrderIndex(b)); $('#practiceType').innerHTML='<option value="all">All practice</option>'+types.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join(''); $('#practiceLevel').innerHTML='<option value="all">All levels</option>'+levels.map(l=>`<option value="${esc(l)}">${esc(l)}</option>`).join(''); }
function renderPracticeQuickFilters(){ const wrap=$('#practiceQuickFilters'); if(!wrap) return; const items=isEnglish()?['all','Vocabulary Builder','Grammar Builder','Reading Skills','IELTS Mixed Test']:['all',...levelList()]; wrap.innerHTML=items.map(item=>`<button class="chip-btn${((isEnglish()?state.practiceType:state.practiceLevel)===item || (item==='all'&&state.practiceType==='all'&&state.practiceLevel==='all'))?' active':''}" data-practice-chip="${esc(item)}">${esc(item==='all'?'Semua practice':item)}</button>`).join(''); $all('[data-practice-chip]',wrap).forEach(btn=>btn.addEventListener('click',()=>{ const v=btn.dataset.practiceChip; if(v==='all'){ state.practiceType='all'; state.practiceLevel='all'; } else if(isEnglish()){ state.practiceType=v; $('#practiceType').value=v; } else { state.practiceLevel=v; $('#practiceLevel').value=v; } renderPracticeQuickFilters(); renderPractice(); })); }
function filteredPractice(){ const q=norm(state.practiceQuery); return practiceData().filter(m => (state.practiceType==='all'||(m.type||m.group)===state.practiceType) && (state.practiceLevel==='all'||m.level===state.practiceLevel) && (!q||norm([m.title,m.type,m.group,m.level,m.passage].join(' ')).includes(q))); }
function renderPractice(){ const data=filteredPractice(); $('#practiceGrid').innerHTML=data.map(m=>`<article class="card module module-card"><div class="module-top"><span class="tag">${esc(m.level||'')}</span><span class="tag">${esc(m.difficulty||'')}</span></div><h3>${esc(m.title)}</h3><p>${esc(m.passage||'')}</p><div class="module-statline"><span>${m.questionCount||m.questions?.length||0} soal</span><span>${esc(m.reward||'')}</span></div><div class="module-bottom"><div class="module-actions"><button class="ghost-link" data-preview-module="${esc(m.id)}">Lihat materi</button><button class="primary" data-module="${esc(m.id)}">Pilih</button></div></div></article>`).join('') || '<p class="muted">Tidak ada practice yang cocok.</p>'; $all('[data-module]').forEach(b=>b.addEventListener('click',()=>openPractice(practiceData().find(m=>m.id===b.dataset.module)))); $all('[data-preview-module]').forEach(b=>b.addEventListener('click',()=>{ const m=practiceData().find(x=>x.id===b.dataset.previewModule); if(m){ state.selectedModule=m; renderPracticeModal(m); $('#practiceModal').classList.add('show'); } })); }
function openPractice(m){ if(!m) return; state.selectedModule=m; renderPracticeModal(m); $('#practiceModal').classList.add('show'); }
function closePractice(){ $('#practiceModal')?.classList.remove('show'); }
function renderPracticeModal(m){ $('#practiceModalBody').innerHTML=`<span class="soft-pill">${esc(m.level||'')} • ${esc(m.difficulty||'')}</span><h2>${esc(m.title)}</h2><p class="muted">${esc(m.passage||'')}</p><div class="practice-list">${(m.questions||[]).map((q,i)=>renderQuestion(q,i)).join('')}</div><div class="btn-row"><button class="primary" id="checkModule">Check</button><button class="secondary" id="aiCheckModule">AI Feedback</button></div><div id="moduleResult" class="result-box"></div>`; $('#checkModule').onclick=()=>checkModuleAnswers(m); $('#aiCheckModule').onclick=()=>aiCheckModule(m); }
function renderQuestion(q,i){ if(q.options&&q.options.length){ return `<div class="question" data-q="${i}"><b>${i+1}. ${esc(q.q)}</b>${q.options.map(opt=>`<label><input type="radio" name="q${i}" value="${esc(opt)}"> ${esc(opt)}</label>`).join('')}</div>`; } return `<div class="question" data-q="${i}"><b>${i+1}. ${esc(q.q)}</b><input type="text" placeholder="Jawabanmu..." /></div>`; }
function checkModuleAnswers(m){ const boxes=$all('#practiceModalBody .question'); let correct=0; const lines=[]; boxes.forEach((box,i)=>{ const q=(m.questions||[])[i]||{}; const checked=box.querySelector('input[type=radio]:checked'); const input=box.querySelector('input[type=text]'); const ans=checked?checked.value:(input?input.value.trim():''); const ok=norm(ans)===norm(q.answer); if(ok) correct++; lines.push(`${i+1}. ${ok?'✅':'❌'} Jawabanmu: ${ans||'-'} | Kunci: ${q.answer||'-'}`); }); const total=boxes.length; const pct=total?Math.round(correct/total*100):0; progress.scores.push({id:m.id,score:pct,mode:state.mode,at:Date.now()}); progress.donePractice[m.id]=Date.now(); save(); $('#moduleResult').textContent=`Score: ${correct}/${total} (${pct}%)\n\n${lines.join('\n')}`; renderPractice(); renderDashboard(); renderProgress(); }

function populateListeningLevels(){ const levels=[...new Set(listeningData().map(l=>l.level).filter(Boolean))].sort((a,b)=>levelOrderIndex(a)-levelOrderIndex(b)||a.localeCompare(b,undefined,{numeric:true})); $('#listeningLevel').innerHTML='<option value="all">All levels</option>'+levels.map(l=>`<option value="${esc(l)}">${esc(l)}</option>`).join(''); }
function filteredListening(){ const q=norm($('#listeningSearch').value); const level=$('#listeningLevel').value||'all'; return listeningData().filter(l=>(level==='all'||l.level===level)&&(!q||norm([l.title,l.source,l.category,l.level].join(' ')).includes(q))); }

const LISTENING_LAB_SENTENCES={
  English:[
    {text:'Climate change can affect the way people live.',tokens:['Climate','change','can','affect','the','way','people','live']},
    {text:'Learning a new language takes time and regular practice.',tokens:['Learning','a','new','language','takes','time','and','regular','practice']},
    {text:'Technology can make education more accessible.',tokens:['Technology','can','make','education','more','accessible']},
    {text:'Public transport helps reduce traffic in large cities.',tokens:['Public','transport','helps','reduce','traffic','in','large','cities']},
    {text:'Healthy routines can improve concentration and memory.',tokens:['Healthy','routines','can','improve','concentration','and','memory']},
    {text:'People often learn faster when feedback is clear.',tokens:['People','often','learn','faster','when','feedback','is','clear']}
  ],
  Mandarin:[
    {text:'我现在每天学习中文。',tokens:['我','现在','每天','学习','中文']},
    {text:'今天的天气非常好。',tokens:['今天','的','天气','非常','好']},
    {text:'我想去中国学习计算机。',tokens:['我','想','去','中国','学习','计算机']},
    {text:'听力练习需要每天坚持。',tokens:['听力','练习','需要','每天','坚持']},
    {text:'因为我喜欢中文，所以我每天学习。',tokens:['因为','我','喜欢','中文','所以','我','每天','学习']},
    {text:'请再说一遍，我没有听清楚。',tokens:['请','再说一遍','我','没有','听清楚']}
  ],
  German:[
    {text:'Ich lerne jeden Tag Deutsch.',tokens:['Ich','lerne','jeden','Tag','Deutsch']},
    {text:'Heute fahre ich mit dem Bus zur Schule.',tokens:['Heute','fahre','ich','mit','dem','Bus','zur','Schule']},
    {text:'Deutsch zu lernen braucht Zeit und regelmäßige Übung.',tokens:['Deutsch','zu','lernen','braucht','Zeit','und','regelmäßige','Übung']},
    {text:'Digitale Medien können den Unterricht sinnvoll ergänzen.',tokens:['Digitale','Medien','können','den','Unterricht','sinnvoll','ergänzen']},
    {text:'Ich möchte später im Ausland studieren.',tokens:['Ich','möchte','später','im','Ausland','studieren']},
    {text:'Können Sie das bitte noch einmal langsam sagen?',tokens:['Können','Sie','das','bitte','noch','einmal','langsam','sagen']}
  ],
  Japanese:[
    {text:'私は毎日日本語を勉強しています。',tokens:['私は','毎日','日本語を','勉強して','います']},
    {text:'今日はとてもいい天気です。',tokens:['今日は','とても','いい','天気です']},
    {text:'日本でコンピューターを勉強したいです。',tokens:['日本で','コンピューターを','勉強したい','です']},
    {text:'聞く練習を毎日続けています。',tokens:['聞く','練習を','毎日','続けて','います']},
    {text:'新しい言葉を文の中で使います。',tokens:['新しい','言葉を','文の中で','使います']},
    {text:'もう一度ゆっくり話してください。',tokens:['もう一度','ゆっくり','話して','ください']}
  ]
};
const LISTENING_DISTRACTORS={English:['different','simple','important','future','quiet','careful'],Mandarin:['昨天','朋友','工作','学校','觉得','慢慢'],Japanese:['昨日','友達','学校で','静かに','難しい','読みます'],German:['heute','morgen','lernen','arbeiten','weil','aber','Stadt','Schule']};
const LISTENING_TOPIC_DRILLS={
  English:[
    [['climate','environment'],{text:'Climate change affects communities around the world.',tokens:['Climate','change','affects','communities','around','the','world']}],
    [['mental health'],{text:'Good mental health is important for daily life.',tokens:['Good','mental','health','is','important','for','daily','life']}],
    [['food culture','food'],{text:'Learning about food can help us understand another culture.',tokens:['Learning','about','food','can','help','us','understand','another','culture']}],
    [['education','online learning'],{text:'Online learning gives students more flexible study options.',tokens:['Online','learning','gives','students','more','flexible','study','options']}],
    [['ai and work','future careers','work'],{text:'Technology is changing the skills people need at work.',tokens:['Technology','is','changing','the','skills','people','need','at','work']}],
    [['healthy sleep','sleep'],{text:'A regular sleep schedule can improve concentration.',tokens:['A','regular','sleep','schedule','can','improve','concentration']}],
    [['public transport','traffic'],{text:'Public transport can reduce traffic in busy cities.',tokens:['Public','transport','can','reduce','traffic','in','busy','cities']}],
    [['social media'],{text:'Social media can influence the way people communicate.',tokens:['Social','media','can','influence','the','way','people','communicate']}],
    [['tourism','travel'],{text:'Responsible tourism can support local communities.',tokens:['Responsible','tourism','can','support','local','communities']}],
    [['food waste'],{text:'Reducing food waste can save money and resources.',tokens:['Reducing','food','waste','can','save','money','and','resources']}],
    [['city life'],{text:'City life offers opportunities but can also feel stressful.',tokens:['City','life','offers','opportunities','but','can','also','feel','stressful']}],
    [['rural life'],{text:'Rural communities often have a slower pace of life.',tokens:['Rural','communities','often','have','a','slower','pace','of','life']}],
    [['sports habits','exercise'],{text:'Regular exercise can improve both health and mood.',tokens:['Regular','exercise','can','improve','both','health','and','mood']}],
    [['music and memory','music'],{text:'Music can help some people remember information.',tokens:['Music','can','help','some','people','remember','information']}],
    [['university life'],{text:'University students need to balance study and social life.',tokens:['University','students','need','to','balance','study','and','social','life']}],
    [['scholarship'],{text:'Scholarships can make education more accessible to students.',tokens:['Scholarships','can','make','education','more','accessible','to','students']}],
    [['part-time jobs'],{text:'Part-time jobs can teach students useful workplace skills.',tokens:['Part-time','jobs','can','teach','students','useful','workplace','skills']}],
    [['digital money'],{text:'Digital payments are becoming common in everyday life.',tokens:['Digital','payments','are','becoming','common','in','everyday','life']}],
    [['language learning'],{text:'Language learning requires regular practice and clear feedback.',tokens:['Language','learning','requires','regular','practice','and','clear','feedback']}],
    [['reading habits'],{text:'Reading every day can gradually improve vocabulary.',tokens:['Reading','every','day','can','gradually','improve','vocabulary']}],
    [['time management'],{text:'Good time management helps students finish important tasks.',tokens:['Good','time','management','helps','students','finish','important','tasks']}],
    [['friendship'],{text:'Strong friendships often depend on trust and communication.',tokens:['Strong','friendships','often','depend','on','trust','and','communication']}],
    [['family roles'],{text:'Family roles can change as children become adults.',tokens:['Family','roles','can','change','as','children','become','adults']}],
    [['public speaking'],{text:'Public speaking becomes easier with preparation and practice.',tokens:['Public','speaking','becomes','easier','with','preparation','and','practice']}],
    [['science news'],{text:'Science news should explain complex ideas in a clear way.',tokens:['Science','news','should','explain','complex','ideas','in','a','clear','way']}],
    [['space travel'],{text:'Space travel may create new opportunities in the future.',tokens:['Space','travel','may','create','new','opportunities','in','the','future']}],
    [['online shopping'],{text:'Online shopping is convenient but buyers should compare prices.',tokens:['Online','shopping','is','convenient','but','buyers','should','compare','prices']}],
    [['volunteering'],{text:'Volunteering can build confidence and practical experience.',tokens:['Volunteering','can','build','confidence','and','practical','experience']}]
  ],
  Mandarin:[
    [['会'],{text:'我会说一点中文。',tokens:['我','会','说','一点','中文']}],
    [['自我介绍'],{text:'大家好，我叫李明，我来自印度尼西亚。',tokens:['大家好','我叫李明','我来自','印度尼西亚']}],
    [['家庭'],{text:'我家有四口人，我们常常一起吃饭。',tokens:['我家','有四口人','我们','常常','一起吃饭']}],
    [['学校'],{text:'我的学校离家不远，每天走路十分钟。',tokens:['我的学校','离家不远','每天','走路','十分钟']}],
    [['时间'],{text:'现在七点半，我八点开始上课。',tokens:['现在','七点半','我','八点','开始上课']}],
    [['买东西'],{text:'这个多少钱？可以便宜一点吗？',tokens:['这个','多少钱','可以','便宜一点','吗']}],
    [['天气'],{text:'今天天气很好，但是下午可能下雨。',tokens:['今天','天气很好','但是','下午','可能下雨']}],
    [['爱好'],{text:'我的爱好是听音乐和拍照。',tokens:['我的爱好','是','听音乐','和','拍照']}],
    [['交通'],{text:'我每天坐地铁去学校，大约二十分钟。',tokens:['我每天','坐地铁','去学校','大约','二十分钟']}],
    [['吃饭'],{text:'我想吃米饭，再要一杯茶。',tokens:['我想吃','米饭','再要','一杯茶']}],
    [['看病'],{text:'我有一点头疼，昨天晚上也没睡好。',tokens:['我有一点','头疼','昨天晚上','也没睡好']}],
    [['旅行'],{text:'下个月我想去北京旅行五天。',tokens:['下个月','我想去','北京','旅行','五天']}],
    [['工作'],{text:'我希望以后做软件工程师。',tokens:['我希望','以后','做','软件工程师']}],
    [['学习计划'],{text:'我每天学习中文一个小时，然后复习生词。',tokens:['我每天','学习中文','一个小时','然后','复习生词']}],
    [['考试'],{text:'明天有考试，所以今天我要认真复习。',tokens:['明天','有考试','所以','今天','我要认真复习']}],
    [['朋友'],{text:'我的朋友很热情，我们周末常常见面。',tokens:['我的朋友','很热情','我们','周末','常常见面']}],
    [['城市'],{text:'这个城市很方便，但是高峰时间比较堵。',tokens:['这个城市','很方便','但是','高峰时间','比较堵']}],
    [['运动'],{text:'我每个星期游泳两次，也喜欢走路。',tokens:['我','每个星期','游泳两次','也喜欢','走路']}],
    [['音乐'],{text:'学习的时候，我喜欢听比较安静的音乐。',tokens:['学习的时候','我喜欢听','比较安静的','音乐']}],
    [['中国文化'],{text:'我对中国文化很感兴趣，尤其是春节。',tokens:['我对','中国文化','很感兴趣','尤其是','春节']}],
    [['奖学金'],{text:'为了申请奖学金，我正在准备语言考试。',tokens:['为了','申请奖学金','我正在','准备','语言考试']}],
    [['大学生活'],{text:'大学生活很忙，但我学到了很多新东西。',tokens:['大学生活','很忙','但我','学到了','很多新东西']}],
    [['手机'],{text:'我每天用手机查词和练习听力。',tokens:['我每天','用手机','查词','和','练习听力']}],
    [['网课'],{text:'上网课的时候，我会先关掉其他通知。',tokens:['上网课的时候','我会','先关掉','其他通知']}],
    [['环境'],{text:'保护环境需要每个人从小事开始。',tokens:['保护环境','需要','每个人','从小事','开始']}],
    [['健康'],{text:'为了身体健康，我尽量早点睡觉。',tokens:['为了','身体健康','我尽量','早点睡觉']}],
    [['面试'],{text:'面试的时候，请先简单介绍一下自己。',tokens:['面试的时候','请先','简单','介绍一下','自己']}],
    [['租房'],{text:'我想在学校附近租一间安静的房子。',tokens:['我想','在学校附近','租一间','安静的','房子']}],
    [['方向'],{text:'一直往前走，然后在第二个路口左转。',tokens:['一直','往前走','然后','在第二个路口','左转']}],
    [['节日'],{text:'春节的时候，很多家庭会一起吃年夜饭。',tokens:['春节的时候','很多家庭','会一起','吃年夜饭']}],
    [['未来计划'],{text:'毕业以后，我计划去国外继续学习。',tokens:['毕业以后','我计划','去国外','继续学习']}]
  ],
  Japanese:[
    [['self introduction'],{text:'はじめまして、私はホセアです。インドネシアから来ました。',tokens:['はじめまして','私はホセアです','インドネシアから','来ました']}],
    [['school conversation'],{text:'今日の授業は九時から始まります。',tokens:['今日の授業は','九時から','始まります']}],
    [['shopping'],{text:'このシャツはいくらですか。',tokens:['このシャツは','いくら','ですか']}],
    [['station announcement'],{text:'次の電車は三番線から出発します。',tokens:['次の電車は','三番線から','出発します']}],
    [['restaurant order'],{text:'ラーメンを一つと水をお願いします。',tokens:['ラーメンを','一つと','水を','お願いします']}],
    [['weather report'],{text:'明日は朝から雨が降るでしょう。',tokens:['明日は','朝から','雨が','降るでしょう']}],
    [['phone call'],{text:'もしもし、今少し話してもいいですか。',tokens:['もしもし','今','少し','話しても','いいですか']}],
    [['schedule change'],{text:'会議は午後三時に変更になりました。',tokens:['会議は','午後三時に','変更に','なりました']}],
    [['doctor visit'],{text:'昨日から頭が痛くて、熱もあります。',tokens:['昨日から','頭が痛くて','熱も','あります']}],
    [['travel plan'],{text:'来月京都へ三日間旅行する予定です。',tokens:['来月','京都へ','三日間','旅行する予定です']}],
    [['workplace notice'],{text:'明日の朝までにこの書類を提出してください。',tokens:['明日の朝までに','この書類を','提出して','ください']}],
    [['library talk'],{text:'この本は二週間借りることができます。',tokens:['この本は','二週間','借りることが','できます']}],
    [['class instruction'],{text:'教科書の二十ページを開いてください。',tokens:['教科書の','二十ページを','開いて','ください']}],
    [['news summary'],{text:'政府は新しい計画を発表しました。',tokens:['政府は','新しい計画を','発表しました']}],
    [['opinion exchange'],{text:'私はその意見に完全には賛成できません。',tokens:['私は','その意見に','完全には','賛成できません']}],
    [['problem solving'],{text:'まず原因を確認してから方法を考えましょう。',tokens:['まず','原因を確認してから','方法を','考えましょう']}],
    [['formal announcement'],{text:'ご利用のお客様に重要なお知らせがあります。',tokens:['ご利用のお客様に','重要な','お知らせが','あります']}],
    [['seminar excerpt'],{text:'今日のテーマは言語学習と記憶の関係です。',tokens:['今日のテーマは','言語学習と','記憶の','関係です']}],
    [['academic talk'],{text:'この研究では三つの要因を比較しました。',tokens:['この研究では','三つの要因を','比較しました']}],
    [['interview'],{text:'あなたの長所について具体的に説明してください。',tokens:['あなたの長所について','具体的に','説明して','ください']}]
  ]
};
function stableListeningHash(value=''){ return String(value).split('').reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),7); }
function listeningDrill(l){
  if(l?.lexoraDrill?.text && Array.isArray(l.lexoraDrill.tokens)) return l.lexoraDrill;
  const title=String(l?.title||'').toLowerCase();
  const topics=LISTENING_TOPIC_DRILLS[l?.language]||[];
  const matched=topics.find(([needles])=>needles.some(n=>title.includes(String(n).toLowerCase())));
  if(matched) return matched[1];
  const bank=LISTENING_LAB_SENTENCES[l?.language]||LISTENING_LAB_SENTENCES.English;
  return bank[stableListeningHash(`${l?.id||''}-${l?.category||''}`)%bank.length];
}
function shortListeningTitle(l){
  return String(l?.title||'Listening').replace(/^Mandarin Listening:\s*/i,'').replace(/^IELTS Listening:\s*/i,'').replace(/^JLPT\s+N\d\s+Listening\s+Drill\s+\d+:\s*/i,'').replace(/^BOX SET:\s*/i,'').trim();
}
function normalizeListeningText(value=''){ return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}'\s]/gu,'').replace(/\s+/g,'').trim(); }
function levenshteinDistance(a='',b=''){ const x=[...a],y=[...b]; if(!x.length)return y.length;if(!y.length)return x.length;let prev=Array(y.length+1).fill(0).map((_,i)=>i);for(let i=1;i<=x.length;i++){const cur=[i];for(let j=1;j<=y.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(x[i-1]===y[j-1]?0:1));prev=cur;}return prev[y.length]; }
function listeningSimilarity(a,b){ const x=normalizeListeningText(a),y=normalizeListeningText(b); if(!x||!y)return 0; return Math.max(0,Math.round((1-levenshteinDistance(x,y)/Math.max(x.length,y.length))*100)); }
function listeningTodayKey(offset=0){ const d=new Date(); d.setDate(d.getDate()+offset); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function listeningStats(){ progress.stats.listeningDays=progress.stats.listeningDays||{}; progress.stats.listeningDaily={...defaultProgress.stats.listeningDaily,...(progress.stats.listeningDaily||{})}; const today=listeningTodayKey(); if(progress.stats.listeningDaily.day!==today) progress.stats.listeningDaily={day:today,correct:0,rewarded:false}; return progress.stats; }
function listeningStreak(){ const days=listeningStats().listeningDays||{}; let streak=0; for(let i=0;i<365;i++){ if(days[listeningTodayKey(-i)]) streak++; else if(i===0) continue; else break; } return streak; }
function listeningLevel(){ return 1+Math.floor((Number(listeningStats().xp)||0)/500); }
function renderListeningStats(){ const stats=listeningStats(); if($('#listeningXp')) $('#listeningXp').textContent=`${(stats.xp||0).toLocaleString('id-ID')} XP`; if($('#listeningLevelStat')) $('#listeningLevelStat').textContent=`Lv. ${listeningLevel()}`; if($('#listeningStreak')) $('#listeningStreak').textContent=listeningStreak(); if($('#listeningComboStat')) $('#listeningComboStat').textContent=`Combo x${state.listeningCombo}`; if($('#listeningBestCombo')) $('#listeningBestCombo').textContent=stats.listeningComboBest||0; const daily=stats.listeningDaily; const count=Math.min(3,Number(daily.correct)||0); if($('#listeningMissionText')) $('#listeningMissionText').textContent=`${count} / 3 selesai${daily.rewarded?' · reward claimed':''}`; if($('#listeningMissionBar')) $('#listeningMissionBar').style.width=`${count/3*100}%`; if($('#listeningMissionCopy')) $('#listeningMissionCopy').textContent=count>=3?'Misi hari ini selesai. Pertahankan streak besok.':'Selesaikan 3 drill listening hari ini.'; }
function markListeningActivity(){ const stats=listeningStats(); stats.listeningDays[listeningTodayKey()]=Date.now(); const keep=Object.keys(stats.listeningDays).sort().slice(-120); stats.listeningDays=Object.fromEntries(keep.map(k=>[k,stats.listeningDays[k]])); }
function addListeningXp(amount){ const stats=listeningStats(); stats.xp=Math.max(0,(Number(stats.xp)||0)+Math.max(0,Math.round(amount||0))); }
function awardListeningSuccess({xp=18,accuracy=100,shadow=false}={}){ if(state.listeningAwarded) return false; state.listeningAwarded=true; const stats=listeningStats(); state.listeningCombo++; stats.listeningCorrect=(stats.listeningCorrect||0)+1; stats.listeningComboBest=Math.max(stats.listeningComboBest||0,state.listeningCombo); if(accuracy>=90) stats.listeningHighAccuracy=(stats.listeningHighAccuracy||0)+1; if(shadow) stats.shadowingDone=(stats.shadowingDone||0)+1; markListeningActivity(); const actualXp=Math.max(3,xp-(state.listeningHintUsed?2:0)); addListeningXp(actualXp); stats.listeningDaily.correct=(stats.listeningDaily.correct||0)+1; if(stats.listeningDaily.correct>=3&&!stats.listeningDaily.rewarded){ stats.listeningDaily.rewarded=true; addListeningXp(100); setTimeout(()=>toast('🎯 Daily Listening Mission complete · +100 XP'),250); } save(); renderListeningStats(); renderListeningAchievements(); renderAchievements(); return actualXp; }
function registerListeningMiss(){ state.listeningCombo=0; state.listeningHearts=Math.max(0,state.listeningHearts-1); if(state.listeningHearts===0){ toast('❤️ Nyawa habis. Tarik napas, lalu coba lagi.'); state.listeningHearts=3; } renderListeningStats(); }
function labSentenceDisplay(drill,blankIndex=-1){ return drill.tokens.map((t,i)=>i===blankIndex?'______':t).join(usesWordSpacing()?' ':''); }
function shuffleListening(items){ return shuffleClone(items); }
function speakListeningTarget(l,loop=false){ const drill=listeningDrill(l); if(!('speechSynthesis' in window)) return toast('Browser tidak mendukung audio voice.'); window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(drill.text); u.lang=cfg().speech; u.rate=state.listeningPlaybackRate||.75; if(loop) u.onend=()=>{ if(state.selectedLesson?.id===l.id) setTimeout(()=>speakListeningTarget(l,false),300); }; window.speechSynthesis.speak(u); }
function listeningModeLabel(){ return ({dictation:'Dictation',missing:'Missing Words',catch:'Word Catch',shadow:'Shadowing'})[state.listeningMode]||'Dictation'; }
function resetListeningAttempt(){ state.listeningHearts=3; state.listeningHintUsed=false; state.listeningWordSequence=[]; state.listeningAwarded=false; state.listeningSpeechRecognition?.abort?.(); state.listeningSpeechRecognition=null; }
function renderListening(){
  const data=filteredListening();
  if(!state.selectedLesson || !data.some(l=>l.id===state.selectedLesson?.id)){
    state.selectedLesson=data[0]||null;
    resetListeningAttempt();
  }
  $('#listenList').innerHTML=data.map((l,i)=>`<button class="lesson-item ${state.selectedLesson?.id===l.id?'active':''}" data-lesson="${esc(l.id)}"><span class="lab-lesson-index">${String(i+1).padStart(2,'0')}</span><span><b>${esc(shortListeningTitle(l))}</b><small>${esc(l.level||'')} · ${esc(l.category||'Listening')}</small></span>${progress.donePractice[l.id]?'<em>✓</em>':''}</button>`).join('') || '<p class="muted">Tidak ada listening yang cocok.</p>';
  $all('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{
    state.selectedLesson=listeningData().find(l=>l.id===b.dataset.lesson);
    resetListeningAttempt();
    renderListening();
  }));
  renderListeningStats();
  renderListeningAchievements();
  renderLessonDetail(state.selectedLesson);
}
function renderLessonDetail(l){
  if(!l){ $('#listenDetail').innerHTML='<p class="muted">Pilih lesson.</p>'; return; }
  const drill=listeningDrill(l);
  const media=l.embedId
    ? `<div class="lab-video-wrap"><iframe src="https://www.youtube.com/embed/${esc(l.embedId)}" title="${esc(l.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    : `<div class="lab-audio-card"><span>🎧</span><div><small>LEXORA AUDIO DRILL</small><b>${esc(shortListeningTitle(l))}</b><p>Audio latihan sudah disesuaikan dengan topik dan level lesson ini.</p></div><button class="primary" id="labAudioPlay">▶ Putar</button></div>`;
  $('#listenDetail').innerHTML=`<div class="lab-simple-head"><div><span class="soft-pill">${esc(l.level||'')} · ${esc(l.language)}</span><h2>${esc(shortListeningTitle(l))}</h2><p>${esc(l.category||'Listening')} · ${esc(l.duration||'Latihan singkat')}</p></div><div class="lab-mini-score"><span>❤️ ${state.listeningHearts}</span><b>🔥 x${state.listeningCombo}</b></div></div><div class="lab-grid"><section class="lab-video-panel">${media}<div class="lab-controls"><button class="secondary" id="labSpeakTarget">▶ Dengarkan</button><button class="secondary" id="labLoopTarget">↻ Ulangi</button><button class="secondary" id="labSpeedBtn">🐢 ${state.listeningPlaybackRate}x</button></div><div class="lab-simple-tip">💡 Dengarkan 1–2 kali, lalu jawab. Target latihan mengikuti topik <b>${esc(shortListeningTitle(l))}</b>.</div><div class="lab-video-actions">${l.url?`<a class="source-link" target="_blank" rel="noreferrer" href="${esc(l.url)}">Buka video sumber</a>`:''}<button class="primary" id="markListenDone">${progress.donePractice[l.id]?'✓ Selesai':'Tandai selesai'}</button></div></section><section class="lab-practice-panel"><div class="lab-mode-tabs"><button data-listen-mode="dictation" class="${state.listeningMode==='dictation'?'active':''}">🎧 Dictation</button><button data-listen-mode="missing" class="${state.listeningMode==='missing'?'active':''}">🧩 Missing</button><button data-listen-mode="catch" class="${state.listeningMode==='catch'?'active':''}">⚡ Word Catch</button><button data-listen-mode="shadow" class="${state.listeningMode==='shadow'?'active':''}">🗣 Shadowing</button></div><div class="lab-question-head"><span>${esc(listeningModeLabel())}</span><div id="labHearts">❤️ ${state.listeningHearts} · <b>Combo x${state.listeningCombo} 🔥</b></div></div><div id="labPracticeContent"></div></section></div>`;
  bindListeningLabShell(l);
  $('#labAudioPlay')?.addEventListener('click',()=>speakListeningTarget(l));
  renderListeningPracticePanel(l);
}
function bindListeningLabShell(l){
  $all('[data-listen-mode]').forEach(btn=>btn.addEventListener('click',()=>{
    state.listeningMode=btn.dataset.listenMode;
    resetListeningAttempt();
    renderLessonDetail(l);
  }));
  $('#labSpeakTarget')?.addEventListener('click',()=>speakListeningTarget(l));
  $('#labLoopTarget')?.addEventListener('click',()=>speakListeningTarget(l,true));
  $('#labSpeedBtn')?.addEventListener('click',()=>{
    state.listeningPlaybackRate=state.listeningPlaybackRate===.75?.5:state.listeningPlaybackRate===.5?1:.75;
    $('#labSpeedBtn').textContent=`🐢 ${state.listeningPlaybackRate}x`;
    toast(`Kecepatan audio ${state.listeningPlaybackRate}x`);
  });
  $('#markListenDone')?.addEventListener('click',()=>{
    const first=!progress.donePractice[l.id];
    progress.donePractice[l.id]=Date.now();
    if(first){ addListeningXp(5); markListeningActivity(); }
    save(); renderDashboard(); renderProgress(); renderListeningStats(); renderListeningAchievements();
    toast(first?'Listening selesai · +5 XP':'Listening sudah selesai');
    renderLessonDetail(l);
  });
}
function renderListeningPracticePanel(l){ const drill=listeningDrill(l); const target=drill.text; const wrap=$('#labPracticeContent'); if(!wrap) return; if(state.listeningMode==='dictation'){ wrap.innerHTML=`<div class="lab-prompt-card"><small>KETIK YANG KAMU DENGAR</small><h3>Dengarkan target audio, lalu tulis kalimatnya.</h3><p>Target tidak ditampilkan sebelum kamu menjawab.</p></div><textarea id="labDictationAnswer" class="lab-answer-input" rows="4" placeholder="Tulis yang kamu dengar..."></textarea><div class="lab-action-row"><button class="lab-hint-btn" id="labHintBtn">💡 Hint −2 XP</button><button class="primary" id="labCheckBtn">Check Answer</button></div><div id="labResult" class="lab-result-box"></div>`; $('#labHintBtn').onclick=()=>{ state.listeningHintUsed=true; const reveal=usesWordSpacing()?drill.tokens.slice(0,2).join(' ')+' …':drill.tokens.slice(0,2).join('')+'…'; $('#labDictationAnswer').placeholder=`Hint: ${reveal}`; toast('Hint dibuka · reward XP dikurangi'); }; $('#labCheckBtn').onclick=()=>{ const answer=$('#labDictationAnswer').value.trim(); if(!answer)return toast('Tulis jawaban dulu'); const accuracy=listeningSimilarity(answer,target); if(accuracy>=78){ const xp=awardListeningSuccess({xp:18,accuracy}); showListeningResult(true,`<b>${accuracy}% Listening Accuracy 🎉</b><br>Jawabanmu cukup dekat dengan target.<br><small>+${xp||0} XP · Target: ${esc(target)}</small>`); } else { registerListeningMiss(); showListeningResult(false,`<b>${accuracy}% · Belum tepat.</b><br>Target: <b>${esc(target)}</b><br><small>Putar ulang target dan fokus pada bunyi akhir tiap kata.</small>`); updateLabHearts(); } }; }
  else if(state.listeningMode==='missing'){ const idx=Math.max(0,Math.floor(drill.tokens.length/2)); const answer=drill.tokens[idx]; const options=shuffleListening([answer,...LISTENING_DISTRACTORS[l.language].slice(0,3)]); wrap.innerHTML=`<div class="lab-prompt-card"><small>ISI KATA YANG HILANG</small><h3>${esc(labSentenceDisplay(drill,idx))}</h3><p>Pilih bagian yang kamu dengar.</p></div><div class="lab-word-chips">${options.map(x=>`<button class="lab-word-chip" data-lab-word="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="lab-action-row"><button class="lab-hint-btn" id="labReplayBtn">🔊 Putar lagi</button><button class="primary" id="labCheckBtn">Check Answer</button></div><div id="labResult" class="lab-result-box"></div>`; let selected=''; $all('[data-lab-word]').forEach(btn=>btn.onclick=()=>{ selected=btn.dataset.labWord; $all('[data-lab-word]').forEach(x=>x.classList.toggle('selected',x===btn)); }); $('#labReplayBtn').onclick=()=>speakListeningTarget(l); $('#labCheckBtn').onclick=()=>{ if(!selected)return toast('Pilih satu jawaban'); if(normalizeListeningText(selected)===normalizeListeningText(answer)){ const xp=awardListeningSuccess({xp:15,accuracy:100}); showListeningResult(true,`<b>Benar! ${esc(answer)} ✓</b><br>Kamu menangkap bagian yang hilang.<br><small>+${xp||0} XP</small>`); } else { registerListeningMiss(); showListeningResult(false,`Belum tepat. Jawaban yang benar: <b>${esc(answer)}</b>.`); updateLabHearts(); } }; }
  else if(state.listeningMode==='catch'){ const targetTokens=drill.tokens.slice(0,Math.min(5,drill.tokens.length)); const chips=shuffleListening([...targetTokens,...LISTENING_DISTRACTORS[l.language].slice(0,2)]); wrap.innerHTML=`<div class="lab-prompt-card"><small>WORD CATCH</small><h3>Klik kata sesuai urutan yang kamu dengar.</h3><p>Putar target audio, lalu tangkap ${targetTokens.length} bagian inti.</p></div><div class="lab-word-chips">${chips.map((x,i)=>`<button class="lab-word-chip" data-catch-index="${i}" data-lab-word="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="lab-sequence" id="labSequence">Belum ada kata dipilih.</div><div class="lab-action-row"><button class="lab-hint-btn" id="labResetSequence">↻ Reset</button><button class="primary" id="labCheckBtn">Check Sequence</button></div><div id="labResult" class="lab-result-box"></div>`; $all('[data-catch-index]').forEach(btn=>btn.onclick=()=>{ if(btn.classList.contains('selected'))return; btn.classList.add('selected'); state.listeningWordSequence.push(btn.dataset.labWord); $('#labSequence').textContent=state.listeningWordSequence.join(usesWordSpacing()?' → ':' · '); }); $('#labResetSequence').onclick=()=>{ state.listeningWordSequence=[]; $all('[data-catch-index]').forEach(x=>x.classList.remove('selected')); $('#labSequence').textContent='Belum ada kata dipilih.'; }; $('#labCheckBtn').onclick=()=>{ const selected=state.listeningWordSequence; const ok=selected.length===targetTokens.length&&selected.every((x,i)=>normalizeListeningText(x)===normalizeListeningText(targetTokens[i])); if(ok){ const xp=awardListeningSuccess({xp:22,accuracy:100}); showListeningResult(true,`<b>Perfect catch! ⚡</b><br>Urutan yang kamu tangkap benar.<br><small>+${xp||0} XP</small>`); } else { registerListeningMiss(); showListeningResult(false,`Urutannya belum tepat.<br>Target: <b>${esc(targetTokens.join(usesWordSpacing()?' → ':' · '))}</b>`); updateLabHearts(); } }; }
  else { wrap.innerHTML=`<div class="lab-prompt-card"><small>SHADOWING MODE</small><h3>${esc(target)}</h3><p>Tiru ritme dan kalimat speaker. Penilaian browser membandingkan hasil speech recognition dengan target.</p></div><div class="lab-shadow-score"><div><strong id="labSpeechMatch">–</strong><small>Speech match</small></div><div><strong id="labFluency">–</strong><small>Fluency</small></div><div><strong id="labAccuracy">–</strong><small>Accuracy</small></div></div><button class="lab-record-btn" id="labRecordBtn">🎙 Mulai Rekam</button><div id="labShadowTranscript" class="lab-sequence">Transcript akan muncul di sini.</div><div id="labResult" class="lab-result-box"></div>`; $('#labRecordBtn').onclick=()=>startListeningShadowing(l,drill); }
}
function updateLabHearts(){ const el=$('#labHearts'); if(el)el.innerHTML=`${'❤️'.repeat(state.listeningHearts)} <b>Combo x${state.listeningCombo} 🔥</b>`; }
function showListeningResult(good,html){ const box=$('#labResult'); if(!box)return; box.className=`lab-result-box show ${good?'good':'bad'}`; box.innerHTML=html; updateLabHearts(); }
function startListeningShadowing(l,drill){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ showListeningResult(false,'Browser ini belum mendukung Speech Recognition. Gunakan Chrome/Edge terbaru.'); return; } state.listeningSpeechRecognition?.abort?.(); const rec=new SR(); state.listeningSpeechRecognition=rec; rec.lang=cfg().speech; rec.interimResults=false; rec.continuous=false; const btn=$('#labRecordBtn'); const started=performance.now(); btn.disabled=true; btn.textContent='● Merekam...'; rec.onresult=e=>{ const transcript=[...e.results].map(r=>r[0]?.transcript||'').join(' ').trim(); const elapsed=Math.max(.7,(performance.now()-started)/1000); const accuracy=listeningSimilarity(transcript,drill.text); const expectedUnits=usesWordSpacing()?drill.tokens.length:[...normalizeListeningText(drill.text)].length; const heardUnits=usesWordSpacing()?transcript.trim().split(/\s+/).filter(Boolean).length:[...normalizeListeningText(transcript)].length; const coverage=Math.min(100,Math.round(heardUnits/Math.max(1,expectedUnits)*100)); const fluency=Math.min(100,Math.max(35,Math.round(70+Math.min(20,expectedUnits/elapsed*3)-Math.abs(expectedUnits-heardUnits)*3))); $('#labSpeechMatch').textContent=accuracy; $('#labFluency').textContent=fluency; $('#labAccuracy').textContent=coverage; $('#labShadowTranscript').textContent=transcript||'Tidak ada transcript.'; if(accuracy>=65){ const xp=awardListeningSuccess({xp:25,accuracy,shadow:true}); showListeningResult(true,`<b>Shadowing selesai 🎙️</b><br>Speech match ${accuracy}%. Pertahankan ritme kalimat.<br><small>+${xp||0} XP</small>`); } else { registerListeningMiss(); showListeningResult(false,`<b>Belum cukup dekat dengan target.</b><br>Speech match ${accuracy}%. Putar target pelan lalu ulangi.`); } }; rec.onerror=e=>showListeningResult(false,`Rekaman gagal: ${esc(e.error||'microphone error')}. Izinkan microphone lalu coba lagi.`); rec.onend=()=>{ btn.disabled=false; btn.textContent='🎙 Rekam Lagi'; state.listeningSpeechRecognition=null; }; try{rec.start();}catch(e){btn.disabled=false;btn.textContent='🎙 Mulai Rekam';showListeningResult(false,'Microphone belum siap. Coba lagi.');} }
function randomListening(){ const data=filteredListening(); if(!data.length) return; state.selectedLesson=data[Math.floor(Math.random()*data.length)]; resetListeningAttempt(); renderListening(); }
function renderListeningAchievements(){ const wrap=$('#listeningAchievementRow'); if(!wrap)return; checkAchievements(); const ids=['listening-hero','perfect-combo','shadow-master','sharp-ears']; wrap.innerHTML=ids.map(id=>{ const a=ACHIEVEMENT_DEFS.find(x=>x.id===id); if(!a)return''; const current=Math.max(0,Number(a.metric())||0); const unlocked=!!achievements.unlocked[a.id]; const pct=Math.min(100,Math.round(current/a.target*100)); return `<article class="lab-achievement-card ${unlocked?'unlocked':''}"><span>${a.icon}</span><div><b>${esc(a.title)}</b><small>${esc(a.desc)}</small><i><em style="width:${pct}%"></em></i></div><strong>${unlocked?'UNLOCKED':`${Math.min(current,a.target)} / ${a.target}`}</strong></article>`; }).join(''); }

function populateExpressionFilters(){ const types=[...new Set(expressionData().map(x=>x.type).filter(Boolean))].sort(); $('#exprType').innerHTML='<option value="all">All types</option>'+types.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join(''); }
function renderExpressions(){ const q=norm($('#exprSearch').value); const type=$('#exprType').value||'all'; const data=expressionData().filter(x=>(type==='all'||x.type===type)&&(!q||norm([x.phrase,x.pinyin,x.meaning,x.example,x.category].join(' ')).includes(q))); $('#exprGrid').innerHTML=data.map(x=>`<article class="expr-card card"><span class="tag">${esc(x.category||x.type||'')}</span><h3>${esc(x.phrase)}</h3>${x.pinyin?`<p><b>${esc(x.pinyin)}</b></p>`:''}<p>${esc(x.meaning||'')}</p><p>${esc(x.example||'')}</p></article>`).join('') || '<p class="muted">Tidak ada expression yang cocok.</p>'; }

function writingPromptBank(){ const task=$('#writingTask')?.value||cfg().writingTasks[0]; const modeBank=WRITING_PROMPTS[state.mode]||{}; return modeBank[task]||[{type:'Writing practice',minWords:40,time:'10 menit',title:task,prompt:`Write a response for: ${task}`}]; }
function currentWritingPrompt(){ const bank=writingPromptBank(); return bank[state.writingPromptIndex % bank.length]||bank[0]; }
function countWritingUnits(text=''){ if(isMandarin()) return (text.match(/[\u4e00-\u9fff]/g)||[]).length; if(isJapanese()) return text.replace(/\s+/g,'').length; return text.trim()?text.trim().split(/\s+/).filter(Boolean).length:0; }
function writingUnitLabel(){ return usesWordSpacing()?'kata':isMandarin()?'汉字':'文字'; }
function updateWritingWordCount(){ const p=currentWritingPrompt(); const count=countWritingUnits($('#writingText')?.value||''); const el=$('#writingWordCount'); if(el){ el.textContent=`${count} / ${p.minWords} ${writingUnitLabel()}`; el.classList.toggle('enough',count>=p.minWords); } }
function renderWritingPrompt(){ const p=currentWritingPrompt(); if(!p) return; $('#writingTaskType').textContent=p.type||'Writing task'; $('#writingPromptTitle').textContent=p.title||'Pertanyaan latihan'; $('#writingPrompt').textContent=p.prompt||''; $('#writingInstruction').textContent=`Minimal ${p.minWords} ${writingUnitLabel()} · Waktu rekomendasi ${p.time||'-'}`; updateWritingWordCount(); setResultText('#writingResult',''); }
function newWritingPrompt(){ const bank=writingPromptBank(); if(bank.length>1) state.writingPromptIndex=(state.writingPromptIndex+1)%bank.length; renderWritingPrompt(); $('#writingText').focus(); }
function populateWritingTasks(){ $('#writingTask').innerHTML=cfg().writingTasks.map(x=>`<option>${esc(x)}</option>`).join(''); $('#writingText').placeholder=cfg().writingPlaceholder; $('#writingText').value=''; $('#speechTranscript').value=''; setResultText('#writingResult',''); setResultText('#speakingResult',''); state.writingPromptIndex=0; renderWritingPrompt(); }
function populateSpeakingPrompts(){ $('#speakPrompt').innerHTML=cfg().speakingPrompts.map((p,i)=>`<option value="${i}">${esc(p.label)}</option>`).join(''); renderSpeakingTarget(); }
function renderSpeakingTarget(){ const p=cfg().speakingPrompts[Number($('#speakPrompt').value||0)]||cfg().speakingPrompts[0]; $('#speakingTarget').textContent=p.target; }
function localWritingCheck(){
  const text=$('#writingText').value.trim(); if(!text) return toast('Tulis jawaban dulu');
  const p=currentWritingPrompt(); const count=countWritingUnits(text); const enough=count>=p.minWords;
  if(isEnglish()){
    const connectors=['because','however','therefore','although','moreover','for example','in conclusion'].filter(x=>text.toLowerCase().includes(x));
    const message=`## Pemeriksaan awal\n\n- **Jumlah kata:** ${count}/${p.minWords}\n- **Penghubung yang ditemukan:** ${connectors.join(', ')||'belum ada'}\n- **Status:** ${enough?'Panjang jawaban sudah cukup untuk diperiksa lebih lanjut.':'Jawaban masih terlalu pendek.'}\n\n${enough?'Klik **AI Feedback** untuk penilaian berdasarkan soal yang tampil.':'Lengkapi argumen, contoh, dan kesimpulan sebelum meminta perkiraan band.'}`;
    setResultMarkdown('#writingResult',message);
  } else if(isMandarin()){
    const patterns=['因为','所以','虽然','但是','如果','就','比','越来越','把','被'].filter(x=>text.includes(x));
    setResultMarkdown('#writingResult',`## Pemeriksaan awal\n\n- **汉字:** ${count}/${p.minWords}\n- **Pola grammar:** ${patterns.join('、')||'belum ditemukan'}\n- **Status:** ${enough?'Siap untuk AI Feedback.':'Tulisan masih terlalu pendek.'}`);
  } else if(isJapanese()) {
    const particles=['は','が','を','に','で','へ','と','も','から','まで'].filter(x=>text.includes(x));
    setResultMarkdown('#writingResult',`## Pemeriksaan awal\n\n- **文字:** ${count}/${p.minWords}\n- **Partikel:** ${particles.join('、')||'belum ditemukan'}\n- **Status:** ${enough?'Siap untuk AI Feedback.':'Tulisan masih terlalu pendek.'}`);
  } else {
    const connectors=['weil','obwohl','wenn','dass','aber','deshalb','trotzdem','außerdem'].filter(x=>text.toLowerCase().includes(x));
    setResultMarkdown('#writingResult',`## Pemeriksaan awal\n\n- **Jumlah kata:** ${count}/${p.minWords}\n- **Penghubung Jerman:** ${connectors.join(', ')||'belum ditemukan'}\n- **Status:** ${enough?'Siap untuk AI Feedback.':'Tulisan masih terlalu pendek.'}`);
  }
}
async function aiWritingCheck(){
  const text=$('#writingText').value.trim(); if(!text) return toast('Tulis jawaban dulu');
  const task=$('#writingTask').value; const p=currentWritingPrompt(); const count=countWritingUnits(text);
  const hardMinimum=isEnglish()?(task==='IELTS Task 2'?50:task==='IELTS Task 1'?40:15):isGerman()?Math.max(20,Math.floor(p.minWords*.35)):Math.max(10,Math.floor(p.minWords*.25));
  if(count<hardMinimum){
    setResultMarkdown('#writingResult',`## Jawaban belum dapat dinilai\n\nJawabanmu baru **${count} ${writingUnitLabel()}**. Untuk **${task}**, tulis setidaknya **${p.minWords} ${writingUnitLabel()}** agar feedback lebih akurat.\n\n**Soal:** ${p.prompt}`);
    return;
  }
  const formatRule='Use clean Markdown only. Do not output HTML tags such as <br>. Keep the feedback concise, clearly structured, and based only on the exact question below. Do not invent a different question.';
  const prompt=isEnglish()?`You are a careful IELTS writing examiner and tutor. ${formatRule}\n\nTASK TYPE: ${task}\nEXACT QUESTION: ${p.prompt}\nEXPECTED MINIMUM: ${p.minWords} words\nSTUDENT WORD COUNT: ${count}\n\nEvaluate in Indonesian using these sections:\n1. Ringkasan\n2. Perkiraan band (only if the response is long enough; otherwise say not enough evidence)\n3. Task Response\n4. Coherence and Cohesion\n5. Lexical Resource\n6. Grammatical Range and Accuracy\n7. Corrections with a few concrete examples\n8. Next step\n\nDo not write a complete replacement essay unless the user response is reasonably complete. STUDENT RESPONSE:\n${text}`:isMandarin()?`You are an HSK Mandarin writing tutor. ${formatRule}\n\nTASK: ${task}\nEXACT QUESTION: ${p.prompt}\nTARGET: ${p.minWords} Hanzi\nSTUDENT COUNT: ${count}\n\nGive Indonesian feedback on task completion, grammar, word choice, naturalness, corrected examples, pinyin/tone warnings where relevant, and next practice. STUDENT RESPONSE:\n${text}`:isJapanese()?`You are a JLPT Japanese writing tutor. ${formatRule}\n\nTASK: ${task}\nEXACT QUESTION: ${p.prompt}\nTARGET: ${p.minWords} characters\nSTUDENT COUNT: ${count}\n\nGive Indonesian feedback on task completion, particles, grammar, kanji/kana, natural expression, corrected examples, and next JLPT practice. STUDENT RESPONSE:\n${text}`:`You are a German CEFR writing tutor. ${formatRule}\n\nTASK: ${task}\nEXACT QUESTION: ${p.prompt}\nTARGET: ${p.minWords} words\nSTUDENT COUNT: ${count}\n\nGive concise feedback in Indonesian on task completion, CEFR evidence, German word order and verb position, cases, articles, adjective endings where relevant, vocabulary, register, corrected German examples, and the next practice step. STUDENT RESPONSE:\n${text}`;
  setResultText('#writingResult','AI sedang memeriksa jawaban...');
  try{ setResultMarkdown('#writingResult',await callAI(prompt)); progress.stats.aiChecks=(progress.stats.aiChecks||0)+1; save(); }catch(e){ setResultText('#writingResult',e.message); }
}
async function saveWritingCloud(){
  const answer=($('#writingText')?.value||'').trim();
  if(!answer) return toast('Tulis jawaban dulu');
  if(!window.LexoraCloud?.saveWriting) return toast('Cloud writing belum aktif');
  const p=currentWritingPrompt();
  const record={
    mode:state.mode,
    taskType:$('#writingTask')?.value||'Writing',
    prompt:p?.prompt||'',
    answer,
    aiFeedback:($('#writingResult')?.innerText||'').trim(),
    unitCount:countWritingUnits(answer)
  };
  const btn=$('#saveWritingBtn');
  if(btn){ btn.disabled=true; btn.textContent='Menyimpan...'; }
  try{
    const row=await window.LexoraCloud.saveWriting(record);
    if(row){ savedWritings=[row,...savedWritings.filter(x=>x.id!==row.id)]; renderProgress(); toast('Jawaban tersimpan ke akun'); }
  }catch(error){ console.error('Save writing error:',error); toast('Jawaban belum tersimpan'); }
  finally{ if(btn){ btn.disabled=false; btn.textContent='🔖 Simpan Jawaban'; } }
}

function startSpeech(){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return toast('Browser tidak support SpeechRecognition. Coba Chrome/Edge.'); state.recognition=new SR(); state.recognition.lang=cfg().speech; state.recognition.continuous=true; state.recognition.interimResults=true; let final=''; state.recognition.onresult=e=>{ let interim=''; for(let i=e.resultIndex;i<e.results.length;i++){ const txt=e.results[i][0].transcript; if(e.results[i].isFinal) final+=txt+' '; else interim+=txt; } $('#speechTranscript').value=(final+interim).trim(); localSpeakingCheck(); }; state.recognition.onerror=e=>$('#speakingResult').textContent='Speech error: '+e.error; state.recognition.start(); toast('Recording started'); }
function stopSpeech(){ if(state.recognition){ state.recognition.stop(); toast('Recording stopped'); } }
function compareText(a,b){ const chars=!usesWordSpacing(); const A=new Set(chars?String(a).replace(/\s+/g,'').split(''):norm(a).split(/\s+/).filter(Boolean)); const B=new Set(chars?String(b).replace(/\s+/g,'').split(''):norm(b).split(/\s+/).filter(Boolean)); const inter=[...A].filter(x=>B.has(x)).length; return inter/Math.max(1,A.size); }
function localSpeakingCheck(){ const target=$('#speakingTarget').textContent; const said=$('#speechTranscript').value.trim(); if(!said) return; const sim=Math.round(compareText(target,said)*100); const toneWarning=isMandarin()?'\n\nCatatan: hasil Hanzi hanya mengecek kemiripan kata, bukan ketepatan nada. Gunakan Tone Coach di bawah untuk mengecek pitch.':''; $('#speakingResult').textContent=`Score awal: ${sim}%\n${sim>=70?'Bagus, lanjutkan.':sim>=40?'Cukup, ulangi sekali lagi.':'Perlu diulang pelan-pelan.'}${toneWarning}`; }
async function aiSpeakingCheck(){ const target=$('#speakingTarget').textContent, said=$('#speechTranscript').value.trim(); if(!said) return toast('Rekam atau tulis jawaban dulu'); const prompt=isEnglish()?`You are an IELTS speaking teacher. Use clean Markdown only, no HTML tags. Prompt/target: ${target}. Student transcript: ${said}. Give concise feedback in Indonesian: fluency, grammar, pronunciation tips, vocabulary upgrades, and a better answer.`:isMandarin()?`You are an HSK Mandarin speaking teacher. Use clean Markdown only, no HTML tags. Target: ${target}. Student transcript from speech recognition: ${said}. ${toneAnalysisSummary()} Speech recognition may output the intended Hanzi even when tones are wrong. Never claim tone accuracy from transcript alone. Give feedback in Indonesian: grammar, word choice, corrected Mandarin answer, pinyin, and use the pitch analysis only when available.`:isJapanese()?`You are a JLPT Japanese speaking teacher. Use clean Markdown only, no HTML tags. Target: ${target}. Student transcript from speech recognition: ${said}. Give feedback in Indonesian: pronunciation tips, particle/grammar notes, kanji/kana notes, corrected Japanese answer, romaji if useful, and a short JLPT speaking drill.`:`You are a German CEFR speaking tutor. Use clean Markdown only, no HTML tags. Target: ${target}. Student transcript from speech recognition: ${said}. Give feedback in Indonesian on pronunciation, word stress, German word order, grammar, cases/articles where relevant, vocabulary, corrected German answer, and a short CEFR speaking drill.`; setResultText('#speakingResult','AI sedang memeriksa jawaban...'); try{setResultMarkdown('#speakingResult',await callAI(prompt)); progress.stats.aiChecks=(progress.stats.aiChecks||0)+1; save();}catch(e){setResultText('#speakingResult',e.message);} }
function speak(text, lang='en-US'){ if(!('speechSynthesis' in window)) return; const u=new SpeechSynthesisUtterance(text); u.lang=lang; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }

const TONE_MARKS={
  'ā':['a',1],'á':['a',2],'ǎ':['a',3],'à':['a',4],
  'ē':['e',1],'é':['e',2],'ě':['e',3],'è':['e',4],
  'ī':['i',1],'í':['i',2],'ǐ':['i',3],'ì':['i',4],
  'ō':['o',1],'ó':['o',2],'ǒ':['o',3],'ò':['o',4],
  'ū':['u',1],'ú':['u',2],'ǔ':['u',3],'ù':['u',4],
  'ǖ':['ü',1],'ǘ':['ü',2],'ǚ':['ü',3],'ǜ':['ü',4],
  'Ā':['a',1],'Á':['a',2],'Ǎ':['a',3],'À':['a',4],
  'Ē':['e',1],'É':['e',2],'Ě':['e',3],'È':['e',4],
  'Ī':['i',1],'Í':['i',2],'Ǐ':['i',3],'Ì':['i',4],
  'Ō':['o',1],'Ó':['o',2],'Ǒ':['o',3],'Ò':['o',4],
  'Ū':['u',1],'Ú':['u',2],'Ǔ':['u',3],'Ù':['u',4],
  'Ǖ':['ü',1],'Ǘ':['ü',2],'Ǚ':['ü',3],'Ǜ':['ü',4]
};
const TONE_NAMES={1:'tinggi dan datar',2:'naik',3:'turun lalu naik / rendah',4:'turun tajam',5:'netral dan ringan'};
const TONE_QUICK_WORDS=['现在','喝','和','中国','学习','朋友','妈妈','马上'];

function parsePinyinSyllables(pinyin=''){
  return String(pinyin).normalize('NFC').replace(/u:/gi,'ü').replace(/[，,。.!?！？；;、/]+/g,' ').split(/[\s·—–-]+/).filter(Boolean).map(raw=>{
    let tone=5,plain='';
    for(const ch of raw){
      if(TONE_MARKS[ch]){ plain+=TONE_MARKS[ch][0]; tone=TONE_MARKS[ch][1]; }
      else plain+=ch.toLowerCase();
    }
    const numbered=plain.match(/^(.*?)([1-5])$/);
    if(numbered){ plain=numbered[1]; tone=Number(numbered[2]); }
    plain=plain.replace(/[^a-züê]/g,'');
    return {raw,plain,tone,numbered:`${plain}${tone}`};
  }).filter(x=>x.plain);
}
function spokenToneTargets(syllables){
  const tones=syllables.map(x=>x.tone); const notes=[];
  for(let i=0;i<tones.length-1;i++){
    if(tones[i]===3&&tones[i+1]===3){ tones[i]=2; notes.push(`${syllables[i].raw}: tone 3 di depan tone 3 biasanya diucapkan seperti tone 2`); }
    if(syllables[i].plain==='bu'&&syllables[i].tone===4&&tones[i+1]===4){ tones[i]=2; notes.push('不 bù berubah menjadi bú sebelum tone 4'); }
    if(syllables[i].plain==='yi'&&syllables[i].tone===1){ tones[i]=tones[i+1]===4?2:4; notes.push(`一 yī mengalami perubahan nada menjadi tone ${tones[i]} pada frasa ini`); }
  }
  return {tones,notes};
}
function toneWordCandidates(){
  return (state.data.hsk||[]).filter(w=>w.hanzi&&w.pinyin&&!String(w.hanzi).includes('|')).map(w=>({w,syllables:parsePinyinSyllables(w.pinyin)})).filter(x=>x.syllables.length>=1&&x.syllables.length<=4);
}
function toneSearchKey(v=''){ return norm(v).replace(/[^a-z0-9\u3400-\u9fff]/g,''); }
function findToneWord(query){
  const key=toneSearchKey(query); if(!key) return null;
  const list=toneWordCandidates();
  return (list.find(x=>toneSearchKey(x.w.hanzi)===key)||list.find(x=>toneSearchKey(x.w.pinyin)===key)||list.find(x=>toneSearchKey(x.w.hanzi).includes(key)||toneSearchKey(x.w.pinyin).includes(key)))?.w||null;
}
function renderToneQuickWords(){
  const el=$('#toneQuickWords'); if(!el) return;
  el.innerHTML=TONE_QUICK_WORDS.map(h=>`<button type="button" data-tone-word="${esc(h)}">${esc(h)}</button>`).join('');
}
function setToneTarget(word){
  const syllables=parsePinyinSyllables(word?.pinyin||''); if(!word||!syllables.length) return toast('Pinyin kata ini belum tersedia.');
  const spoken=spokenToneTargets(syllables);
  state.currentTone={...word,syllables,targetTones:spoken.tones,sandhiNotes:spoken.notes,num:syllables.map(x=>x.numbered).join(' ')};
  state.lastToneAnalysis=null;
  $('#toneTarget').innerHTML=`${esc(word.hanzi)}<br><small>${esc(word.pinyin)}</small>`;
  $('#toneSyllableTargets').innerHTML=syllables.map((x,i)=>`<span><b>${esc(x.raw)}</b><small>target ${spoken.tones[i]===5?'netral':'tone '+spoken.tones[i]}</small></span>`).join('');
  $('#toneInput').value=''; $('#toneInput').placeholder=`Ketik pinyin number: ${state.currentTone.num}`;
  $('#toneOptions').innerHTML='<button id="playTone">🔊 Dengarkan</button><button class="primary" id="recordTone">🎙️ Rekam kata</button>';
  $('#playTone').onclick=()=>speak(word.hanzi,'zh-CN'); $('#recordTone').onclick=recordToneAudio;
  const extra=spoken.notes.length?`\nCatatan perubahan nada: ${spoken.notes.join('; ')}.`:'';
  $('#toneResult').textContent=`Ucapkan ${word.hanzi} (${word.pinyin}) pelan dan beri jeda kecil antarsuku kata.${extra}\nSpeech-to-text bisa menebak Hanzi yang benar walau nadanya salah; penilaian di sini memakai pitch suara.`;
  $('#tonePitchChart').innerHTML='';
}
function selectToneWord(hanzi){ const w=findToneWord(hanzi); if(w){ $('#toneWordSearch').value=w.hanzi; setToneTarget(w); } }
function loadToneWord(){ const q=$('#toneWordSearch').value.trim(); if(!q) return toast('Masukkan Hanzi atau pinyin.'); const w=findToneWord(q); if(!w) return toast('Kata tidak ditemukan atau pinyinnya belum tersedia.'); setToneTarget(w); }
function newTone(){
  if(!isMandarin()) return;
  renderToneQuickWords();
  const basics=toneWordCandidates().filter(x=>['HSK 1','HSK 2'].includes(x.w.hsk||x.w.level));
  const pool=basics.length?basics:toneWordCandidates(); const pick=pool[Math.floor(Math.random()*pool.length)]?.w;
  if(pick) setToneTarget(pick);
}
function checkToneChoice(tone){ const t=state.currentTone; if(!t) return; const ok=String(tone)===String(t.targetTones[0]); $('#toneResult').textContent=`${ok?'✅ Benar':'❌ Belum tepat'} — ${t.hanzi} ${t.pinyin}, target pengucapan: ${t.targetTones.join('-')}.`; }
function checkToneInput(){
  const t=state.currentTone; if(!t) return;
  const typed=parsePinyinSyllables($('#toneInput').value); const got=typed.map(x=>x.tone); const lexical=t.syllables.map(x=>x.tone);
  const ok=got.length===lexical.length&&got.every((x,i)=>x===lexical[i]);
  $('#toneResult').textContent=`${ok?'✅ Pinyin benar':'❌ Pinyin belum tepat'} — jawaban: ${t.num}. Target nada saat diucapkan: ${t.targetTones.join('-')}${t.sandhiNotes.length?' ('+t.sandhiNotes.join('; ')+')':''}.`;
}
function median(values){ if(!values.length) return 0; const a=[...values].sort((x,y)=>x-y),m=Math.floor(a.length/2); return a.length%2?a[m]:(a[m-1]+a[m])/2; }
function detectPitchNacf(buf,sampleRate){
  const n=buf.length; let mean=0; for(let i=0;i<n;i++) mean+=buf[i]; mean/=n;
  let rms=0; const x=new Float32Array(n); for(let i=0;i<n;i++){ x[i]=buf[i]-mean; rms+=x[i]*x[i]; } rms=Math.sqrt(rms/n);
  if(rms<0.009) return {pitch:-1,clarity:0,rms};
  const minLag=Math.max(2,Math.floor(sampleRate/550)),maxLag=Math.min(n-3,Math.ceil(sampleRate/65));
  const cors=[]; let best=0,bestLag=-1;
  for(let lag=minLag;lag<=maxLag;lag++){
    let xy=0,xx=0,yy=0; const limit=n-lag;
    for(let i=0;i<limit;i++){ const a=x[i],b=x[i+lag]; xy+=a*b; xx+=a*a; yy+=b*b; }
    const c=xy/Math.sqrt(Math.max(1e-12,xx*yy)); cors[lag]=c;
    if(c>best){best=c;bestLag=lag;}
  }
  if(best<0.55) return {pitch:-1,clarity:best,rms};
  const threshold=Math.max(.58,best*.9); let chosen=bestLag;
  for(let lag=minLag+1;lag<bestLag;lag++) if(cors[lag]>=threshold&&cors[lag]>=cors[lag-1]&&cors[lag]>=cors[lag+1]){chosen=lag;break;}
  const c0=cors[chosen-1]||cors[chosen],c1=cors[chosen]||best,c2=cors[chosen+1]||cors[chosen]; const denom=(c0-2*c1+c2); const shift=Math.abs(denom)>1e-6?.5*(c0-c2)/denom:0;
  const lag=chosen+Math.max(-.5,Math.min(.5,shift));
  return {pitch:sampleRate/lag,clarity:c1,rms};
}
function cleanPitchSamples(samples){
  let p=samples.filter(x=>x.pitch>=65&&x.pitch<=550&&x.clarity>=.55); if(!p.length) return [];
  const med=median(p.map(x=>x.pitch)); p=p.map(x=>{ let v=x.pitch; while(v>med*1.75) v/=2; while(v<med/1.75) v*=2; return {...x,pitch:v}; });
  return p.map((x,i,a)=>{ const local=a.slice(Math.max(0,i-2),Math.min(a.length,i+3)).map(v=>v.pitch); return {...x,pitch:median(local)}; });
}
function splitToneSamples(samples,count){
  if(count<=1) return [samples]; if(samples.length<count*3) return Array.from({length:count},(_,i)=>samples.slice(Math.floor(i*samples.length/count),Math.floor((i+1)*samples.length/count)));
  const start=samples[0].time,end=samples.at(-1).time,total=Math.max(.2,end-start),bounds=[start];
  for(let i=1;i<count;i++){
    const ideal=start+total*i/count,window=total/count*.32; let bestGap=0,boundary=ideal;
    for(let j=1;j<samples.length;j++){ const mid=(samples[j-1].time+samples[j].time)/2;if(Math.abs(mid-ideal)>window) continue; const gap=samples[j].time-samples[j-1].time;if(gap>bestGap){bestGap=gap;boundary=mid;} }
    bounds.push(bestGap>.07?boundary:ideal);
  }
  bounds.push(end+.001);
  return Array.from({length:count},(_,i)=>samples.filter(x=>x.time>=bounds[i]&&x.time<bounds[i+1]));
}
function resampleContour(values,n=9){
  if(!values.length) return [];
  const out=[]; for(let i=0;i<n;i++){ const pos=i*(values.length-1)/(n-1),lo=Math.floor(pos),hi=Math.ceil(pos),f=pos-lo; out.push(values[lo]*(1-f)+values[hi]*f); } return out;
}
const ninePointCount=9;
function classifyToneSegment(segment,expectedTone=0){
  if(segment.length<4) return {tone:'?',confidence:0,contour:[],reason:'suara terlalu pendek'};
  const base=median(segment.map(x=>x.pitch)); let semis=segment.map(x=>12*Math.log2(x.pitch/base)); semis=resampleContour(semis,ninePointCount);
  const start=(semis[0]+semis[1])/2,mid=(semis[3]+semis[4]+semis[5])/3,end=(semis[7]+semis[8])/2,min=Math.min(...semis),max=Math.max(...semis),range=max-min,minAt=semis.indexOf(min)/(semis.length-1),rise=end-start,fall=start-end;
  let tone='?',reason='';
  if(expectedTone===5){ tone='5'; reason='suku kata netral dinilai terutama dari durasi dan tekanan'; }
  else if(range<1.55&&Math.abs(rise)<1.1){tone='1';reason='kontur relatif datar';}
  else if(rise>1.65&&end>mid+.35){tone='2';reason='pitch bergerak naik';}
  else if(fall>2.0&&end<mid+.2){tone='4';reason='pitch turun jelas';}
  else if(minAt>.2&&minAt<.82&&mid<start-.55&&end>mid+.55){tone='3';reason='pitch turun lalu kembali naik';}
  else if(mid<start-.7&&range>1.4){tone='3';reason='kontur rendah/dipping, bentuk umum tone 3';}
  else if(rise>=0){tone='2';reason='lebih dekat ke kontur naik';}
  else {tone='4';reason='lebih dekat ke kontur turun';}
  const clarity=segment.reduce((a,b)=>a+b.clarity,0)/segment.length; const shapeStrength=Math.min(1,range/3); let confidence=Math.round(55+clarity*25+shapeStrength*18); if(tone==='1') confidence=Math.round(58+clarity*30+Math.max(0,1-range/1.55)*10); confidence=Math.max(50,Math.min(96,confidence));
  return {tone,confidence,contour:semis,start,mid,end,range,minAt,reason};
}
function toneSparkline(contour,targetTone){
  if(!contour?.length) return '';
  const w=180,h=58,pad=6,min=Math.min(...contour,-3),max=Math.max(...contour,3),span=Math.max(1,max-min); const pts=contour.map((v,i)=>`${pad+i*(w-2*pad)/(contour.length-1)},${h-pad-(v-min)*(h-2*pad)/span}`).join(' ');
  return `<svg class="tone-spark" viewBox="0 0 ${w} ${h}" role="img" aria-label="Kontur pitch tone ${targetTone}"><line x1="6" y1="29" x2="174" y2="29"></line><polyline points="${pts}"></polyline></svg>`;
}
function renderToneAnalysis(analysis){
  state.lastToneAnalysis=analysis; const t=state.currentTone;
  const rows=analysis.results.map((r,i)=>`<div class="tone-syllable-result ${r.ok?'ok':'bad'}"><div><b>${esc(t.syllables[i].raw)}</b><small>Target ${t.targetTones[i]===5?'netral':'tone '+t.targetTones[i]} · Terdeteksi ${r.tone==='?'?'tidak jelas':r.tone==='5'?'netral':'tone '+r.tone}</small></div>${toneSparkline(r.contour,t.targetTones[i])}<strong>${r.ok?'✓':'✕'} ${r.confidence}%</strong><p>${esc(r.reason)}</p></div>`).join('');
  $('#toneResult').innerHTML=`<div class="tone-score ${analysis.score===100?'great':analysis.score>=60?'mid':'low'}"><b>${analysis.score}%</b><span>${analysis.score===100?'Semua nada cocok':analysis.score>=60?'Sebagian nada sudah benar':'Ulangi dengan lebih pelan'}</span></div>${rows}${t.sandhiNotes.length?`<div class="tone-note"><b>Perubahan nada:</b> ${esc(t.sandhiNotes.join('; '))}</div>`:''}<div class="tone-note">Hanzi hasil speech-to-text tidak dipakai untuk menentukan nilai nada. Sistem menilai arah pitch tiap suku kata.</div>`;
  $('#tonePitchChart').innerHTML='';
}
async function recordToneAudio(){
  const t=state.currentTone; if(!t||state.toneRecording) return; if(!navigator.mediaDevices?.getUserMedia) return toast('Browser tidak mendukung microphone.');
  state.toneRecording=true; const btn=$('#recordTone'); if(btn){btn.disabled=true;btn.textContent='● Merekam...';}
  const duration=Math.min(6200,Math.max(2600,1500+t.syllables.length*850)); $('#toneResult').textContent=`Bersiap... Ucapkan ${t.hanzi} pelan, satu suku kata demi satu, dengan jeda kecil.`;
  let stream,ctx,timer;
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const AC=window.AudioContext||window.webkitAudioContext; ctx=new AC(); await ctx.resume(); const source=ctx.createMediaStreamSource(stream); const analyser=ctx.createAnalyser(); analyser.fftSize=1024; analyser.smoothingTimeConstant=0; source.connect(analyser);
    const buf=new Float32Array(analyser.fftSize),samples=[],started=performance.now();
    await new Promise(resolve=>{ timer=setInterval(()=>{ analyser.getFloatTimeDomainData(buf); const r=detectPitchNacf(buf,ctx.sampleRate); samples.push({time:(performance.now()-started)/1000,...r}); const elapsed=performance.now()-started; $('#toneResult').textContent=`Merekam ${(elapsed/1000).toFixed(1)} / ${(duration/1000).toFixed(1)} detik — ${t.hanzi} (${t.pinyin})`; if(elapsed>=duration){clearInterval(timer);resolve();} },55); });
    const clean=cleanPitchSamples(samples); if(clean.length<t.syllables.length*4) throw new Error('Suara bernada tidak cukup terbaca. Dekatkan mic dan ucapkan vokal lebih jelas.');
    const segments=splitToneSamples(clean,t.syllables.length); const results=segments.map((seg,i)=>{ const r=classifyToneSegment(seg,t.targetTones[i]); const target=String(t.targetTones[i]); const thirdAccept=target==='3'&&r.tone==='4'&&r.range<3.2; return {...r,ok:String(r.tone)===target||thirdAccept}; });
    const toneScore=Math.round(results.filter(x=>x.ok).length/results.length*100); renderToneAnalysis({hanzi:t.hanzi,pinyin:t.pinyin,targetTones:t.targetTones,detectedTones:results.map(x=>x.tone),score:toneScore,results,createdAt:new Date().toISOString()}); if(toneScore===100){ progress.stats.tonePassed=(progress.stats.tonePassed||0)+1; save(); }
  }catch(e){ $('#toneResult').innerHTML=`<b>Rekaman belum bisa dinilai.</b><br>${esc(e.message||'Izinkan microphone lalu coba lagi.')}<br><small>Gunakan Chrome/Edge lewat HTTPS atau localhost, dan ucapkan kata perlahan.</small>`; }
  finally{ if(timer) clearInterval(timer); stream?.getTracks().forEach(tr=>tr.stop()); if(ctx&&ctx.state!=='closed') await ctx.close().catch(()=>{}); state.toneRecording=false; if(btn){btn.disabled=false;btn.textContent='🎙️ Rekam kata';} }
}
function toneAnalysisSummary(){ const a=state.lastToneAnalysis; if(!a) return 'Belum ada analisis pitch. Jangan menyatakan nada benar hanya dari transcript speech-to-text.'; return `Analisis pitch terakhir: ${a.hanzi} ${a.pinyin}; target ${a.targetTones.join('-')}; terdeteksi ${a.detectedTones.join('-')}; skor ${a.score}%.`; }

function renderProgress(){ const vIds=new Set(vocabData().map(w=>w.id)); const pIds=new Set(practiceData().map(m=>m.id)); const lIds=new Set(listeningData().map(l=>l.id)); const learned=Object.keys(progress.learned).filter(id=>vIds.has(id)); const hard=Object.keys(progress.hard).filter(id=>vIds.has(id)); const saved=Object.keys(progress.saved||{}).filter(id=>vIds.has(id)); const done=Object.keys(progress.donePractice).filter(id=>pIds.has(id)||lIds.has(id)); const modeScores=(progress.scores||[]).filter(s=>s.mode===state.mode); const avg=modeScores.length?Math.round(modeScores.reduce((a,b)=>a+(Number(b.score)||0),0)/modeScores.length):0; $('#statLearned').textContent=learned.length; $('#statHard').textContent=hard.length; $('#statDone').textContent=done.length; $('#statScore').textContent=avg+'%'; const hardWords=vocabData().filter(w=>progress.hard[w.id]).slice(0,30); const savedWords=vocabData().filter(w=>progress.saved?.[w.id]).slice(0,30); $('#hardWordsList').innerHTML=hardWords.map(w=>`<div class="item"><b>${esc(vocabTitle(w))}</b><br><span class="muted">${esc(vocabSub(w))}</span></div>`).join('')||'<p class="muted">Belum ada difficult words.</p>'; if($('#savedWordsList')) $('#savedWordsList').innerHTML=savedWords.map(w=>`<div class="item"><b>${esc(vocabTitle(w))}</b><br><span class="muted">${esc(vocabSub(w))}</span></div>`).join('')||'<p class="muted">Belum ada saved words.</p>'; if($('#statSaved')) $('#statSaved').textContent=saved.length; const writings=(savedWritings||[]).filter(x=>!x.mode||x.mode===state.mode).slice(0,20); if($('#savedWritingList')) $('#savedWritingList').innerHTML=writings.map(x=>`<div class="item saved-writing-item"><b>${esc(x.task_type||'Writing')}</b><br><span class="muted">${esc((x.answer||'').slice(0,180))}${(x.answer||'').length>180?'…':''}</span><small>${x.created_at?new Date(x.created_at).toLocaleString('id-ID'):''}</small></div>`).join('')||'<p class="muted">Belum ada jawaban writing yang disimpan.</p>'; }


const ACHIEVEMENT_DEFS = [
  {id:'first-vocabulary',icon:'🌱',title:'First Vocabulary',desc:'Pelajari kata pertamamu.',target:1,metric:()=>Object.keys(progress.learned).length},
  {id:'words-100',icon:'🏅',title:'100 Words',desc:'Tandai 100 vocabulary sebagai learned.',target:100,metric:()=>Object.keys(progress.learned).length},
  {id:'words-1000',icon:'🏆',title:'1000 Words',desc:'Kuasai 1.000 vocabulary.',target:1000,metric:()=>Object.keys(progress.learned).length},
  {id:'hsk-master',icon:'汉',title:'HSK Master',desc:'Pelajari 1.000 vocabulary HSK.',target:1000,metric:()=>{const ids=new Set((state.data.hsk||[]).map(w=>w.id));return Object.keys(progress.learned).filter(id=>ids.has(id)).length}},
  {id:'deutsch-explorer',icon:'🇩🇪',title:'Deutsch Explorer',desc:'Pelajari 100 vocabulary German CEFR.',target:100,metric:()=>{const ids=new Set((state.data.german||[]).map(w=>w.id));return Object.keys(progress.learned).filter(id=>ids.has(id)).length}},
  {id:'listening-hero',icon:'🎧',title:'Listening Hero',desc:'Selesaikan 10 latihan listening.',target:10,metric:()=>{const ids=new Set((state.data.listening||[]).map(x=>x.id));return Object.keys(progress.donePractice).filter(id=>ids.has(id)).length}},
  {id:'perfect-combo',icon:'🔥',title:'Perfect Combo',desc:'Raih 10 jawaban listening benar beruntun.',target:10,metric:()=>progress.stats.listeningComboBest||0},
  {id:'shadow-master',icon:'🗣️',title:'Shadow Master',desc:'Selesaikan 20 shadowing dengan hasil cukup dekat.',target:20,metric:()=>progress.stats.shadowingDone||0},
  {id:'sharp-ears',icon:'⚡',title:'Sharp Ears',desc:'Dapatkan akurasi listening 90%+ sebanyak 10 kali.',target:10,metric:()=>progress.stats.listeningHighAccuracy||0},
  {id:'grammar-king',icon:'👑',title:'Grammar King',desc:'Selesaikan 10 practice Grammar Builder.',target:10,metric:()=>Object.keys(progress.donePractice).filter(id=>id.includes('grammar')).length},
  {id:'ai-student',icon:'🤖',title:'AI Student',desc:'Gunakan AI Feedback 10 kali.',target:10,metric:()=>progress.stats.aiChecks||0},
  {id:'tone-hunter',icon:'🎙️',title:'Tone Hunter',desc:'Dapatkan skor tone 100% sebanyak 10 kali.',target:10,metric:()=>progress.stats.tonePassed||0}
];
let achievementPopupTimer=null;
function showAchievementUnlock(a){ const pop=$('#achievementUnlockPop'); if(!pop||!a)return; if($('#achievementUnlockIcon'))$('#achievementUnlockIcon').textContent=a.icon; if($('#achievementUnlockTitle'))$('#achievementUnlockTitle').textContent=a.title; if($('#achievementUnlockDesc'))$('#achievementUnlockDesc').textContent=a.desc; clearTimeout(achievementPopupTimer); pop.classList.add('show'); achievementPopupTimer=setTimeout(()=>pop.classList.remove('show'),4200); }
function checkAchievements(){
  if(!state.data.ielts.length && !state.data.hsk.length && !state.data.jlpt.length && !state.data.german.length) return false;
  let changed=false; const unlockedNow=[];
  ACHIEVEMENT_DEFS.forEach(a=>{ const current=Math.max(0,Number(a.metric())||0); if(current>=a.target && !achievements.unlocked[a.id]){ achievements.unlocked[a.id]=Date.now(); changed=true; unlockedNow.push(a); } });
  if(changed){
    localStorage.setItem('lexora-achievements', JSON.stringify(achievements));
    window.LexoraCloud?.queueSave?.({progress, achievements, lastMode:state.mode});
    unlockedNow.forEach((a,i)=>setTimeout(()=>showAchievementUnlock(a),i*4500));
  }
  return changed;
}
function renderAchievements(){
  const grid=$('#achievementGrid'); if(!grid) return; checkAchievements(); const unlocked=ACHIEVEMENT_DEFS.filter(a=>achievements.unlocked[a.id]).length;
  $('#achievementUnlocked').textContent=unlocked; $('#achievementTotal').textContent=ACHIEVEMENT_DEFS.length;
  grid.innerHTML=ACHIEVEMENT_DEFS.map(a=>{ const current=Math.max(0,Number(a.metric())||0); const isUnlocked=!!achievements.unlocked[a.id]; const pct=Math.min(100,Math.round(current/a.target*100)); const when=isUnlocked?new Date(achievements.unlocked[a.id]).toLocaleDateString('id-ID'):''; return `<article class="achievement-card card ${isUnlocked?'unlocked':'locked'}"><div class="achievement-icon">${a.icon}</div><div class="achievement-copy"><div class="achievement-head"><h3>${esc(a.title)}</h3><span>${isUnlocked?'Unlocked':'Locked'}</span></div><p>${esc(a.desc)}</p><div class="achievement-bar"><i style="width:${pct}%"></i></div><small>${Math.min(current,a.target).toLocaleString('id-ID')} / ${a.target.toLocaleString('id-ID')}${isUnlocked?` · ${esc(when)}`:''}</small></div></article>`; }).join('');
}

const dailyBoosts={
  english:[{pill:'☀ Daily English Boost',title:'Vocab Upgrade: Very Important → Crucial / Essential',subtitle:'Untuk IELTS, jangan terlalu sering memakai very important.',boxTitle:'💡 What’s the difference?',bullets:['Crucial = sangat penting karena menentukan hasil.','Essential = sangat diperlukan atau mendasar.'],examples:['➡️ Education is crucial for economic development.','➡️ Sleep is essential for good health.','➡️ Reliable data are crucial for decision-making.'],mini:[['Target hari ini','Pakai 3 vocab baru dalam 3 kalimat.'],['Practice','Kerjakan 1 set IELTS Practice.']]},{pill:'☀ Daily English Boost',title:'Writing Upgrade: Good → Beneficial / Effective / Valuable',subtitle:'Kata good terlalu umum. Upgrade sesuai konteks agar terdengar lebih akademik.',boxTitle:'💡 Pick the right upgrade',bullets:['Beneficial = memberi manfaat.','Effective = berhasil mencapai tujuan.','Valuable = bernilai atau berguna.'],examples:['➡️ Online learning can be beneficial for busy students.','➡️ This method is effective for improving vocabulary.','➡️ Feedback is valuable for writing improvement.'],mini:[['Target hari ini','Ganti 3 kata basic menjadi academic vocab.'],['Practice','Coba 1 Reading Skills practice.']]}],
  mandarin:[{pill:'☀ Daily Mandarin Boost',title:'Tone Focus: 喝 hē vs 和 hé',subtitle:'Nada Mandarin bisa mengubah arti. 喝 hē berarti minum, sedangkan 和 hé berarti dan / bersama.',boxTitle:'💡 What’s the difference?',bullets:['喝 hē = tone 1, tinggi dan datar, artinya minum.','和 hé = tone 2, naik, artinya dan / bersama.'],examples:['➡️ 我喝水。Wǒ hē shuǐ. = Saya minum air.','➡️ 我和朋友学习。Wǒ hé péngyou xuéxí. = Saya belajar bersama teman.','➡️ Jangan ucapkan 喝 seperti hé karena artinya bisa berubah.'],mini:[['Target hari ini','Latih 5 kata tone 1 dan tone 2.'],['Practice','Kerjakan 1 set HSK Practice.']]},{pill:'☀ Daily Mandarin Boost',title:'Sentence Pattern: 因为...所以...',subtitle:'Pola ini sering dipakai untuk menjelaskan alasan dalam Mandarin.',boxTitle:'💡 Struktur kalimat',bullets:['因为 + alasan = karena...','所以 + hasil = maka / jadi...'],examples:['➡️ 因为我想去中国，所以我学习中文。','➡️ Yīnwèi wǒ xiǎng qù Zhōngguó, suǒyǐ wǒ xuéxí Zhōngwén.','➡️ Karena saya ingin pergi ke China, jadi saya belajar Mandarin.'],mini:[['Target hari ini','Buat 3 kalimat 因为...所以...'],['Practice','Coba 1 HSK level practice.']]}],
  japanese:[{pill:'☀ Daily Japanese Boost',title:'JLPT N5 Pattern: は vs を',subtitle:'Partikel Jepang menentukan fungsi kata dalam kalimat.',boxTitle:'💡 Bedanya apa?',bullets:['は menandai topik kalimat.','を menandai objek yang dikenai aksi.'],examples:['➡️ 私は学生です。= Saya adalah siswa.','➡️ 私は本を読みます。= Saya membaca buku.','➡️ Jangan menukar は dan を karena makna kalimat bisa rusak.'],mini:[['Target hari ini','Buat 3 kalimat pakai は dan を.'],['Practice','Kerjakan 1 set JLPT Practice.']]},{pill:'☀ Daily Japanese Boost',title:'Vocab Focus: 勉強する vs 学ぶ',subtitle:'Keduanya berhubungan dengan belajar, tapi nuansanya berbeda.',boxTitle:'💡 Pilih yang pas',bullets:['勉強する = belajar/study untuk pelajaran atau ujian.','学ぶ = mempelajari/mendapatkan pembelajaran secara lebih luas.'],examples:['➡️ 毎日日本語を勉強します。','➡️ 経験から多くを学びました。','➡️ Untuk JLPT basic, 勉強する lebih sering dipakai.'],mini:[['Target hari ini','Hafal 5 vocab JLPT baru.'],['Practice','Coba 1 listening Jepang.']]}]
};
function todayBoost(){ const list=dailyBoosts[state.mode]||dailyBoosts.english; const idx=Math.abs(new Date().toDateString().split('').reduce((a,c)=>a+c.charCodeAt(0),0))%list.length; return list[idx]; }
const originalTodayBoost = todayBoost;
todayBoost = function(){
  if(isGerman()){
    const days=[
      {pill:'☀ Daily German Boost',title:'Verbposition',subtitle:'In Hauptsätzen steht das konjugierte Verb oft an Position 2.',boxTitle:'Heute merken',bullets:['Ich lerne heute Deutsch.','Heute lerne ich Deutsch.','Mit weil steht das Verb am Ende.'],examples:['Ich lerne Deutsch, weil ich in Deutschland studieren möchte.','Morgen gehe ich zur Schule.'],mini:[['Wort','lernen'],['Phrase','jeden Tag'],['Level','CEFR A1–B1']]},
      {pill:'☀ Daily German Boost',title:'Artikel & Kasus',subtitle:'Perhatikan der, die, das dan perubahan artikel sesuai fungsi kata.',boxTitle:'Mini focus',bullets:['der Mann','die Schule','das Buch'],examples:['Ich sehe den Mann.','Ich lerne in der Schule.'],mini:[['Nominativ','der'],['Akkusativ','den'],['Dativ','dem']]},
      {pill:'☀ Daily German Boost',title:'Natürlich verbinden',subtitle:'Gunakan penghubung untuk membuat jawaban lebih alami.',boxTitle:'Connectors',bullets:['weil = karena','obwohl = meskipun','deshalb = oleh karena itu'],examples:['Ich lerne viel, weil ich ein Ziel habe.','Es regnet. Trotzdem gehe ich raus.'],mini:[['weil','Verb am Ende'],['trotzdem','Verb Position 2'],['Level','B1+']]}
    ];
    return days[new Date().getDate()%days.length];
  }
  return originalTodayBoost();
};

function renderDailyPreview(){ const d=todayBoost(); $('#dailyPreview').innerHTML=`<div class="item"><b>${esc(d.pill.replace('☀ ',''))}</b><br><span class="muted">${esc(d.title)}</span></div>`; $('#dailyPill').textContent=d.pill; $('#dailyModalContent').innerHTML=`<div class="boost-content"><h2 class="boost-title">${esc(d.title)}</h2><p class="boost-subtitle">${esc(d.subtitle)}</p><div class="boost-box"><h3>${esc(d.boxTitle)}</h3><ul>${d.bullets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><h3>📌 Examples</h3><div class="boost-examples">${d.examples.map(x=>`<div class="boost-example">${esc(x)}</div>`).join('')}</div><div class="boost-mini-grid">${d.mini.map(x=>`<div><b>${esc(x[0])}</b><small>${esc(x[1])}</small></div>`).join('')}</div></div>`; }
function maybeDaily(){ const key=`lexora-boost-${state.mode}-${new Date().toDateString()}`; if(!localStorage.getItem(key)){ openDaily(); localStorage.setItem(key,'1'); } }
function openDaily(){ renderDailyPreview(); $('#dailyTitle').textContent=cfg().dailyTitle; $('#startDailyPractice').textContent=isEnglish()?'Practice English Today':isMandarin()?'Practice Mandarin Today':isJapanese()?'Practice Japanese Today':'Practice German Today'; $('#dailyModal').classList.add('show'); }
function closeDaily(){ $('#dailyModal')?.classList.remove('show'); }

function openFlashcards(onlyHard=false){ const list=onlyHard?vocabData().filter(w=>progress.hard[w.id]):filteredVocab(); state.flashWords=list.slice(0,300); state.flashIndex=0; state.flashBack=false; if(!state.flashWords.length) return toast(onlyHard?'Belum ada hard words':'Tidak ada kata untuk review'); $('#flashModeLabel').textContent=onlyHard?'Hard Words':`${cfg().lang} Review`; $('#flashcardModal').classList.add('show'); renderFlashcard(); }
function closeFlashcards(){ $('#flashcardModal')?.classList.remove('show'); }
function currentFlash(){ return state.flashWords[state.flashIndex%state.flashWords.length]; }
function renderFlashcard(){ const w=currentFlash(); if(!w) return; $('#flashTitle').textContent=`${state.flashIndex+1}/${state.flashWords.length}`; if(isEnglish()) $('#flashcardBox').textContent=state.flashBack?`${w.word}\n\n${w.meaning||''}\n${w.definition||''}\nExample: ${w.example||'-'}`:w.word; else if(isMandarin()) $('#flashcardBox').textContent=state.flashBack?`${w.hanzi}\n${w.pinyin||''}\n${w.meaning||w.english||''}\nExample: ${w.example||'-'}`:w.hanzi; else if(isJapanese()) $('#flashcardBox').textContent=state.flashBack?`${w.kanji||w.kana}\n${w.kana||''} · ${w.romaji||''}\n${w.meaning||''}\nExample: ${w.example||'-'}`:(w.kanji||w.kana); else $('#flashcardBox').textContent=state.flashBack?`${w.word}\n${w.meaning||''}\nBeispiel: ${w.example||'-'}\n${w.level||''}`:w.word; }
function flipCard(){ state.flashBack=!state.flashBack; renderFlashcard(); }
function reviewCard(level){ const w=currentFlash(); if(!w) return; if(level==='hard'||level==='again') progress.hard[w.id]=Date.now(); if(level==='good'||level==='easy') progress.learned[w.id]=Date.now(); save(); state.flashIndex++; state.flashBack=false; if(state.flashIndex>=state.flashWords.length){ toast('Review selesai'); closeFlashcards(); renderAll(); return; } renderFlashcard(); renderAll(); }

function openRouterSystemPrompt(){ if(isMandarin()) return 'Kamu adalah tutor HSK Mandarin untuk pelajar Indonesia. Jawab dalam bahasa Indonesia yang singkat, jelas, ramah, dan terstruktur. Fokus pada hanzi, pinyin, grammar, nada Mandarin 1-4, contoh kalimat benar, kesalahan utama, dan latihan berikutnya.'; if(isJapanese()) return 'Kamu adalah tutor JLPT bahasa Jepang untuk pelajar Indonesia. Jawab dalam bahasa Indonesia yang singkat, jelas, ramah, dan terstruktur. Fokus pada kanji, kana, romaji, partikel, grammar JLPT, natural expression, kesalahan utama, dan latihan berikutnya.'; if(isGerman()) return 'Kamu adalah tutor bahasa Jerman CEFR A1-C2 untuk pelajar Indonesia. Jawab singkat, jelas, ramah, dan terstruktur. Fokus pada Wortstellung, Verbposition, kasus, artikel, kosakata, register, pronunciation tips, corrected German examples, dan level CEFR.'; return 'Kamu adalah tutor IELTS English untuk pelajar Indonesia. Jawab dalam bahasa Indonesia yang singkat, jelas, ramah, dan terstruktur. Fokus pada grammar, vocabulary upgrade, coherence, pronunciation tips, kesalahan utama, dan contoh jawaban yang lebih baik.'; }
function extractOpenRouterText(data){ const content=data?.choices?.[0]?.message?.content; if(typeof content==='string') return content; if(Array.isArray(content)) return content.map(part=>typeof part==='string'?part:(part?.text||part?.content||'')).filter(Boolean).join('\n'); return ''; }
function friendlyOpenRouterError(status,data){ const raw=String(data?.error?.message||data?.error||data?.message||'').toLowerCase(); if(status===401||raw.includes('invalid api key')||raw.includes('authentication')) return 'OpenRouter API key salah atau sudah tidak aktif. Buat key baru lalu isi di index.html.'; if(status===402||raw.includes('insufficient credit')||raw.includes('credits')) return 'Saldo model berbayar tidak cukup. Lexora akan mencoba model gratis; jika tetap gagal, coba lagi nanti.'; if(status===403) return 'OpenRouter menolak akses. Periksa key, limit, atau pengaturan akun.'; if(status===404||raw.includes('model')&&raw.includes('not found')) return 'Model OpenRouter tidak tersedia. Gunakan openrouter/free atau pilih model lain.'; if(status===429||raw.includes('rate limit')||raw.includes('too many')) return 'Model gratis sedang ramai atau terkena rate limit. Tunggu sebentar lalu coba lagi.'; if(status>=500) return 'Server model AI sedang bermasalah. Coba lagi beberapa saat.'; return data?.error?.message||'AI Feedback gagal. Periksa koneksi, API key, dan model OpenRouter.'; }
function openRouterModelCandidates(){ const preferred=String(window.LEXORA_OPENROUTER_MODEL||'').trim(); return [...new Set([preferred,'openrouter/free'].filter(Boolean))]; }
function openRouterHeaders(key){ const headers={'Authorization':`Bearer ${key}`,'Content-Type':'application/json','X-OpenRouter-Title':String(window.LEXORA_OPENROUTER_APP_NAME||'Lexora Academy')}; const origin=window.location?.origin||''; if(/^https?:\/\//i.test(origin)) headers['HTTP-Referer']=origin; return headers; }
async function callOpenRouterChat(key,model,prompt){ const res=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:openRouterHeaders(key),body:JSON.stringify({model,messages:[{role:'system',content:openRouterSystemPrompt()},{role:'user',content:prompt}],temperature:.35,max_tokens:1200})}); const data=await res.json().catch(()=>({})); if(!res.ok) throw new Error(friendlyOpenRouterError(res.status,data)); const text=extractOpenRouterText(data).trim(); if(!text) throw new Error('OpenRouter tidak mengirim jawaban. Coba lagi atau pilih model lain.'); return text; }
async function callAI(prompt){ const key=String(window.LEXORA_OPENROUTER_API_KEY||'').trim(); if(!key||key.includes('PASTE_')) throw new Error('AI Feedback belum aktif. Isi OpenRouter API key di index.html.'); let last=null; for(const model of openRouterModelCandidates()){ try{return await callOpenRouterChat(key,model,prompt);}catch(e){last=e;} } throw last||new Error('AI Feedback gagal.'); }
async function aiExplainWord(w){ const prompt=isEnglish()?`Use clean Markdown only, no HTML tags and do not use tables. Use short headings and bullet points. Explain this IELTS English vocabulary in Indonesian: ${JSON.stringify(w)}. Include meaning, example, synonym, common mistake, and one practice question.`:isMandarin()?`Use clean Markdown only, no HTML tags and do not use tables. Use short headings and bullet points. Explain this HSK Mandarin vocabulary in Indonesian: ${JSON.stringify(w)}. Include meaning, pinyin, tone note, examples, grammar note, common mistake, and one practice question.`:isJapanese()?`Use clean Markdown only, no HTML tags and do not use tables. Use short headings and bullet points. Explain this JLPT Japanese vocabulary in Indonesian: ${JSON.stringify(w)}. Include kanji, kana, romaji, meaning, example, particle/grammar note, common mistake, and one practice question.`:`Use clean Markdown only, no HTML tags and do not use tables. Use short headings and bullet points. Explain this German CEFR vocabulary in Indonesian: ${JSON.stringify(w)}. Include meaning, pronunciation tip, example, article/case or verb-position note where relevant, common mistake, CEFR level, and one practice question.`; const grid=$('#vocabDetail .info-grid'); const node=document.createElement('div'); node.className='ai-output'; node.innerHTML='<b>Penjelasan AI</b><p>Sedang menyiapkan arti dan contoh…</p>'; grid.appendChild(node); if(innerWidth<=760) requestAnimationFrame(()=>node.scrollIntoView({behavior:'smooth',block:'nearest'})); try{ node.innerHTML='<b>Explanation</b>'+markdownToSafeHtml(await callAI(prompt)); }catch(e){ node.innerHTML=`<b>Feedback</b><p>${esc(e.message)}</p>`; } }
async function aiCheckModule(m){ const prompt=isEnglish()?`Use clean Markdown only, no HTML tags. You are an IELTS tutor. Explain this module in Indonesian. Module: ${m.title}. Questions: ${JSON.stringify(m.questions||[])}.`:isMandarin()?`Use clean Markdown only, no HTML tags. You are an HSK Mandarin tutor. Explain this module in Indonesian. Module: ${m.title}. Questions: ${JSON.stringify(m.questions||[])}.`:isJapanese()?`Use clean Markdown only, no HTML tags. You are a JLPT Japanese tutor. Explain this module in Indonesian. Module: ${m.title}. Questions: ${JSON.stringify(m.questions||[])}.`:`Use clean Markdown only, no HTML tags. You are a German CEFR tutor. Explain this module in Indonesian. Focus on word order, verb position, cases/articles, vocabulary, and why the correct answers fit the CEFR level. Module: ${m.title}. Questions: ${JSON.stringify(m.questions||[])}.`; setResultText('#moduleResult','AI sedang memeriksa...'); try{setResultMarkdown('#moduleResult',await callAI(prompt));}catch(e){setResultText('#moduleResult',e.message);} }

function openBugModal(){
  const modal=$('#bugModal');
  if(!modal) return toast('Form laporan belum tersedia');
  const result=$('#bugResult'); if(result){ result.textContent=''; result.className='result-box'; }
  renderBugImagePreview();
  modal.classList.add('show');
  setTimeout(()=>$('#bugTitle')?.focus(),80);
}
function closeBugModal(){ $('#bugModal')?.classList.remove('show'); }
function bugBackend(){
  const bridge=window.LexoraBackend;
  return {client:bridge?.getClient?.()||null,user:bridge?.getUser?.()||null};
}
function safeUploadName(name='image.jpg'){
  const parts=String(name).split('.');
  const ext=(parts.pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
  const base=parts.join('.').toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'screenshot';
  return `${base}.${ext}`;
}
function renderBugImagePreview(){
  const box=$('#bugImagePreview'); const input=$('#bugImage'); if(!box) return;
  box.innerHTML='';
  const file=input?.files?.[0]; if(!file) return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)){ input.value=''; box.innerHTML='<p class="error-text">Format gambar harus PNG, JPG, atau WEBP.</p>'; return; }
  if(file.size>5*1024*1024){ input.value=''; box.innerHTML='<p class="error-text">Ukuran gambar maksimal 5 MB.</p>'; return; }
  const url=URL.createObjectURL(file);
  box.innerHTML=`<div class="bug-preview-card"><img src="${url}" alt="Preview screenshot"><div><b>${esc(file.name)}</b><small>${Math.ceil(file.size/1024)} KB</small></div><button type="button" id="removeBugImage">Hapus</button></div>`;
  $('#removeBugImage')?.addEventListener('click',()=>{ input.value=''; URL.revokeObjectURL(url); renderBugImagePreview(); });
}
function buildBugPayload(){
  return {
    type:$('#bugType')?.value||'Lainnya',
    title:($('#bugTitle')?.value||'').trim(),
    message:($('#bugMessage')?.value||'').trim(),
    contact:($('#bugContact')?.value||'').trim(),
    page:state.page||'dashboard',
    mode:state.mode||'english',
    device:`${window.innerWidth}x${window.innerHeight}`,
    url:location.href,
    user_agent:navigator.userAgent
  };
}
async function submitBugReport(e){
  e.preventDefault();
  const result=$('#bugResult'); const btn=$('#bugForm button[type="submit"]');
  const payload=buildBugPayload(); const file=$('#bugImage')?.files?.[0]||null;
  const {client,user}=bugBackend();
  if(!payload.title||!payload.message){ result.textContent='Isi judul dan detail laporan dulu ya.'; return; }
  if(!client||!user){ result.textContent='Masuk ke akun Lexora dulu agar laporan bisa dikirim.'; return; }
  if(file&&!['image/png','image/jpeg','image/webp'].includes(file.type)){ result.textContent='Format gambar harus PNG, JPG, atau WEBP.'; return; }
  if(file&&file.size>5*1024*1024){ result.textContent='Ukuran gambar maksimal 5 MB.'; return; }
  btn.disabled=true; btn.textContent='Mengirim...'; result.textContent='';
  let imagePath=null;
  try{
    if(file){
      imagePath=`${user.id}/${Date.now()}-${safeUploadName(file.name)}`;
      const {error:uploadError}=await client.storage.from('lexora-bug-reports').upload(imagePath,file,{upsert:false,contentType:file.type,cacheControl:'3600'});
      if(uploadError) throw uploadError;
    }
    const {error}=await client.from('lexora_bug_reports').insert({user_id:user.id,...payload,image_path:imagePath,status:'new'});
    if(error) throw error;
    result.textContent='Terima kasih! Laporanmu sudah masuk dan akan kami periksa.';
    result.className='result-box success';
    $('#bugForm').reset(); renderBugImagePreview();
    setTimeout(closeBugModal,1500);
  }catch(err){
    if(imagePath) await client.storage.from('lexora-bug-reports').remove([imagePath]).catch(()=>{});
    console.warn('Lexora bug report error:',err);
    result.textContent='Laporan belum berhasil dikirim. Coba lagi sebentar ya.';
    result.className='result-box error';
  }finally{ btn.disabled=false; btn.textContent='Kirim Bug'; }
}


function allVocabularyRecords(){ return [...(state.data.ielts||[]),...(state.data.hsk||[]),...(state.data.jlpt||[]),...(state.data.german||[])]; }
function wordModeById(id=''){ return id.startsWith('hsk-')||id.startsWith('zh-')?'mandarin':id.startsWith('jlpt-')||id.startsWith('ja-')||id.startsWith('jp-')?'japanese':id.startsWith('goethe-')||id.startsWith('de-')?'german':'english'; }
function cloudSavedWordRows(){
  const byId=new Map(allVocabularyRecords().map(w=>[w.id,w]));
  return Object.keys(progress.saved||{}).filter(id=>progress.saved[id]).map(id=>{
    const w=byId.get(id)||{};
    const title=w.word||w.hanzi||w.kanji||w.kana||id;
    const sub=w.pinyin||w.kana||w.romaji||w.meaning||w.english||'';
    return {word_id:id,mode:wordModeById(id),word_text:title,word_sub:sub,saved_at:new Date(Number(progress.saved[id])||Date.now()).toISOString()};
  });
}
function cloudAchievementRows(){
  return ACHIEVEMENT_DEFS.filter(a=>achievements.unlocked[a.id]).map(a=>({achievement_id:a.id,title:a.title,icon:a.icon,unlocked_at:new Date(Number(achievements.unlocked[a.id])||Date.now()).toISOString()}));
}

window.LexoraSync = {
  waitUntilReady:()=>appReadyPromise,
  getData:()=>({progress, achievements, lastMode:state.mode}),
  getCloudRecords:()=>({savedWords:cloudSavedWordRows(), achievements:cloudAchievementRows()}),
  setSavedWritings:(rows=[])=>{ savedWritings=Array.isArray(rows)?rows:[]; renderProgress(); },
  applyData:(payload={})=>{
    progress=normalizeProgress(payload.progress||{});
    achievements=normalizeAchievements(payload.achievements||{});
    const target=MODE_ORDER.includes(payload.lastMode)?payload.lastMode:'english';
    localStorage.setItem('lexora-split-progress',JSON.stringify(progress));
    localStorage.setItem('lexora-achievements',JSON.stringify(achievements));
    ensureModeData(target).then(()=>{
      state.mode=target;
      checkAchievements(); applyMode(); renderAll();
    }).catch(console.error);
  },
  resetForUser:()=>{ progress=normalizeProgress(); achievements=normalizeAchievements(); state.mode='english'; ensureModeData('english').then(()=>{applyMode();renderAll()}); }
};

window.LexoraApp={
  getMode:()=>state.mode,
  getPage:()=>state.page,
  showPage,
  selectLanguage:selectLanguageMode,
  ensureModeData,
  isReady:()=>state.appReady
};
window.showPage=showPage;

boot();
