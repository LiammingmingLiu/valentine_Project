const screens = {
  intro: document.getElementById("intro-screen"),
  quiz: document.getElementById("quiz-screen"),
  wish: document.getElementById("wish-screen"),
  final: document.getElementById("final-screen"),
};

const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const optionsWrap = document.getElementById("options-wrap");
const nextBtn = document.getElementById("next-btn");

const scoreDesc = document.getElementById("score-desc");
const scoreBreakdown = document.getElementById("score-breakdown");
const dreamForm = document.getElementById("dream-form");

const selectedList = document.getElementById("selected-list");
const manualList = document.getElementById("manual-list");
const copyBtn = document.getElementById("copy-btn");
const restartBtn = document.getElementById("restart-btn");
const submitMsg = document.getElementById("submit-msg");
const copyMsg = document.getElementById("copy-msg");

const pixelScene = document.querySelector(".pixel-scene");
const pixelGirl = document.querySelector(".pixel-runner.pixel-girl");
const pixelBoy = document.querySelector(".pixel-runner.pixel-boy");
let heartEmitterTimer = null;

const quizData = [
  {
    question: "我们最值得纪念的"第一次"你觉得是哪一个？",
    options: ["第一次见面", "第一次kiss", "第一次决定在一起", "第一次一起睡"],
    correct: 2,
  },
  {
    question: "如果我今天突然出现在你门口，我第一句话最可能是？",
    options: ["我来啦", "先抱一下", "想你了", "饿不饿"],
    correct: 1,
  },
  {
    question: "如果有一天你突然发现，TA其实是外星人，但对你很好，你会？",
    options: ["假装不知道", "帮TA隐瞒身份", "先问有没有超能力", "立刻分手（太麻烦了）"],
    correct: 2,
  },
  {
    question: "半夜 12 点，你们都不太饿但又想吃点什么，最可能发生的是？",
    options: ["点外卖点半小时最后没点", "吃零食吃到后悔", "说不吃结果一起吃", "各自偷吃"],
    correct: 1,
  },
  {
    question: "如果必须给对方贴一个标签（仅限你们知道），你会选？",
    options: ["麻烦", "可爱", "神经", "离谱但习惯了"],
    correct: 1,
  },
  {
    question: "你觉得我给你发"在干嘛"的真实潜台词更像？",
    options: ["好想你啊！好想抱抱你", "好想你啊！好想亲亲你", "想你想的要发疯", "不想回答，毁灭吧"],
    correct: 0,
  },
  {
    question: "如果现在只能对 TA 说一句话，你觉得我会说？",
    options: ["谢谢你", "我在", "我爱你", "我们会好的"],
    correct: 2,
  },
];

let yesScale = 1;
let noScale = 1;

let currentQuestion = 0;
let selectedAnswer = null;
const answers = [];

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");

  if (name === "intro") startHeartEmitter();
  else stopHeartEmitter();
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnHeartAtRunner(runnerEl) {
  if (!pixelScene || !runnerEl) return;
  if (!document.body.contains(pixelScene)) return;

  const sceneRect = pixelScene.getBoundingClientRect();
  const rRect = runnerEl.getBoundingClientRect();

  const x = rRect.left - sceneRect.left + rRect.width * 0.55 + rand(-10, 10);
  const y = rRect.top - sceneRect.top + rRect.height * 0.18 + rand(-8, 8);

  const heart = document.createElement("div");
  heart.className = `pixel-heart-fx${Math.random() < 0.25 ? " soft" : ""}`;
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty("--dx", `${rand(-50, 50).toFixed(1)}px`);
  heart.style.setProperty("--dy", `${rand(-140, -90).toFixed(1)}px`);
  heart.style.setProperty("--s", `${rand(0.9, 1.25).toFixed(2)}`);

  pixelScene.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
}

function startHeartEmitter() {
  if (heartEmitterTimer) return;
  if (!pixelScene) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  heartEmitterTimer = window.setInterval(() => {
    if (Math.random() < 0.95) spawnHeartAtRunner(pixelGirl);
    if (Math.random() < 0.75) spawnHeartAtRunner(pixelBoy);
  }, 220);
}

function stopHeartEmitter() {
  if (!heartEmitterTimer) return;
  window.clearInterval(heartEmitterTimer);
  heartEmitterTimer = null;
}

function handleNo() {
  yesScale = Math.min(3.8, yesScale + 0.22);
  noScale *= 0.72;

  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;

  if (noScale < 0.18) {
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
  }
}

function renderQuestion() {
  const item = quizData[currentQuestion];
  selectedAnswer = null;
  nextBtn.disabled = true;

  progressText.textContent = `Question ${currentQuestion + 1} / ${quizData.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
  questionText.textContent = item.question;

  optionsWrap.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn option-btn";
    button.textContent = option;

    button.addEventListener("click", () => {
      selectedAnswer = index;
      nextBtn.disabled = false;
      document.querySelectorAll(".option-btn").forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    optionsWrap.appendChild(button);
  });
}

function scoreMessage(score, total) {
  if (score === total) return `满分 ${score}/${total}！你就是我命中注定的灵魂队友。`;
  if (score >= total - 1) return `${score}/${total}，我们的默契高得离谱。`;
  if (score >= Math.ceil(total / 2)) return `${score}/${total}，默契在线，继续解锁更多共同回忆。`;
  return `${score}/${total}，这说明我们还有更多甜甜的小细节等着一起发现。`;
}

function renderScoreBreakdown() {
  scoreBreakdown.innerHTML = "";
  quizData.forEach((item, index) => {
    const herIndex = answers[index];
    const myIndex = item.correct;
    const matched = herIndex === myIndex;

    const row = document.createElement("article");
    row.className = `compare-row${matched ? " matched" : ""}`;
    row.innerHTML = `
      <p class="compare-q">${index + 1}. ${item.question}</p>
      <p class="compare-meta">
        你的答案：${item.options[herIndex]}<br>
        我的答案：${item.options[myIndex]}<br>
        ${matched ? "答对了，心有灵犀+1" : "没对上，见面后我要告诉你原因"}
      </p>
    `;
    scoreBreakdown.appendChild(row);
  });
}

function fillList(ul, data) {
  ul.innerHTML = "";
  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function quizSummary() {
  return quizData.map((item, index) => {
    const her = item.options[answers[index]];
    const mine = item.options[item.correct];
    const match = answers[index] === item.correct ? "✅" : "❌";
    return `${index + 1}. ${item.question}\n   你：${her}\n   我：${mine} ${match}`;
  }).join("\n\n");
}

yesBtn.addEventListener("click", () => {
  showScreen("quiz");
  renderQuestion();
});

noBtn.addEventListener("click", handleNo);

nextBtn.addEventListener("click", () => {
  if (selectedAnswer === null) return;
  answers.push(selectedAnswer);

  if (currentQuestion + 1 < quizData.length) {
    currentQuestion++;
    renderQuestion();
  } else {
    const score = answers.filter((a, i) => a === quizData[i].correct).length;
    document.getElementById("score-title").textContent = `我们的心有灵犀挑战完成啦`;
    scoreDesc.textContent = scoreMessage(score, quizData.length);
    renderScoreBreakdown();
    showScreen("wish");
  }
});

dreamForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dreams = [
    document.getElementById("dream-1").value.trim(),
    document.getElementById("dream-2").value.trim(),
    document.getElementById("dream-3").value.trim(),
  ];

  if (dreams.some((d) => !d)) {
    alert("请填写3个愿望~");
    return;
  }

  fillList(manualList, dreams);
  selectedList.innerHTML = "<li>（通过问答挑战选择的默契活动）</li>";

  showScreen("final");

  const score = answers.filter((a, i) => a === quizData[i].correct).length;
  const payload = {
    quiz: quizData.map((item, index) => ({
      question: item.question,
      her: item.options[answers[index]],
      mine: item.options[item.correct],
      matched: answers[index] === item.correct,
    })),
    score,
    total: quizData.length,
    picks: [],
    dreams,
  };

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.ok) {
      submitMsg.textContent = "✅ 约定已保存，等我们一一实现。";
    }
  } catch (err) {
    submitMsg.textContent = "⚠️ 保存失败，但约定记在心里了。";
  }
});

copyBtn.addEventListener("click", async () => {
  const dreams = Array.from(manualList.querySelectorAll("li")).map((li) => li.textContent);
  const score = answers.filter((a, i) => a === quizData[i].correct).length;

  const text = `我们的心有灵犀挑战结果：${score}/${quizData.length}\n\n${quizSummary()}\n\n我们要一起做的事：\n${dreams.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nDeal. It is a date.`;

  try {
    await navigator.clipboard.writeText(text);
    copyMsg.textContent = "📋 已复制到剪贴板，快发给TA！";
  } catch {
    copyMsg.textContent = "❌ 复制失败，请手动复制。";
  }
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  answers.length = 0;
  yesScale = 1;
  noScale = 1;
  yesBtn.style.transform = "scale(1)";
  noBtn.style.transform = "scale(1)";
  noBtn.style.opacity = "1";
  noBtn.style.pointerEvents = "auto";
  dreamForm.reset();
  showScreen("intro");
});
