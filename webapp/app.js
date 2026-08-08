const tg = window.Telegram.WebApp;
tg.expand();

// Asosiy so'zlar bazasi
let originalWords = [
  { word: "agree", pos: "verb", translation: "rozi bo'lmoq", exampleEN: "I agree with you.", exampleUZ: "Men siz bilan roziman." },
  { word: "reply", pos: "verb", translation: "javob bermoq", exampleEN: "She asked him what time his meeting was. He replied, \"at three.\"", exampleUZ: "U yig'ilishi soat nechada ekanini so'radi. U \"soat uchda\" deb javob berdi." },
  { word: "afraid", pos: "adj", translation: "qo'rqqan", exampleEN: "She is afraid of dark.", exampleUZ: "U qorong'idan qo'rqadi." },
  { word: "opportunity", pos: "noun", translation: "imkoniyat", exampleEN: "This is a great opportunity.", exampleUZ: "Bu ajoyib imkoniyat." },
  { word: "achieve", pos: "verb", translation: "erishmoq", exampleEN: "You can achieve your goals.", exampleUZ: "Siz o'z maqsadlaringizga erisha olasiz." }
];

let sessionQueue = [...originalWords];
let retryQueue = [];
let currentIndex = 0;
let totalCardsCount = originalWords.length;
let isTranslationShown = false;

document.addEventListener("DOMContentLoaded", () => {
  loadCard();
});

function loadCard() {
  if (currentIndex >= sessionQueue.length) {
    if (retryQueue.length > 0) {
      // Bilmagan yoki qiyin deb topilgan so'zlarni qaytadan aylantiramiz
      sessionQueue = [...retryQueue];
      retryQueue = [];
      currentIndex = 0;
      totalCardsCount = sessionQueue.length;
    } else {
      showCompletionScreen();
      return;
    }
  }

  const current = sessionQueue[currentIndex];
  isTranslationShown = false;

  document.getElementById("card-word").innerText = current.word;
  document.getElementById("card-pos").innerText = current.pos;
  document.getElementById("card-translation").innerText = current.translation;
  document.getElementById("card-example").innerHTML = `"${current.exampleEN}"<br><span class="not-italic text-[#A39274]">${current.exampleUZ}</span>`;

  // Tarjimani yashirish
  document.getElementById("show-trans-btn").classList.remove("hidden");
  document.getElementById("translation-content").classList.add("hidden");

  // Progressni yangilash
  const progressPercent = Math.round(((currentIndex) / totalCardsCount) * 100);
  document.getElementById("progress-bar").style.width = `${Math.max(10, progressPercent)}%`;
  document.getElementById("progress-text").innerText = `${currentIndex + 1}/${totalCardsCount}`;
}

function revealTranslation() {
  isTranslationShown = true;
  document.getElementById("show-trans-btn").classList.add("hidden");
  document.getElementById("translation-content").classList.remove("hidden");
}

function answerCard(type) {
  const currentWord = sessionQueue[currentIndex];

  if (type === 'bilmadim' || type === 'qiyin') {
    // Agar buni bilmasa yoki qiyin desa, oxirida qayta so'rash uchun navbatga qo'shamiz
    if (!retryQueue.some(w => w.word === currentWord.word)) {
      retryQueue.push(currentWord);
    }
  } 
  // Agar 'oson' bo'lsa, hech qayerga qo'shilmaydi va o'tib ketadi.

  currentIndex++;
  loadCard();
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    loadCard();
  }
}

function showCompletionScreen() {
  document.querySelector("main").innerHTML = `
    <div class="card-base p-6 text-center space-y-4">
      <div class="w-16 h-16 bg-[#F5EBD7] text-[#D9A036] rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-inner">🎉</div>
      <h2 class="text-xl font-black text-[#382D1D]">Session Complete!</h2>
      <p class="text-xs text-[#8C7A5E]">Barcha so'zlar muvaffaqiyatli yakunlandi!</p>
      <button onclick="location.reload()" class="w-full py-3 bg-gradient-to-r from-[#D9A036] to-[#B87D1B] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition">Qayta boshlash</button>
    </div>
  `;
  document.getElementById("progress-bar").style.width = `100%`;
  document.getElementById("progress-text").innerText = `${totalCardsCount}/${totalCardsCount}`;
}

function playAudio() {
  const word = sessionQueue[currentIndex].word;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

function goBack() {
  history.back();
}

function goHome() {
  alert("Bosh sahifaga o'tish");
}