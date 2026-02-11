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
const shareBtn = document.getElementById("share-btn");
const restartBtn = document.getElementById("restart-btn");
const submitMsg = document.getElementById("submit-msg");
const copyMsg = document.getElementById("copy-msg");

const pixelScene = document.querySelector(".pixel-scene");
const pixelGirl = document.querySelector(".pixel-runner.pixel-girl");
const pixelBoy = document.querySelector(".pixel-runner.pixel-boy");
let heartEmitterTimer = null;
let trailHeartTimer = null;

// 礼花效果
class Fireworks {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fireworks-canvas';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.running = false;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 6 + 2;
    return {
      x, y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      color,
      size: Math.random() * 3 + 1,
      gravity: 0.08
    };
  }

  explode(x, y) {
    const colors = ['#ff357a', '#ff6b9d', '#ff9ec8', '#ffd700', '#ff4757', '#ff6348', '#ffa502', '#ff6b81', '#c44569', '#f8b500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = Math.random() * 30 + 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle(x, y, color));
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.vx *= 0.98;
      p.vy *= 0.98;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 发光效果
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.running) {
      requestAnimationFrame(() => this.update());
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.update();
    
    // 持续随机爆炸
    this.explodeInterval = setInterval(() => {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.1;
      this.explode(x, y);
    }, 300);

    // 15秒后停止
    setTimeout(() => {
      this.stop();
    }, 15000);
  }

  stop() {
    this.running = false;
    if (this.explodeInterval) {
      clearInterval(this.explodeInterval);
      this.explodeInterval = null;
    }
    setTimeout(() => {
      this.canvas.remove();
    }, 3000);
  }
}

const quizData = [
  {
    question: "我们最值得纪念的「第一次」你觉得是哪一个？",
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
    question: "你觉得我给你发「在干嘛」的真实潜台词更像？",
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

  // 开始跟随小人的爱心拖尾效果
  startTrailingHearts();
}

function startTrailingHearts() {
  if (trailHeartTimer) return;
  
  trailHeartTimer = window.setInterval(() => {
    if (!pixelScene) return;
    
    // 在女孩头上生成跟随的爱心
    createTrailingHeart(pixelGirl, -30, -40);
    
    // 在男孩头上生成跟随的爱心（延迟一点，营造追逐感）
    setTimeout(() => {
      createTrailingHeart(pixelBoy, -30, -40);
    }, 100);
    
  }, 400);
}

function createTrailingHeart(runnerEl, offsetX, offsetY) {
  if (!runnerEl || !document.body.contains(runnerEl)) return;
  
  const heart = document.createElement('div');
  heart.className = 'trailing-heart';
  heart.style.left = '50%';
  heart.style.top = '20%';
  heart.style.marginLeft = offsetX + 'px';
  heart.style.marginTop = offsetY + 'px';
  
  runnerEl.appendChild(heart);
  
  // 动画结束后移除
  setTimeout(() => {
    if (heart.parentNode) heart.remove();
  }, 1200);
}

function stopHeartEmitter() {
  if (!heartEmitterTimer) return;
  window.clearInterval(heartEmitterTimer);
  heartEmitterTimer = null;
  
  if (trailHeartTimer) {
    window.clearInterval(trailHeartTimer);
    trailHeartTimer = null;
  }
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

function renderMissions(dreams, score, total) {
  const missionList = document.getElementById('mission-list');
  if (!missionList) return;
  
  missionList.innerHTML = '';
  
  // 问答成就任务
  const quizMission = document.createElement('div');
  quizMission.className = 'mission-item completed';
  quizMission.innerHTML = `
    <div class="mission-checkbox">✓</div>
    <div class="mission-text">完成默契问答 (${score}/${total} 心有灵犀)</div>
  `;
  missionList.appendChild(quizMission);
  
  // 愿望任务
  dreams.forEach((dream, index) => {
    const mission = document.createElement('div');
    mission.className = 'mission-item';
    mission.innerHTML = `
      <div class="mission-checkbox"></div>
      <div class="mission-text">${dream}</div>
    `;
    
    mission.addEventListener('click', function() {
      this.classList.toggle('completed');
      const checkbox = this.querySelector('.mission-checkbox');
      if (this.classList.contains('completed')) {
        checkbox.textContent = '✓';
        // 小庆祝动画
        confettiExplosion(this);
      } else {
        checkbox.textContent = '';
      }
      
      // 检查是否全部完成
      const allCompleted = missionList.querySelectorAll('.mission-item.completed').length === missionList.children.length;
      const unlockMsg = document.getElementById('unlock-msg');
      if (allCompleted && unlockMsg) {
        unlockMsg.innerHTML = '<span class="sparkle">🎉</span> 恭喜！所有任务完成！<span class="sparkle">🎉</span>';
        unlockMsg.style.color = '#28a745';
      }
    });
    
    missionList.appendChild(mission);
  });
}

function confettiExplosion(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#ff357a', '#ff9ec8', '#ffd700', '#ff6b9d'];
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
    `;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    
    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0, .9, .57, 1)'
    }).onfinish = () => particle.remove();
  }
}

function animateScore(targetScore) {
  const scoreEl = document.getElementById('sync-score');
  const matchCountEl = document.getElementById('match-count');
  if (!scoreEl) return;
  
  let current = 0;
  const increment = targetScore / 30;
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetScore) {
      current = targetScore;
      clearInterval(timer);
    }
    scoreEl.textContent = Math.floor(current);
  }, 30);
  
  // 更新成就描述
  if (matchCountEl) {
    const total = quizData.length;
    const matched = Math.round(targetScore * total / 100);
    matchCountEl.textContent = `答对 ${matched}/${total} 题`;
  }
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

  // 计算默契指数并动画显示
  const score = answers.filter((a, i) => a === quizData[i].correct).length;
  const syncPercent = Math.round((score / quizData.length) * 100);
  animateScore(syncPercent);
  
  // 渲染任务列表
  renderMissions(dreams, score, quizData.length);

  // 触发礼花效果
  const fireworks = new Fireworks();
  // 初始大爆炸
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.1;
      fireworks.explode(x, y);
    }, i * 200);
  }
  fireworks.start();

  fillList(manualList, dreams);
  selectedList.innerHTML = "<li>（通过问答挑战选择的默契活动）</li>";
});

shareBtn.addEventListener("click", async () => {
  const dreams = Array.from(document.querySelectorAll('.mission-item:not(.completed) .mission-text')).map(el => el.textContent).filter(t => !t.includes('默契问答'));
  const completedDreams = Array.from(document.querySelectorAll('.mission-item.completed .mission-text')).map(el => el.textContent).filter(t => !t.includes('默契问答'));
  const score = document.getElementById('sync-score')?.textContent || '0';

  const text = `🎮 我们的默契挑战完成！\n\n默契指数：${score}%\n🏆 获得成就：心有灵犀\n\n📋 待完成任务：\n${dreams.map((d, i) => `${i + 1}. ${d}`).join('\n') || '全部完成！'}\n\n✅ 已完成：\n${completedDreams.map((d, i) => `${i + 1}. ${d}`).join('\n') || '暂无'}\n\n💕 Deal. It is a date.`;

  try {
    await navigator.clipboard.writeText(text);
    copyMsg.textContent = "📋 已复制！快发给TA炫耀一下吧！";
    copyMsg.style.color = '#28a745';
  } catch {
    copyMsg.textContent = "❌ 复制失败，请手动截图分享~";
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
  // 重置解锁消息
  const unlockMsg = document.getElementById('unlock-msg');
  if (unlockMsg) {
    unlockMsg.innerHTML = '<span class="sparkle">✨</span>完成所有任务解锁下一个惊喜<span class="sparkle">✨</span>';
    unlockMsg.style.color = '#ff357a';
  }
  showScreen("intro");
});
