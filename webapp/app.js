const tg = window.Telegram.WebApp;
tg.expand();

let originalWords = [
  { word: "agree", pos: "verb", translation: "rozi bo'lmoq", example: "I agree with you." },
  { word: "reply", pos: "verb", translation: "javob bermoq", example: "She replied to my message." },
  { word: "afraid", pos: "adj", translation: "qo'rqqan", example: "He is afraid of heights." },
  { word: "opportunity", pos: "noun", translation: "imkoniyat", example: "A great opportunity." },
  { word: "achieve", pos: "verb", translation: "erishmoq", example: "Achieve your goals." }
];

let sessionQueue = [...originalWords];
let retryQueue = [];
let currentIndex = 0;

// Bosh sahifadan mashqqa o'tish
function startSession() {
  document.getElementById("home-view").classList.add("hidden");
  document.getElementById("quiz-view").classList.remove("hidden");
  document.getElementById("quiz-view").classList.add("flex");
  loadCard();
}

// Mashqdan Bosh sahifaga qaytish
function goHome() {
  document.getElementById("quiz-view").classList.add("hidden");
  document.getElementById("quiz-view").classList.remove("flex");
  document.getElementById("home-view").classList.remove("hidden");
}

function loadCard() {
  if (currentIndex >= sessionQueue.length) {
    if (retryQueue.length > 0) {
      sessionQueue = [...retryQueue];
      retryQueue = [];
      currentIndex = 0;
    } else {
      showCompletionScreen();
      return;
    }
  }

  const current = sessionQueue[currentIndex];
  document.getElementById("card-word").innerText = current.word;
  document.getElementById("card-pos").innerText = current.pos;
  document.getElementById("card-translation").innerText = current.translation;
  document.getElementById("card-example").innerText = `"${current.example}"`;

  document.getElementById("show-trans-btn").classList.remove("hidden");
  document.getElementById("translation-content").classList.add("hidden");

  const progressPercent = Math.round(((currentIndex) / sessionQueue.length) * 100);
  document.getElementById("progress-bar").style.width = `${Math.max(10, progressPercent)}%`;
  document.getElementById("progress-text").innerText = `${currentIndex + 1}/${sessionQueue.length}`;
}

function revealTranslation() {
  document.getElementById("show-trans-btn").classList.add("hidden");
  document.getElementById("translation-content").classList.remove("hidden");
}

function answerCard(type) {
  const currentWord = sessionQueue[currentIndex];

  if (type === 'bilmadim' || type === 'qiyin') {
    if (!retryQueue.some(w => w.word === currentWord.word)) {
      retryQueue.push(currentWord);
    }
  }

  currentIndex++;
  loadCard();
}

function showCompletionScreen() {
  document.querySelector("#quiz-view main").innerHTML = `
    <div class="py-8 space-y-4 text-center">
      <div class="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">🎉</div>
      <h2 class="text-xl font-black text-[#2D2318]">Barakalla!</h2>
      <p class="text-xs text-[#9C8B73]">Bugungi so'zlar muvaffaqiyatli yakunlandi.</p>
      <button onclick="goHome()" class="w-full py-3 bg-[#3D3023] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition">Bosh sahifaga qaytish</button>
    </div>
  `;
}

function playAudio() {
  const word = sessionQueue[currentIndex].word;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}