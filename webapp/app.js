// Telegram Web App init
const tg = window.Telegram.WebApp;
tg.expand(); // Ekran bo'ylab yoyish

// Foydalanuvchi ma'lumotlarini yuklash
document.addEventListener("DOMContentLoaded", () => {
  const user = tg.initDataUnsafe?.user;
  
  if (user) {
    document.getElementById("user-name").innerText = user.first_name || "Foydalanuvchi";
    document.getElementById("user-avatar").innerText = (user.first_name || "F")[0].toUpperCase();
  }
});

// Bo'limlarni dinamik ochish funksiyasi
function openModule(moduleType) {
  const contentArea = document.getElementById("content-area");
  const moduleTitle = document.getElementById("module-title");
  const moduleBody = document.getElementById("module-body");

  contentArea.classList.remove("hidden");

  if (moduleType === "vocabulary") {
    moduleTitle.innerText = "📚 So'z boyligi (CEFR A1)";
    moduleBody.innerHTML = `
      <div class="space-y-2">
        <div class="p-3 bg-amber-50 rounded-xl flex justify-between items-center">
          <div>
            <p class="font-bold text-gray-900">Essential Words - Unit 1</p>
            <p class="text-xs text-gray-500">20 ta so'z • 100% o'zlashtirilgan</p>
          </div>
          <button class="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold text-xs">Boshlash</button>
        </div>
      </div>
    `;
  } else if (moduleType === "pronunciation") {
    moduleTitle.innerText = "🎙️ AI Talaffuz Tekshiruvi";
    moduleBody.innerHTML = `
      <div class="text-center space-y-3 py-4">
        <p class="font-bold text-gray-800 text-base">"Accomplish"</p>
        <p class="text-xs text-gray-500">Mikrofonni bosib so'zni talaffuz qiling</p>
        <button class="w-16 h-16 rounded-full bg-purple-500 text-white text-2xl flex items-center justify-center mx-auto shadow-lg hover:bg-purple-600">
          <i class="fa-solid fa-microphone"></i>
        </button>
      </div>
    `;
  } else if (moduleType === "aichat") {
    moduleTitle.innerText = "🤖 AI Chat Partner";
    moduleBody.innerHTML = `
      <div class="space-y-3">
        <div class="p-3 bg-gray-100 rounded-xl text-xs text-gray-700">
          <strong>AI:</strong> Hello! How was your day today? Let's practice English!
        </div>
        <div class="flex gap-2">
          <input type="text" placeholder="Javobingizni yozing..." class="flex-1 p-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-amber-500">
          <button class="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold">Yuborish</button>
        </div>
      </div>
    `;
  } else {
    moduleTitle.innerText = "📘 Grammatika";
    moduleBody.innerText = "Grammatika darslari va testlari tayyorlanmoqda...";
  }
}   