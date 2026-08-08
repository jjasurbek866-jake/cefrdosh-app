// Telegram Web App init
const tg = window.Telegram.WebApp;
tg.expand();

let state = {
  user: {
    name: tg.initDataUnsafe?.user?.last_name || "Jo'rayev",
    xp: 965,
    streak: 2,
    level: "A1"
  },
  currentWordIndex: 0,
  words: [
    { word: "Apple", translation: "Olma", example: "I eat a fresh apple every morning.", level: "A1" },
    { word: "Opportunity", translation: "Imkoniyat", example: "This is a great opportunity for you.", level: "A1" },
    { word: "Achieve", translation: "Erishmoq", example: "You can achieve your goals.", level: "A1" }
  ],
  quizzes: {
    grammar: [
      { question: "She ___ to the lyceum every morning.", options: ["go", "goes", "going"], correct: 1 },
      { question: "I ___ finished my homework.", options: ["have", "has", "am"], correct: 0 }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
});

function renderProfile() {
  document.getElementById("user-name").innerText = state.user.name;
  document.getElementById("user-avatar").innerText = state.user.name.charAt(0).toUpperCase();
  document.getElementById("user-streak").innerText = `${state.user.streak} kun`;
  document.getElementById("user-xp").innerText = `${state.user.xp} XP`;
  document.getElementById("user-level").innerText = `CEFR ${state.user.level}`;
}

function openModule(type) {
  const contentArea = document.getElementById("content-area");
  const moduleTitle = document.getElementById("module-title");
  const moduleBody = document.getElementById("module-body");

  contentArea.classList.remove("hidden");

  if (type === "vocabulary") {
    moduleTitle.innerText = "📚 So'z boyligi (Flashcards)";
    renderFlashcards(moduleBody);
  } 
  else if (type === "grammar") {
    moduleTitle.innerText = "📘 Grammatika Testlari";
    renderGrammarQuiz(moduleBody, 0);
  } 
  else if (type === "pronunciation") {
    moduleTitle.innerText = "🎙️ AI Talaffuz Tekshiruvi";
    moduleBody.innerHTML = `
      <div class="text-center py-6 space-y-4">
        <span class="text-xs text-purple-400 font-bold uppercase tracking-wider">Talaffuz qiling:</span>
        <h2 class="text-2xl font-black text-slate-100 tracking-wide">"Opportunity"</h2>
        <button onclick="simulateAudioCheck()" class="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30 transition">
          <i class="fa-solid fa-microphone"></i>
        </button>
        <p id="audio-status" class="text-xs text-slate-400">Tugmani bosib gapiring</p>
      </div>
    `;
  } 
  else if (type === "aichat") {
    moduleTitle.innerText = "🤖 AI Chat Partner";
    moduleBody.innerHTML = `
      <div class="space-y-3">
        <div id="chat-box" class="p-3 bg-slate-900/70 rounded-2xl border border-slate-700/60 h-40 overflow-y-auto space-y-2 text-xs">
          <p class="bg-slate-800 p-2.5 rounded-xl w-fit text-slate-200 border border-slate-700"><strong>AI:</strong> Hello Jasurbek! Let's practice English.</p>
        </div>
        <div class="flex gap-2">
          <input id="chat-input" type="text" placeholder="Inglizcha yozing..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
          <button onclick="sendChatMessage()" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition">Yuborish</button>
        </div>
      </div>
    `;
  }
  else if (type === "leaderboard") {
    moduleTitle.innerText = "🏆 Reyting";
    moduleBody.innerHTML = `
      <div class="space-y-2 text-xs">
        <div class="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span class="font-bold text-amber-400">1. ${state.user.name} (Siz)</span>
          <span class="font-extrabold text-slate-200">${state.user.xp} XP</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span class="font-bold text-slate-300">2. Sardor K.</span>
          <span class="font-extrabold text-slate-200">840 XP</span>
        </div>
      </div>
    `;
  }
  else if (type === "profile") {
    moduleTitle.innerText = "👤 Foydalanuvchi Profili";
    moduleBody.innerHTML = `
      <div class="space-y-3 text-xs text-slate-300">
        <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
          <p>Ism: <strong class="text-amber-400">${state.user.name}</strong></p>
          <p>Daraja: <strong class="text-amber-400">CEFR ${state.user.level}</strong></p>
          <p>Streak: <strong class="text-orange-400">${state.user.streak} kun</strong></p>
        </div>
      </div>
    `;
  }
}

function closeModule() {
  document.getElementById("content-area").classList.add("hidden");
}

function renderFlashcards(container) {
  const current = state.words[state.currentWordIndex];
  if (!current) {
    container.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <h3 class="font-black text-amber-400 text-sm">Barcha so'zlar takrorlandi! 🎉</h3>
        <button onclick="state.currentWordIndex=0; openModule('vocabulary');" class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs active:scale-95">Qayta boshlash</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="card-flip w-full h-48 cursor-pointer" onclick="flipCard(this)">
        <div class="card-inner relative w-full h-full">
          <div class="card-front bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
            <span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">CEFR ${current.level}</span>
            <h2 class="text-xl font-black text-slate-100 mt-2">${current.word}</h2>
            <p class="text-xs text-slate-400 italic mt-2">"${current.example}"</p>
          </div>
          <div class="card-back bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-lg">
            <span class="text-[10px] font-black uppercase tracking-wider text-amber-950">O'zbekcha tarjimasi</span>
            <h2 class="text-xl font-black text-slate-950 mt-1">${current.translation}</h2>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="nextCard(false)" class="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/20">Qiyin</button>
        <button onclick="nextCard(true)" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl">Bilaman (+10 XP)</button>
      </div>
    </div>
  `;
}

function flipCard(el) {
  el.querySelector(".card-inner").classList.toggle("flipped");
}

function nextCard(isKnown) {
  if (isKnown) {
    state.user.xp += 10;
    renderProfile();
  }
  state.currentWordIndex++;
  openModule("vocabulary");
}

function renderGrammarQuiz(container, index) {
  const quizzes = state.quizzes.grammar;
  if (index >= quizzes.length) {
    container.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <h3 class="font-black text-amber-400 text-sm">Grammatika testlari tugadi! 🎉</h3>
        <button onclick="openModule('grammar')" class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Qayta ishlash</button>
      </div>
    `;
    return;
  }
  const q = quizzes[index];
  container.innerHTML = `
    <div class="space-y-3 text-xs">
      <p class="font-bold text-slate-100">${q.question}</p>
      <div class="space-y-2">
        ${q.options.map((opt, i) => `
          <button onclick="checkGrammarAnswer(${index}, ${i})" class="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 font-medium text-slate-200 transition">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function checkGrammarAnswer(qIndex, selectedOpt) {
  const q = state.quizzes.grammar[qIndex];
  if (selectedOpt === q.correct) {
    state.user.xp += 15;
    renderProfile();
  }
  renderGrammarQuiz(document.getElementById("module-body"), qIndex + 1);
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  if (!input.value.trim()) return;

  chatBox.innerHTML += `<p class="bg-amber-500 text-slate-950 p-2 rounded-xl w-fit ml-auto font-semibold"><strong>Siz:</strong> ${input.value}</p>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    chatBox.innerHTML += `<p class="bg-slate-800 p-2 rounded-xl w-fit text-slate-200 border border-slate-700"><strong>AI:</strong> Excellent! Keep up the good work.</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
}

function simulateAudioCheck() {
  const status = document.getElementById("audio-status");
  status.innerText = "Tinglanmoqda...";
  status.className = "text-xs text-amber-400 animate-pulse";
  setTimeout(() => {
    status.innerText = "Ajoyib! Aniqlik: 98% 🔥 (+15 XP)";
    status.className = "text-xs text-emerald-400 font-bold";
    state.user.xp += 15;
    renderProfile();
  }, 2000);
}
