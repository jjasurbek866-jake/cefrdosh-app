// Telegram Web App init
const tg = window.Telegram.WebApp;
tg.expand();

// Foydalanuvchi ma'lumotlari va ilova holati (State)
let state = {
  user: null,
  xp: 0,
  streak: 1,
  currentWordIndex: 0,
  words: [
    { word: "Apple", translation: "Olma", example: "I eat a fresh apple.", level: "A1" },
    { word: "Book", translation: "Kitob", example: "She is reading a book.", level: "A1" },
    { word: "Water", translation: "Suv", example: "Please give me water.", level: "A1" },
    { word: "Friend", translation: "Do'st", example: "He is my best friend.", level: "A1" }
  ]
};

// Sahifa yuklanganda foydalanuvchini sozlash
document.addEventListener("DOMContentLoaded", () => {
  const user = tg.initDataUnsafe?.user;
  if (user) {
    state.user = user;
    document.getElementById("user-name").innerText = user.first_name || "Foydalanuvchi";
    document.getElementById("user-avatar").innerText = (user.first_name || "F")[0].toUpperCase();
  }
});

// Bo'limlarni dinamik ochish
function openModule(moduleType) {
  const contentArea = document.getElementById("content-area");
  const moduleTitle = document.getElementById("module-title");
  const moduleBody = document.getElementById("module-body");

  contentArea.classList.remove("hidden");

  if (moduleType === "vocabulary") {
    moduleTitle.innerText = "📚 So'z boyligi (Flashcard)";
    renderFlashcard(moduleBody);
  } else if (moduleType === "pronunciation") {
    moduleTitle.innerText = "🎙️ AI Talaffuz Tekshiruvi";
    moduleBody.innerHTML = `
      <div class="text-center space-y-3 py-4">
        <p class="font-bold text-gray-800 text-lg">"Accomplish"</p>
        <p class="text-xs text-gray-500">Mikrofonni bosib so'zni talaffuz qiling</p>
        <button onclick="startVoiceRecognition()" class="w-16 h-16 rounded-full bg-purple-500 text-white text-2xl flex items-center justify-center mx-auto shadow-lg hover:bg-purple-600 transition active:scale-95">
          <i class="fa-solid fa-microphone"></i>
        </button>
      </div>
    `;
  } else if (moduleType === "aichat") {
    moduleTitle.innerText = "🤖 AI Chat Partner";
    moduleBody.innerHTML = `
      <div class="space-y-3">
        <div id="chat-box" class="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 max-h-48 overflow-y-auto space-y-2">
          <p class="bg-amber-100 p-2 rounded-lg w-fit"><strong>AI:</strong> Hello! Let's practice English today. How are you?</p>
        </div>
        <div class="flex gap-2">
          <input id="chat-input" type="text" placeholder="Javobingizni yozing..." class="flex-1 p-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-500">
          <button onclick="sendMessage()" class="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold active:scale-95">Yuborish</button>
        </div>
      </div>
    `;
  } else {
    moduleTitle.innerText = "📘 Grammatika";
    moduleBody.innerHTML = `
      <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
        <h4 class="font-bold text-blue-900 text-xs">1-Dars: To Be fe'li</h4>
        <p class="text-xs text-blue-700">Present Simple zamonida am, is, are qo'llanilishi.</p>
      </div>
    `;
  }
}

// Flashcard so'zlarini interaktiv ko'rsatish
function renderFlashcard(container) {
  const current = state.words[state.currentWordIndex];
  if (!current) {
    container.innerHTML = `
      <div class="text-center py-6 space-y-2">
        <h3 class="font-bold text-emerald-600 text-lg">Barcha so'zlar takrorlandi! 🎉</h3>
        <button onclick="state.currentWordIndex=0; openModule('vocabulary');" class="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-xs">Qayta boshlash</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      <div id="card" onclick="this.classList.toggle('flipped')" class="bg-gradient-to-br from-amber-50 to-amber-100/60 p-6 rounded-2xl border border-amber-200 text-center cursor-pointer transition-all duration-300">
        <span class="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded">CEFR ${current.level}</span>
        <h2 class="text-3xl font-extrabold text-gray-900 mt-2">${current.word}</h2>
        <p class="text-xs text-gray-500 italic mt-1 font-serif">"${current.example}"</p>
        <p class="text-xs text-amber-600 font-semibold mt-4">👉 Bosing: Tarjimasini ko'rish</p>
        <p class="hidden text-xl font-bold text-amber-900 mt-2 pt-2 border-t border-amber-200" id="translation">${current.translation}</p>
      </div>

      <div class="flex gap-2">
        <button onclick="nextWord(false)" class="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200 active:scale-95">Qiyin</button>
        <button onclick="nextWord(true)" class="flex-1 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-amber-600 active:scale-95">Bilaman (+10 XP)</button>
      </div>
    </div>
  `;
}

// Keyingi so'zga o'tish va XP qo'shish
function nextWord(isKnown) {
  if (isKnown) {
    state.xp += 10;
    const gemsEl = document.getElementById("user-gems");
    if (gemsEl) gemsEl.innerText = state.xp;
  }
  state.currentWordIndex++;
  openModule("vocabulary");
}

// AI Chat xabar yuborish
function sendMessage() {
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  if (!input.value.trim()) return;

  const userMsg = `<p class="bg-white p-2 rounded-lg w-fit ml-auto border text-right"><strong>Siz:</strong> ${input.value}</p>`;
  chatBox.innerHTML += userMsg;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}