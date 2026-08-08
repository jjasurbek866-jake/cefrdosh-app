// Telegram Web App init
const tg = window.Telegram.WebApp;
tg.expand();

// Asosiy ma'lumotlar holati
let state = {
  user: {
    telegram_id: tg.initDataUnsafe?.user?.id || 123456,
    first_name: tg.initDataUnsafe?.user?.first_name || "O'quvchi",
    xp: 0,
    streak: 1,
    level: "A1"
  },
  currentWordIndex: 0,
  words: [
    { word: "Apple", translation: "Olma", example: "I eat a fresh apple every morning.", level: "A1" },
    { word: "Book", translation: "Kitob", example: "She is reading an interesting book.", level: "A1" },
    { word: "Water", translation: "Suv", example: "Please give me a glass of water.", level: "A1" },
    { word: "Friend", translation: "Do'st", example: "He is my best friend in town.", level: "A1" },
    { word: "Family", translation: "Oila", example: "I love spending time with my family.", level: "A1" }
  ]
};

// Sahifa yuklanganda ishga tushish
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
});

// Profile ma'lumotlarini ekranga chiqarish
function renderProfile() {
  document.getElementById("user-name").innerText = state.user.first_name;
  document.getElementById("user-avatar").innerText = state.user.first_name.charAt(0).toUpperCase();
  document.getElementById("user-streak").innerText = `${state.user.streak} kun`;
  document.getElementById("user-xp").innerText = `${state.user.xp} XP`;
  document.getElementById("user-level").innerText = `CEFR ${state.user.level}`;
}

// Modullarni ochish
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
    moduleTitle.innerText = "📘 Grammatika Darslari";
    moduleBody.innerHTML = `
      <div class="space-y-3">
        <div class="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-700/60">
          <div class="flex justify-between items-center mb-1">
            <h4 class="font-bold text-sm text-amber-400">1-Dars: Present Simple</h4>
            <span class="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold">A1</span>
          </div>
          <p class="text-xs text-slate-300">To be fe'li (am, is, are) va oddiy hozirgi zamon qoidalari.</p>
        </div>
      </div>
    `;
  } 
  else if (type === "pronunciation") {
    moduleTitle.innerText = "🎙️ AI Talaffuz Tekshiruvi";
    moduleBody.innerHTML = `
      <div class="text-center py-6 space-y-4">
        <span class="text-xs text-purple-400 font-bold uppercase tracking-wider">Talaffuz qiling:</span>
        <h2 class="text-2xl font-black text-slate-100 tracking-wide">"Accomplish"</h2>
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
          <p class="bg-slate-800 p-2.5 rounded-xl w-fit text-slate-200 border border-slate-700"><strong>AI:</strong> Hello! How are you today? Let's practice English!</p>
        </div>
        <div class="flex gap-2">
          <input id="chat-input" type="text" placeholder="Inglizcha yozing..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500">
          <button onclick="sendChatMessage()" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition">Yuborish</button>
        </div>
      </div>
    `;
  }
  else if (type === "leaderboard") {
    moduleTitle.innerText = "🏆 Top O'quvchilar";
    moduleBody.innerHTML = `
      <div class="space-y-2 text-xs">
        <div class="flex justify-between items-center p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span class="font-bold text-amber-400">1. Jasur M.</span>
          <span class="font-extrabold text-slate-200">450 XP</span>
        </div>
        <div class="flex justify-between items-center p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50">
          <span class="font-bold text-slate-300">2. Sardor K.</span>
          <span class="font-extrabold text-slate-200">320 XP</span>
        </div>
      </div>
    `;
  }
}

// Modulni yopish
function closeModule() {
  document.getElementById("content-area").classList.add("hidden");
}

// Flashcards interfeysini chiqarish
function renderFlashcards(container) {
  const current = state.words[state.currentWordIndex];

  if (!current) {
    container.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <h3 class="font-black text-amber-400 text-lg">Barcha so'zlar takrorlandi! 🎉</h3>
        <button onclick="state.currentWordIndex=0; openModule('vocabulary');" class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs active:scale-95">Qayta boshlash</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div class="card-flip w-full h-52 cursor-pointer" onclick="flipCard(this)">
        <div class="card-inner relative w-full h-full">
          <div class="card-front bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
            <span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md uppercase">CEFR ${current.level}</span>
            <h2 class="text-2xl font-black text-slate-100 mt-2">${current.word}</h2>
            <p class="text-xs text-slate-400 italic mt-2">"${current.example}"</p>
            <span class="text-[10px] text-slate-500 mt-4"><i class="fa-solid fa-rotate mr-1"></i> Bosing - Tarjimasi</span>
          </div>
          <div class="card-back bg-gradient-to-br from-amber-600 to-amber-700 text-slate-950 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg">
            <span class="text-[10px] font-black uppercase tracking-wider text-amber-200">O'zbekcha</span>
            <h2 class="text-2xl font-black text-slate-950 mt-1">${current.translation}</h2>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick="nextCard(false)" class="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/20 active:scale-95 transition">Qiyin</button>
        <button onclick="nextCard(true)" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition">Bilaman (+10 XP)</button>
      </div>
    </div>
  `;
}

// Card o'girish
function flipCard(el) {
  const inner = el.querySelector(".card-inner");
  inner.classList.toggle("flipped");
}

// Keyingi so'zga o'tish
function nextCard(isKnown) {
  if (isKnown) {
    state.user.xp += 10;
    renderProfile();
  }
  state.currentWordIndex++;
  openModule("vocabulary");
}

// AI Chat xabar yuborish
function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  if (!input.value.trim()) return;

  const userMsg = input.value;
  chatBox.innerHTML += `<p class="bg-amber-500 text-slate-950 p-2.5 rounded-xl w-fit ml-auto font-semibold"><strong>Siz:</strong> ${userMsg}</p>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    chatBox.innerHTML += `<p class="bg-slate-800 p-2.5 rounded-xl w-fit text-slate-200 border border-slate-700"><strong>AI:</strong> Great job! Keep practicing everyday!</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
}

// AI Talaffuz simulyatsiyasi
function simulateAudioCheck() {
  const status = document.getElementById("audio-status");
  status.innerText = "Tinglanmoqda...";
  status.className = "text-xs text-amber-400 animate-pulse";

  setTimeout(() => {
    status.innerText = "Ajoyib! Talaffuz aniqligi: 95% 🔥 (+15 XP)";
    status.className = "text-xs text-emerald-400 font-bold";
    state.user.xp += 15;
    renderProfile();
  }, 2000);
}