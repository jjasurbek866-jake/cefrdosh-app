// Telegram WebApp kengaytirish
const tg = window.Telegram.WebApp;
tg.expand();

// Unitlar va ularning so'zlari bazasi
const unitsData = {
  1: {
    title: "Essential 1",
    words: [
      { word: "agree", pos: "verb", translation: "rozi bo'lmoq", exampleEN: "I agree with you.", exampleUZ: "Men siz bilan roziman." },
      { word: "reply", pos: "verb", translation: "javob bermoq", exampleEN: "She replied to my message.", exampleUZ: "U mening xabarimga javob berdi." },
      { word: "afraid", pos: "adj", translation: "qo'rqqan", exampleEN: "He is afraid of heights.", exampleUZ: "U balandlikdan qo'rqadi." },
      { word: "opportunity", pos: "noun", translation: "imkoniyat", exampleEN: "This is a great opportunity.", exampleUZ: "Bu ajoyib imkoniyat." },
      { word: "achieve", pos: "verb", translation: "erishmoq", exampleEN: "You can achieve your goals.", exampleUZ: "Siz o'z maqsadlaringizga erisha olasiz." }
    ]
  },
  2: {
    title: "Essential 2",
    words: [
      { word: "breathe", pos: "verb", translation: "nafas olmoq", exampleEN: "Breathe in slowly.", exampleUZ: "Sekin nafas oling." },
      { word: "determine", pos: "verb", translation: "aniqlamoq", exampleEN: "Determine the cause.", exampleUZ: "Sababini aniqlang." }
    ]
  }
};

let currentSessionWords = [];
let retryQueue = [];
let currentIndex = 0;
let totalCardsCount = 0;

// Modullarni ochish (Asosiy sahifadan)
window.openModule = function(moduleName) {
  const contentArea = document.getElementById("content-area");
  const moduleTitle = document.getElementById("module-title");
  const moduleBody = document.getElementById("module-body");

  if (!contentArea) return;
  contentArea.classList.remove("hidden");

  if (moduleName === 'vocabulary') {
    moduleTitle.innerText = "So'z boyligi — Unitlar";
    renderUnitsList(moduleBody);
  } else if (moduleName === 'grammar') {
    moduleTitle.innerText = "Grammatika";
    moduleBody.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">Grammatika bo'limi tez kunda qo'shiladi!</p>`;
  } else if (moduleName === 'pronunciation') {
    moduleTitle.innerText = "AI Talaffuz";
    moduleBody.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">Talaffuz tekshiruvi ishlab chiqilmoqda...</p>`;
  } else if (moduleName === 'aichat') {
    moduleTitle.innerText = "AI Suhbatdosh";
    moduleBody.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">Suhbatdoshingiz tez orada ishga tushadi!</p>`;
  } else if (moduleName === 'leaderboard') {
    contentArea.classList.add("hidden");
    alert("Reyting sahifasi");
  } else if (moduleName === 'profile') {
    contentArea.classList.add("hidden");
    alert("Profil sahifasi");
  }
};

window.closeModule = function() {
  const contentArea = document.getElementById("content-area");
  if (contentArea) {
    contentArea.classList.add("hidden");
  }
};

// Unitlar ro'yxatini chiqarish
function renderUnitsList(container) {
  let html = `<div class="space-y-2.5">`;
  
  for (let unitId in unitsData) {
    let unit = unitsData[unitId];
    html += `
      <div onclick="window.startUnitQuiz(${unitId})" class="bg-slate-900/60 hover:bg-slate-900 p-3.5 rounded-2xl border border-slate-700/60 flex items-center justify-between cursor-pointer active:scale-95 transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black text-sm">
            ${unitId}
          </div>
          <div>
            <h4 class="font-bold text-xs text-slate-100">${unit.title}</h4>
            <p class="text-[10px] text-slate-400">So'zlar soni: ${unit.words.length} ta</p>
          </div>
        </div>
        <div class="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
          Boshlash <i class="fa-solid fa-chevron-right text-[10px] ml-1"></i>
        </div>
      </div>
    `;
  }
  html += `</div>`;
  container.innerHTML = html;
}

// Tanlangan Unit so'zlarini boshlash
window.startUnitQuiz = function(unitId) {
  currentSessionWords = [...unitsData[unitId].words];
  retryQueue = [];
  currentIndex = 0;
  totalCardsCount = currentSessionWords.length;
  renderCardQuiz();
};

// So'z kartochkasi interfeysi
function renderCardQuiz() {
  const moduleBody = document.getElementById("module-body");
  const moduleTitle = document.getElementById("module-title");

  if (currentIndex >= currentSessionWords.length) {
    if (retryQueue.length > 0) {
      currentSessionWords = [...retryQueue];
      retryQueue = [];
      currentIndex = 0;
      totalCardsCount = currentSessionWords.length;
    } else {
      moduleTitle.innerText = "Natija";
      moduleBody.innerHTML = `
        <div class="text-center py-6 space-y-4">
          <div class="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">🎉</div>
          <h3 class="font-bold text-sm text-slate-100">Unit yakunlandi!</h3>
          <p class="text-xs text-slate-400">Barcha so'zlarni muvaffaqiyatli o'tdingiz.</p>
          <button onclick="window.openModule('vocabulary')" class="w-full py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md active:scale-95 transition">Unitlarga qaytish</button>
        </div>
      `;
      return;
    }
  }

  const current = currentSessionWords[currentIndex];
  moduleTitle.innerText = `Mashq: ${currentIndex + 1} / ${totalCardsCount}`;

  moduleBody.innerHTML = `
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-[10px] font-bold text-slate-400 uppercase">Kartochka</span>
        <button onclick="window.playAudio('${current.word}')" class="w-8 h-8 rounded-full bg-slate-700/60 text-amber-400 flex items-center justify-center text-xs active:scale-90 transition">
          <i class="fa-solid fa-volume-high"></i>
        </button>
      </div>

      <div class="text-center py-4 bg-slate-900/40 rounded-2xl border border-slate-700/40 space-y-1">
        <h3 class="text-2xl font-black text-slate-100 tracking-tight">${current.word}</h3>
        <p class="text-xs text-slate-400 italic">${current.pos}</p>
      </div>

      <div id="trans-box" class="text-center py-3">
        <button onclick="window.revealTranslation()" id="show-btn" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl transition mx-auto block">
          Tarjimani ko'rsatish
        </button>
        <div id="trans-content" class="hidden space-y-1.5 mt-2">
          <h4 class="text-base font-extrabold text-amber-400">${current.translation}</h4>
          <p class="text-[11px] text-slate-300 italic">"${current.exampleEN}"<br><span class="text-slate-400">${current.exampleUZ}</span></p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 pt-2">
        <button onclick="window.handleAnswer('bilmadim')" class="py-2.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 font-bold text-xs rounded-xl active:scale-95 transition">
          Bilmadim
        </button>
        <button onclick="window.handleAnswer('qiyin')" class="py-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 font-bold text-xs rounded-xl active:scale-95 transition">
          Qiyin
        </button>
        <button onclick="window.handleAnswer('oson')" class="py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold text-xs rounded-xl active:scale-95 transition">
          Oson
        </button>
      </div>
    </div>
  `;
}

window.revealTranslation = function() {
  const btn = document.getElementById("show-btn");
  const content = document.getElementById("trans-content");
  if (btn && content) {
    btn.classList.add("hidden");
    content.classList.remove("hidden");
  }
};

window.handleAnswer = function(type) {
  const currentWord = currentSessionWords[currentIndex];

  if (type === 'bilmadim' || type === 'qiyin') {
    if (!retryQueue.some(w => w.word === currentWord.word)) {
      retryQueue.push(currentWord);
    }
  }

  currentIndex++;
  renderCardQuiz();
};

window.playAudio = function(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
};
