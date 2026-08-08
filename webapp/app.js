// Telegram Web App init
const tg = window.Telegram.WebApp;
tg.expand();

// Tizim holati (State)
let state = {
  user: {
    fullname: tg.initDataUnsafe?.user?.last_name || tg.initDataUnsafe?.user?.first_name || "Jo'rayev",
    cefr: "A1",
    level: 6,
    xp: 965,
    currentXp: 215,
    maxXp: 300,
    streak: 2,
    gems: 200
  },
  dailyGoal: {
    vocab: 0,
    grammar: 0,
    listen: 0,
    read: 0
  },
  // Testlar bazasi
  quizzes: {
    vocabulary: [
      {
        type: "mcq",
        question: "'Opportunity' so'zining o'zbekcha ma'nosini toping:",
        options: ["Imkoniyat", "Muammo", "Qaror", "Natija"],
        correct: 0,
        xpReward: 10
      },
      {
        type: "mcq",
        question: "'Acheive' so'zining to'g'ri yozilishini va ma'nosini belgilang:",
        options: ["Achieve - Erishmoq", "Acheeve - Bajarmoq", "Achieve - Yo'qotmoq", "Achiev - Boshlamoq"],
        correct: 0,
        xpReward: 10
      }
    ],
    grammar: [
      {
        question: "To'g'ri grammatik shaklni tanlang: 'She ___ to the lyceum every morning.'",
        options: ["go", "goes", "going", "gone"],
        correct: 1,
        xpReward: 15
      },
      {
        question: "Qaysi gap 'Present Perfect' zamonida yozilgan?",
        options: [
          "I play football yesterday.",
          "I am playing football now.",
          "I have finished my homework.",
          "I will finish my homework."
        ],
        correct: 2,
        xpReward: 15
      }
    ],
    listening: [
      {
        audioPrompt: "🔊 'Where is the nearest library?'",
        question: "Eshitilgan savol nimani so'ramoqda?",
        options: [
          "Eng yaqin kutubxona qayerda?",
          "Eng yaqin do'kon qachon ochiladi?",
          "Kutubxona kitoblari qancha turadi?",
          "Soat nechada kutubxonaga borasiz?"
        ],
        correct: 0,
        xpReward: 15
      }
    ],
    reading: [
      {
        text: "Jasur is a lyceum student from Tashkent. He loves programming in Python and dreams of studying abroad.",
        question: "Jasur qaysi dasturlash tilini yoqtiradi?",
        options: ["JavaScript", "Python", "C++", "Java"],
        correct: 1,
        xpReward: 15
      }
    ]
  }
};

// Dastur ishga tushganda UI ni sozlash
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  updateProgressUI();
});

function renderHeader() {
  if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById("user-fullname").innerText = user.last_name || user.first_name || "Jo'rayev";
    document.getElementById("user-avatar").innerText = (user.first_name || "J")[0].toUpperCase();
  }
  document.getElementById("user-streak").innerText = state.user.streak;
  document.getElementById("user-gems").innerText = state.user.gems;
}

function updateProgressUI() {
  document.getElementById("total-xp-text").innerText = `${state.user.xp} XP`;
  document.getElementById("xp-progress-text").innerText = `${state.user.currentXp} / ${state.user.maxXp} XP`;
  
  const percent = Math.min(100, Math.round((state.user.currentXp / state.user.maxXp) * 100));
  document.getElementById("xp-bar").style.width = `${percent}%`;

  // Kunlik maqsad foizi
  const totalGoalItems = 26; // 20 vocab + 2 grammar + 2 listen + 2 read
  const completedItems = state.dailyGoal.vocab + state.dailyGoal.grammar + state.dailyGoal.listen + state.dailyGoal.read;
  const goalPercent = Math.min(100, Math.round((completedItems / totalGoalItems) * 100));

  document.getElementById("goal-percent").innerText = `${goalPercent}%`;
  document.getElementById("goal-circle").setAttribute("stroke-dasharray", `${goalPercent}, 100`);

  document.getElementById("goal-vocab").innerText = `${state.dailyGoal.vocab}/20`;
  document.getElementById("goal-grammar").innerText = `${state.dailyGoal.grammar}/2`;
  document.getElementById("goal-listen").innerText = `${state.dailyGoal.listen}/2`;
  document.getElementById("goal-read").innerText = `${state.dailyGoal.read}/2`;
}

// Modullarni ishga tushirish (Test Modal)
function startModule(type) {
  const modal = document.getElementById("quiz-modal");
  const title = document.getElementById("quiz-modal-title");
  const body = document.getElementById("quiz-modal-body");

  modal.classList.remove("hidden");

  if (type === "vocabulary") {
    title.innerText = "📚 So'z Boyligi Testi";
    renderQuiz(type, 0);
  } else if (type === "grammar") {
    title.innerText = "📘 Grammatika Testi";
    renderQuiz(type, 0);
  } else if (type === "listening") {
    title.innerText = "🎧 Tinglash (Listening) Testi";
    renderQuiz(type, 0);
  } else if (type === "reading") {
    title.innerText = "📖 O'qish (Reading) Testi";
    renderQuiz(type, 0);
  }
}

// Quiz render qilish
function renderQuiz(type, index) {
  const body = document.getElementById("quiz-modal-body");
  const list = state.quizzes[type];

  if (!list || index >= list.length) {
    body.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <div class="w-12 h-12 bg-[#F5EBD7] text-[#D9A036] rounded-full flex items-center justify-center mx-auto text-xl font-black">🎉</div>
        <h4 class="font-extrabold text-[#382D1D] text-base">Bo'lim testlari yakunlandi!</h4>
        <p class="text-xs text-[#8C7A5E]">Ajoyib natija! Tajriba ballaringiz oshirildi.</p>
        <button onclick="closeQuizModal()" class="w-full py-2.5 bg-[#D9A036] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition">Davom etish</button>
      </div>
    `;
    return;
  }

  const q = list[index];

  let promptHtml = "";
  if (q.audioPrompt) {
    promptHtml = `
      <div class="p-3 bg-[#EBF5FC] rounded-xl border border-[#D3E8F8] flex items-center justify-between text-[#2563EB] font-bold text-xs mb-2">
        <span>${q.audioPrompt}</span>
        <i class="fa-solid fa-volume-high text-base cursor-pointer"></i>
      </div>
    `;
  } else if (q.text) {
    promptHtml = `
      <div class="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[#065F46] text-xs mb-2 italic">
        "${q.text}"
      </div>
    `;
  }

  let optionsHtml = q.options.map((opt, optIdx) => `
    <button onclick="checkAnswer('${type}', ${index}, ${optIdx})" class="w-full text-left p-3 rounded-xl border border-[#F0E6D2] bg-[#FAF5EB] hover:bg-[#F3E5C8] font-semibold text-xs text-[#382D1D] active:scale-98 transition flex justify-between items-center">
      <span>${opt}</span>
      <i class="fa-regular fa-circle text-[#A39274]"></i>
    </button>
  `).join('');

  body.innerHTML = `
    ${promptHtml}
    <p class="font-bold text-xs text-[#382D1D] leading-snug">${q.question}</p>
    <div class="space-y-2 pt-1">
      ${optionsHtml}
    </div>
  `;
}

// Javobni tekshirish
function checkAnswer(type, qIndex, selectedOpt) {
  const quiz = state.quizzes[type][qIndex];
  const isCorrect = selectedOpt === quiz.correct;

  if (isCorrect) {
    state.user.xp += quiz.xpReward;
    state.user.currentXp += quiz.xpReward;

    if (state.user.currentXp >= state.user.maxXp) {
      state.user.level += 1;
      state.user.currentXp -= state.user.maxXp;
      document.getElementById("level-title").innerText = `DARAJA ${state.user.level}`;
    }

    if (type === "vocabulary") state.dailyGoal.vocab = Math.min(20, state.dailyGoal.vocab + 1);
    if (type === "grammar") state.dailyGoal.grammar = Math.min(2, state.dailyGoal.grammar + 1);
    if (type === "listening") state.dailyGoal.listen = Math.min(2, state.dailyGoal.listen + 1);
    if (type === "reading") state.dailyGoal.read = Math.min(2, state.dailyGoal.read + 1);

    updateProgressUI();
  }

  // Keyingi savolga o'tish
  renderQuiz(type, qIndex + 1);
}

function closeQuizModal() {
  document.getElementById("quiz-modal").classList.add("hidden");
}

function showInfo(sectionName) {
  const modal = document.getElementById("quiz-modal");
  const title = document.getElementById("quiz-modal-title");
  const body = document.getElementById("quiz-modal-body");

  modal.classList.remove("hidden");
  title.innerText = sectionName;
  body.innerHTML = `
    <div class="text-center py-4 space-y-2">
      <p class="text-xs text-[#8C7A5E]"><b>${sectionName}</b> bo'limi tayyorlanmoqda.</p>
      <button onclick="closeQuizModal()" class="px-4 py-2 bg-[#D9A036] text-white font-bold text-xs rounded-xl">Yopish</button>
    </div>
  `;
}