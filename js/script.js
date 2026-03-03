const dictionary = {
   "A great deal of": "a lot of",
   "Aware": "habardor",
   "Biodegradable": "tabiiy chiruvchi",
   "Bury": "ko'mish",
   "Cause": "sabab bo'lmoq",
   "Compete": "musobaqalashmoq",
   "Concern": "worry",
   "Conserve": "save",
   "Contain": "saqlamoq, o'z ichiga olmoq",
   "Decompose": "parchalanmoq",
   "Dig": "qazimoq",
   "Disaster": "falokat",
   "Dispose of": "tashlab yubormoq",
   "Ecology": "ekologiya",
   "Effluent": "mag'zava",
   "Energy": "electricity",
   "Environment": "atrof-muhit",
   "Get rid of": "dispose of",
   "Goods": "tovarlar",
   "Green": "tabiatga do'stona",
   "Green packaging": "yashil qadoqlash",
   "Industrial waste": "sanoat chiqindisi",
   "Issue": "problem",
   "Landfill site": "axlat ko'mish joyi",
   "Manufacture": "produce",
   "Manufacturer": "producer",
   "Marketing": "reklama",
   "Monitor": "kuzatmoq",
   "Nuclear": "yadroviy",
   "Nuclear waste": "yadroviy chiqindi",
   "Peeling": "po'choq",
   "Pollution": "ifloslanish",
   "Recyclable": "qayta ishlanadigan",
   "Supply": "manbaa",
   "Threat": "xavf",
   "Thus": "shuning uchun",
   "Urgent": "shoshilinch",
   "Vital": "important",
   "Waste": "axlat",
   "Waste disposal": "axlatni yo'q qilish",
   "Wrapper": "qadoq"
};

const words = Object.keys(dictionary);
const MIN_QUESTIONS = 10;

const startOverlay = document.getElementById("startOverlay");
const nameInput = document.getElementById("nameInput");
const countInput = document.getElementById("countInput");
const countHint = document.getElementById("countHint");
const startBtn = document.getElementById("startBtn");

const resultOverlay = document.getElementById("resultOverlay");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");
const closeResultBtn = document.getElementById("closeResultBtn");

const welcomeLine = document.getElementById("welcomeLine");
const elQuestion = document.getElementById("questionWord");
const elOptions = document.getElementById("options");
const elFeedback = document.getElementById("feedback");
const elScore = document.getElementById("score");
const elQNum = document.getElementById("qNum");
const elQTotal = document.getElementById("qTotal");
const elNext = document.getElementById("nextBtn");
const elReset = document.getElementById("resetBtn");
const elMeta = document.getElementById("meta");

elMeta.textContent = `Lug‘at so‘zlari: ${words.length} ta`;

let userName = "";
let totalQuestions = MIN_QUESTIONS;

let score = 0;
let questionCount = 0;
let current = null;
let answered = false;

let pool = [];

function shuffleCopy(arr) {
   const copy = [...arr];
   for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
   }
   return copy;
}

function initPool() {
   pool = shuffleCopy(words);
}

function setTotalQuestionsUI() {
   elQTotal.textContent = totalQuestions;
}

function updateCountHint() {
   countHint.textContent = `Min: ${MIN_QUESTIONS} ta, Max: ${words.length} ta`;
}

function getWrongOptions(correct) {
   const values = Object.values(dictionary);
   const wrong = new Set();
   while (wrong.size < 3) {
      const candidate = values[Math.floor(Math.random() * values.length)];
      if (candidate !== correct) wrong.add(candidate);
   }
   return [...wrong];
}

function disableAllOptions() {
   [...elOptions.querySelectorAll("button")].forEach(b => b.disabled = true);
}

function markCorrect() {
   [...elOptions.querySelectorAll("button")].forEach(b => {
      const text = b.querySelector("span").textContent;
      if (text === current.correct) {
         b.style.borderColor = "rgba(31,157,85,.9)";
         b.style.background = "rgba(31,157,85,.18)";
      }
   });
}

function generateQuestion() {
   answered = false;
   elFeedback.textContent = "";
   elFeedback.className = "feedback";
   elNext.disabled = true;

   const questionWord = pool[questionCount];
   const correct = dictionary[questionWord];

   const options = shuffleCopy([correct, ...getWrongOptions(correct)]);
   current = { questionWord, correct, options };

   questionCount += 1;
   elQNum.textContent = questionCount;

   renderQuestion();
}

function renderQuestion() {
   elQuestion.textContent = current.questionWord;
   elOptions.innerHTML = "";

   current.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "optionBtn";
      btn.innerHTML = `<span>${opt}</span><span class="tag">${idx + 1}</span>`;
      btn.addEventListener("click", () => choose(opt, btn));
      elOptions.appendChild(btn);
   });

   elScore.textContent = score;
}

function choose(selected, btn) {
   if (answered) return;
   answered = true;

   disableAllOptions();
   elNext.disabled = false;

   if (selected === current.correct) {
      score += 1;
      elScore.textContent = score;
      elFeedback.textContent = "✅ To‘g‘ri!";
      elFeedback.className = "feedback good";
      btn.style.borderColor = "rgba(31,157,85,.9)";
      btn.style.background = "rgba(31,157,85,.18)";
   } else {
      elFeedback.textContent = `❌ Noto‘g‘ri. To‘g‘ri javob: ${current.correct}`;
      elFeedback.className = "feedback bad";
      btn.style.borderColor = "rgba(224,58,58,.9)";
      btn.style.background = "rgba(224,58,58,.18)";
      markCorrect();
   }

   elNext.textContent = (questionCount >= totalQuestions) ? "Natijani ko‘rish" : "Next";
}

function showResult() {
   const percent = Math.round((score / totalQuestions) * 100);

   resultTitle.textContent = `Natija — ${userName}`;
   resultText.innerHTML = `
    Siz <b>${totalQuestions}</b> ta savoldan <b>${score}</b> tasini to‘g‘ri topdingiz.<br/>
    To‘g‘ri ishlangan foiz: <b>${percent}%</b>
  `;
   resultOverlay.classList.remove("hidden");
}

function resetQuiz(keepName = true) {
   score = 0;
   questionCount = 0;
   current = null;
   answered = false;

   elScore.textContent = "0";
   elQNum.textContent = "0";
   elQuestion.textContent = "—";
   elOptions.innerHTML = "";
   elFeedback.textContent = "";
   elFeedback.className = "feedback";
   elNext.disabled = true;
   elReset.disabled = true;
   elNext.textContent = "Next";

   initPool();

   if (!keepName) {
      userName = "";
      welcomeLine.textContent = "Ism: —";
   }
}

function startQuiz() {
   const name = nameInput.value.trim();
   userName = name ? name : "User";
   welcomeLine.textContent = `Ism: ${userName}`;

   const requested = Number(countInput.value);


   let n = Number.isFinite(requested) ? requested : MIN_QUESTIONS;

   if (n < MIN_QUESTIONS) n = MIN_QUESTIONS;
   if (n > words.length) n = words.length;

   totalQuestions = n;
   setTotalQuestionsUI();

   startOverlay.classList.add("hidden");

   elReset.disabled = false;
   initPool();
   generateQuestion();
}


updateCountHint();
countInput.value = String(Math.max(MIN_QUESTIONS, Math.min(words.length, 10)));
setTotalQuestionsUI();

startBtn.addEventListener("click", startQuiz);

nameInput.addEventListener("keydown", (e) => {
   if (e.key === "Enter") startQuiz();
});
countInput.addEventListener("keydown", (e) => {
   if (e.key === "Enter") startQuiz();
});

window.addEventListener("load", () => {
   setTimeout(() => nameInput.focus(), 60);
});

elNext.addEventListener("click", () => {
   if (!current) return;

   if (questionCount >= totalQuestions) {
      showResult();
      return;
   }
   generateQuestion();
});

elReset.addEventListener("click", () => {
   resetQuiz(true);
   elReset.disabled = false;
   generateQuestion();
});

restartBtn.addEventListener("click", () => {
   resultOverlay.classList.add("hidden");
   resetQuiz(true);
   elReset.disabled = false;
   generateQuestion();
});

closeResultBtn.addEventListener("click", () => {
   resultOverlay.classList.add("hidden");
});