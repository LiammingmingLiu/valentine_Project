/* ============================================
   PIXEL VALENTINE – SCRIPT
   Full 8-bit RPG game style
   ============================================ */

// ─── DOM refs ───
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
const quizFeedback = document.getElementById("quiz-feedback");
const scoreDesc = document.getElementById("score-desc");
const scoreBreakdown = document.getElementById("score-breakdown");
const dreamForm = document.getElementById("dream-form");
const shareBtn = document.getElementById("share-btn");
const restartBtn = document.getElementById("restart-btn");
const copyMsg = document.getElementById("copy-msg");
const pixelScene = document.querySelector(".pixel-scene");
const pixelGirl = document.querySelector(".pixel-runner.pixel-girl");
const pixelBoy = document.querySelector(".pixel-runner.pixel-boy");
const bgCanvas = document.getElementById("bg-canvas");
const soundToggle = document.getElementById("sound-toggle");
const transitionOverlay = document.getElementById("screen-transition");
const easterEggMsg = document.getElementById("easter-egg-msg");
const sealBtn = document.getElementById("seal-btn");

// ─── State ───
let heartEmitterTimer = null;
let yesScale = 1;
let noScale = 1;
let noClickCount = 0;
let currentQuestion = 0;
let selectedAnswer = null;
const answers = [];
let soundEnabled = false;

// ─── Quiz Data ───
const quizData = [
  { question: "\u6211\u4eec\u6700\u503c\u5f97\u7eaa\u5ff5\u7684\u300c\u7b2c\u4e00\u6b21\u300d\u4f60\u89c9\u5f97\u662f\u54ea\u4e00\u4e2a\uff1f",
    options: ["\u7b2c\u4e00\u6b21\u89c1\u9762", "\u7b2c\u4e00\u6b21kiss", "\u7b2c\u4e00\u6b21\u51b3\u5b9a\u5728\u4e00\u8d77", "\u7b2c\u4e00\u6b21\u4e00\u8d77\u7761"], correct: 0 },
  { question: "\u5982\u679c\u6211\u4eec\u73b0\u5728\u9762\u5bf9\u9762\uff0c\u4f60\u89c9\u5f97\u6211\u4f1a\u5148\u505a\u4ec0\u4e48\uff1f",
    options: ["\u5148\u770b\u4f60\u4e00\u773c\u7136\u540e\u7b11", "\u76f4\u63a5\u62b1\u4e0a\u53bb", "\u5047\u88c5\u5f88\u51b7\u9759\u4f46\u5176\u5b9e\u5fc3\u8df3\u5f88\u5feb", "\u4ec0\u4e48\u90fd\u4e0d\u8bf4\u5c31\u7275\u4f60\u7684\u624b"], correct: 1 },
  { question: "\u4f60\u89c9\u5f97\u6211\u6700\u53d7\u4e0d\u4e86\u4f60\u505a\u4ec0\u4e48\uff1f",
    options: ["\u5df2\u8bfb\u4e0d\u56de", "\u7a81\u7136\u53d8\u5f97\u5f88\u5b89\u9759\u4e0d\u8bf4\u8bdd", "\u6545\u610f\u8bf4\u53cd\u8bdd", "\u8ddf\u522b\u4eba\u6bd4\u8ddf\u6211\u8fd8\u70ed\u60c5"], correct: 1 },
  { question: "\u534a\u591c 12 \u70b9\uff0c\u4f60\u4eec\u90fd\u4e0d\u592a\u997f\u4f46\u53c8\u60f3\u5403\u70b9\u4ec0\u4e48\uff0c\u6700\u53ef\u80fd\u53d1\u751f\u7684\u662f\uff1f",
    options: ["\u70b9\u5916\u5356\u70b9\u534a\u5c0f\u65f6\u6700\u540e\u6ca1\u70b9", "\u5403\u96f6\u98df\u5403\u5230\u540e\u6094", "\u8bf4\u4e0d\u5403\u7ed3\u679c\u4e00\u8d77\u5403", "\u5404\u81ea\u5077\u5403"], correct: 1 },
  { question: "\u4f60\u89c9\u5f97\u4ed6\u5728\u670b\u53cb\u9762\u524d\u4f1a\u600e\u4e48\u5f62\u5bb9\u4f60\uff1f",
    options: ["\u5f88\u6e29\u67d4\u4e5f\u5f88\u6709\u8010\u5fc3", "\u770b\u7740\u9ad8\u51b7\u5176\u5b9e\u5f88\u53ef\u7231", "\u8868\u9762\u6210\u719f\u5176\u5b9e\u50cf\u4e2a\u5c0f\u5b69", "\u8ba9\u4eba\u5f88\u5b89\u5fc3\u7684\u90a3\u79cd\u4eba"], correct: 1 },
  { question: "\u6211\u8fde\u7eed\u7ed9\u4f60\u53d13\u6761\u6d88\u606f\u4f60\u90fd\u6ca1\u56de\uff0c\u6211\u7684\u53cd\u5e94\u6700\u53ef\u80fd\u662f\uff1f",
    options: ["\u7ee7\u7eed\u53d1\u7b2c4\u6761\u7b2c5\u6761\u7b2c6\u6761", "\u6253\u7535\u8bdd\u8fc7\u53bb", "\u5047\u88c5\u4e0d\u5728\u610f\u4f46\u6bcf30\u79d2\u770b\u4e00\u6b21\u624b\u673a", "\u53d1\u4e00\u53e5\u201c\u597d\u5427\u201d\u7136\u540e\u7b49\u4f60\u614c"], correct: 2 },
  { question: "\u6211\u4eec\u4e00\u8d77\u65c5\u884c\uff0c\u5230\u4e86\u9152\u5e97\u7b2c\u4e00\u4ef6\u4e8b\u4f60\u89c9\u5f97\u6211\u4f1a\u505a\u4ec0\u4e48\uff1f",
    options: ["\u76f4\u63a5\u6251\u5230\u5e8a\u4e0a\u6253\u6eda", "\u5148\u68c0\u67e5\u623f\u95f4\u7136\u540e\u5f00\u59cb\u5410\u69fd", "\u62cd\u7167\u53d1\u670b\u53cb\u5708/\u5c0f\u7ea2\u4e66", "\u627e wifi \u5bc6\u7801"], correct: 0 },
];

// ═══════════════════════════════════════════
// 8-BIT SOUND ENGINE
// ═══════════════════════════════════════════
const AudioEngine = {
  ctx: null,
  init() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  },
  playTone(freq, dur, type, vol) {
    if (!soundEnabled || !this.ctx) return;
    try {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(vol || 0.12, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(); o.stop(this.ctx.currentTime + dur);
    } catch(e) {}
  },
  click() { this.playTone(800, 0.06, "square", 0.08); },
  correct() {
    this.playTone(523, 0.1); setTimeout(() => this.playTone(659, 0.1), 100);
    setTimeout(() => this.playTone(784, 0.15), 200);
  },
  wrong() {
    this.playTone(200, 0.15); setTimeout(() => this.playTone(150, 0.2), 150);
  },
  stageClear() {
    [523,659,784,1047,784,1047,1319].forEach((n,i) => setTimeout(() => this.playTone(n, 0.15), i*120));
  },
  seal() {
    this.playTone(400, 0.1); setTimeout(() => this.playTone(600, 0.1), 100);
    setTimeout(() => this.playTone(800, 0.2), 200);
  },
};

// ═══════════════════════════════════════════
// BACKGROUND: Pixel starfield + floating hearts
// ═══════════════════════════════════════════
const BG = {
  stars: [], hearts: [], ctx: null, raf: null,
  init() {
    this.ctx = bgCanvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height,
        size: Math.random() < 0.3 ? 2 : 1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpd: 0.02 + Math.random() * 0.03,
      });
    }
    for (let i = 0; i < 12; i++) this.hearts.push(this.newHeart());
    this.loop();
  },
  resize() { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; },
  newHeart() {
    return {
      x: Math.random() * (bgCanvas.width || window.innerWidth),
      y: (bgCanvas.height || window.innerHeight) + 20,
      size: 4 + Math.random() * 6, speed: 0.3 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2, swaySpd: 0.01 + Math.random() * 0.02,
      swayAmp: 20 + Math.random() * 30, alpha: 0.12 + Math.random() * 0.2,
    };
  },
  drawPixelHeart(x, y, size, alpha) {
    const c = this.ctx; c.save(); c.globalAlpha = alpha; c.fillStyle = "#ff5ca8";
    const s = size;
    [[0,1,0,1,0],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]].forEach((row, ry) => {
      row.forEach((px, rx) => { if (px) c.fillRect(x + rx * s, y + ry * s, s, s); });
    });
    c.restore();
  },
  loop() {
    const c = this.ctx, w = bgCanvas.width, h = bgCanvas.height;
    c.clearRect(0, 0, w, h);
    this.stars.forEach(s => {
      s.twinkle += s.twinkleSpd;
      const a = 0.3 + Math.sin(s.twinkle) * 0.4;
      c.fillStyle = `rgba(255,230,242,${Math.max(0,a)})`;
      c.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    });
    this.hearts.forEach(h2 => {
      h2.y -= h2.speed; h2.sway += h2.swaySpd;
      const sx = h2.x + Math.sin(h2.sway) * h2.swayAmp;
      this.drawPixelHeart(sx, h2.y, h2.size / 5, h2.alpha);
      if (h2.y < -30) Object.assign(h2, this.newHeart());
    });
    this.raf = requestAnimationFrame(() => this.loop());
  },
};

// ═══════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════
function typewriter(el, text, speed) {
  return new Promise(resolve => {
    el.textContent = "";
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i]; i++;
      if (i >= text.length) { clearInterval(t); resolve(); }
    }, speed || 55);
  });
}

// ═══════════════════════════════════════════
// SCREEN TRANSITIONS
// ═══════════════════════════════════════════
function showScreen(name) {
  return new Promise(resolve => {
    transitionOverlay.className = "screen-transition curtain-in";
    setTimeout(() => {
      Object.values(screens).forEach(s => s.classList.remove("active"));
      screens[name].classList.add("active");
      if (name === "intro") startHeartEmitter(); else stopHeartEmitter();
      transitionOverlay.className = "screen-transition curtain-out";
      setTimeout(() => { transitionOverlay.className = "screen-transition"; resolve(); }, 350);
    }, 350);
  });
}

// ═══════════════════════════════════════════
// PARTICLE TRAILS
// ═══════════════════════════════════════════
const trailShapes = ["♥","♡","✦","✧","★","☆","❤","💖"];
const trailClasses = ["heart","star","sparkle","heart","star","heart"];
const trailSizes = ["size-sm","size-md","size-lg"];

function spawnTrail(runnerEl) {
  if (!pixelScene || !runnerEl || !document.body.contains(pixelScene)) return;
  const sr = pixelScene.getBoundingClientRect();
  const rr = runnerEl.getBoundingClientRect();
  const x = rr.left - sr.left + rr.width * 0.5 + (Math.random()-0.5)*30;
  const y = rr.top - sr.top + rr.height * 0.3 + (Math.random()-0.5)*20;
  const el = document.createElement("span");
  el.className = `trail-particle ${trailClasses[Math.floor(Math.random()*trailClasses.length)]} ${trailSizes[Math.floor(Math.random()*trailSizes.length)]}`;
  el.textContent = trailShapes[Math.floor(Math.random()*trailShapes.length)];
  el.style.left = x + "px"; el.style.top = y + "px";
  el.style.setProperty("--tx", (Math.random()-0.5)*40 + "px");
  el.style.setProperty("--tx2", (Math.random()-0.5)*60 + "px");
  el.style.setProperty("--rot", (Math.random()-0.5)*40 + "deg");
  el.style.setProperty("--rot2", (Math.random()-0.5)*90 + "deg");
  pixelScene.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), {once:true});
}

function spawnPixelHeart(runnerEl) {
  if (!pixelScene || !runnerEl) return;
  const sr = pixelScene.getBoundingClientRect();
  const rr = runnerEl.getBoundingClientRect();
  const x = rr.left - sr.left + rr.width*0.55 + (Math.random()-0.5)*20;
  const y = rr.top - sr.top + rr.height*0.2 + (Math.random()-0.5)*16;
  const h = document.createElement("div");
  h.className = "pixel-heart-fx";
  h.style.left = x+"px"; h.style.top = y+"px";
  h.style.setProperty("--dx", (Math.random()-0.5)*100+"px");
  h.style.setProperty("--dy", (-80-Math.random()*80)+"px");
  h.style.setProperty("--s", (0.8+Math.random()*0.5)+"");
  pixelScene.appendChild(h);
  h.addEventListener("animationend", () => h.remove(), {once:true});
}

function startHeartEmitter() {
  if (heartEmitterTimer) return;
  if (!pixelScene) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  heartEmitterTimer = setInterval(() => {
    if (Math.random() < 0.9) spawnTrail(pixelGirl);
    if (Math.random() < 0.8) spawnTrail(pixelBoy);
    if (Math.random() < 0.5) spawnPixelHeart(pixelGirl);
    if (Math.random() < 0.35) spawnPixelHeart(pixelBoy);
  }, 140);
}

function stopHeartEmitter() {
  if (heartEmitterTimer) { clearInterval(heartEmitterTimer); heartEmitterTimer = null; }
}

// ═══════════════════════════════════════════
// NO BUTTON
// ═══════════════════════════════════════════
const easterMsgs = [
  "","","","",
  "(ㆆ_ㆆ) ...你确定？",
  "ヽ(ಠ_ಠ)ノ 不许选No！",
  "╥﹏╥ 再点就哭给你看！",
  "ʕ•ᴥ•ʔ 好吧我装可爱...",
  "ε=ε=┌(;*´Д`)ﾉ 我追！",
  "(╯°□°)╯ 算了点Yes吧",
];

function handleNo() {
  noClickCount++;
  yesScale = Math.min(3.5, yesScale + 0.2);
  noScale *= 0.74;
  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;
  noBtn.classList.remove("shake"); void noBtn.offsetWidth; noBtn.classList.add("shake");
  if (noClickCount >= 5) {
    const idx = Math.min(noClickCount, easterMsgs.length - 1);
    easterEggMsg.textContent = easterMsgs[idx];
    easterEggMsg.classList.add("blink");
  }
  AudioEngine.click();
  if (noScale < 0.15) { noBtn.style.opacity = "0"; noBtn.style.pointerEvents = "none"; }
}

// ═══════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════
function renderQuestion() {
  const item = quizData[currentQuestion];
  selectedAnswer = null; nextBtn.disabled = true;
  quizFeedback.textContent = ""; quizFeedback.className = "quiz-feedback";
  progressText.textContent = `QUEST ${currentQuestion+1} / ${quizData.length}`;
  progressFill.style.width = `${((currentQuestion+1)/quizData.length)*100}%`;
  typewriter(questionText, item.question, 35);

  optionsWrap.innerHTML = "";
  item.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn option-btn"; btn.textContent = opt;
    btn.addEventListener("click", () => {
      if (selectedAnswer !== null) return;
      selectedAnswer = idx;
      document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      AudioEngine.click();
      setTimeout(() => {
        const ok = idx === item.correct;
        if (ok) {
          quizFeedback.textContent = "✨ NICE!";
          quizFeedback.className = "quiz-feedback correct";
          btn.classList.add("correct-answer");
          AudioEngine.correct();
        } else {
          quizFeedback.textContent = "💔 MISS...";
          quizFeedback.className = "quiz-feedback wrong";
          btn.classList.add("wrong-answer");
          optionsWrap.children[item.correct].classList.add("correct-answer");
          AudioEngine.wrong();
        }
        nextBtn.disabled = false;
      }, 300);
    });
    optionsWrap.appendChild(btn);
  });
}

function scoreMessage(s, t) {
  if (s === t) return `满分 ${s}/${t}！你就是我命中注定的灵魂队友。`;
  if (s >= t-1) return `${s}/${t}，我们的默契高得离谱。`;
  if (s >= Math.ceil(t/2)) return `${s}/${t}，默契在线，继续解锁更多共同回忆。`;
  return `${s}/${t}，这说明我们还有更多甜甜的小细节等着一起发现。`;
}

function renderScoreBreakdown() {
  scoreBreakdown.innerHTML = "";
  quizData.forEach((item, i) => {
    const her = answers[i], my = item.correct, ok = her === my;
    const row = document.createElement("article");
    row.className = `compare-row${ok ? " matched" : ""}`;
    row.innerHTML = `<p class="compare-q">${i+1}. ${item.question}</p>
      <p class="compare-meta">你的答案：${item.options[her]}<br>我的答案：${item.options[my]}<br>
      ${ok ? "✅ 心有灵犀+1" : "❌ 没对上，见面后我要告诉你原因"}</p>`;
    scoreBreakdown.appendChild(row);
  });
}

// ═══════════════════════════════════════════
// FIREWORKS (MEGA)
// ═══════════════════════════════════════════
class PixelFireworks {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d");
    this.particles = []; this.resize();
    window.addEventListener("resize", () => this.resize());
    this.running = false;
  }
  resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
  spawn(x, y, color, shape) {
    const a = Math.random()*Math.PI*2, v = Math.random()*8+2;
    return { x, y, vx: Math.cos(a)*v, vy: Math.sin(a)*v,
      alpha: 1, decay: Math.random()*0.012+0.005, color,
      size: Math.random()*4+1, grav: 0.06, shape: shape||"circle" };
  }
  explode(x, y) {
    const colors = ["#ff2d7b","#ff5ca8","#ff9ec8","#ffd700","#a855f7",
      "#00e5ff","#4ade80","#ff6b81","#ffa502","#e84393","#fd79a8"];
    const c = colors[Math.floor(Math.random()*colors.length)];
    const n = 40 + Math.floor(Math.random()*40);
    for (let i = 0; i < n; i++) {
      let sh = "circle";
      const r = Math.random();
      if (r < 0.2) sh = "heart"; else if (r < 0.35) sh = "star";
      this.particles.push(this.spawn(x, y, c, sh));
    }
  }
  drawHeart(c, x, y, s) {
    c.save(); c.translate(x,y); const h = s*0.5;
    c.beginPath(); c.moveTo(0,h);
    c.bezierCurveTo(-h*2,-h,-h*0.5,-h*2,0,-h*0.5);
    c.bezierCurveTo(h*0.5,-h*2,h*2,-h,0,h);
    c.fill(); c.restore();
  }
  drawStar(c, x, y, s) {
    c.save(); c.translate(x,y); c.beginPath();
    for (let i=0;i<5;i++) { const a=(i*4*Math.PI)/5-Math.PI/2;
      c[i===0?"moveTo":"lineTo"](Math.cos(a)*s, Math.sin(a)*s); }
    c.closePath(); c.fill(); c.restore();
  }
  update() {
    const c = this.ctx;
    c.fillStyle = "rgba(26,10,46,0.15)"; c.fillRect(0,0,this.canvas.width,this.canvas.height);
    for (let i = this.particles.length-1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.grav;
      p.alpha -= p.decay; p.vx *= 0.985; p.vy *= 0.985;
      if (p.alpha <= 0) { this.particles.splice(i,1); continue; }
      c.save(); c.globalAlpha = p.alpha; c.fillStyle = p.color;
      c.shadowBlur = 8; c.shadowColor = p.color;
      if (p.shape==="heart") this.drawHeart(c,p.x,p.y,p.size);
      else if (p.shape==="star") this.drawStar(c,p.x,p.y,p.size);
      else { c.beginPath(); c.arc(p.x,p.y,p.size,0,Math.PI*2); c.fill(); }
      c.restore();
    }
    if (this.running) requestAnimationFrame(() => this.update());
  }
  start() {
    if (this.running) return;
    this.running = true; this.canvas.style.display = "block"; this.update();
    for (let i=0;i<8;i++) setTimeout(() => {
      this.explode(
        Math.random()*this.canvas.width*0.8+this.canvas.width*0.1,
        Math.random()*this.canvas.height*0.4+this.canvas.height*0.1);
    }, i*150);
    let wave = 0;
    this.iv = setInterval(() => {
      const cnt = wave < 3 ? 2 : 1;
      for (let i=0;i<cnt;i++) this.explode(
        Math.random()*this.canvas.width*0.8+this.canvas.width*0.1,
        Math.random()*this.canvas.height*0.5+this.canvas.height*0.05);
      wave++;
    }, 400);
    setTimeout(() => this.stop(), 20000);
  }
  stop() {
    this.running = false;
    if (this.iv) { clearInterval(this.iv); this.iv = null; }
    setTimeout(() => {
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.canvas.style.display = "none";
    }, 4000);
  }
}

// ═══════════════════════════════════════════
// MISSIONS (Quest Log)
// ═══════════════════════════════════════════
function renderMissions(dreams, score, total) {
  const ml = document.getElementById("mission-list");
  if (!ml) return; ml.innerHTML = "";
  const qm = document.createElement("div");
  qm.className = "mission-item completed";
  qm.innerHTML = `<div class="mission-checkbox">✓</div>
    <div class="mission-text">完成默契问答 (${score}/${total} 心有灵犀)</div>`;
  ml.appendChild(qm);

  dreams.forEach(d => {
    const m = document.createElement("div");
    m.className = "mission-item";
    m.innerHTML = `<div class="mission-checkbox"></div><div class="mission-text">${d}</div>`;
    m.addEventListener("click", function() {
      this.classList.toggle("completed");
      const cb = this.querySelector(".mission-checkbox");
      if (this.classList.contains("completed")) {
        cb.textContent = "✓";
        AudioEngine.correct();
        confettiExplosion(this);
      } else {
        cb.textContent = "";
      }
      const all = ml.querySelectorAll(".mission-item.completed").length === ml.children.length;
      const um = document.getElementById("unlock-msg");
      if (all && um) {
        um.innerHTML = '<span class="sparkle">🎉</span> 恭喜！所有任务完成！<span class="sparkle">🎉</span>';
        um.style.color = "#4ade80";
      }
    });
    ml.appendChild(m);
  });
}

function confettiExplosion(element) {
  const rect = element.getBoundingClientRect();
  const colors = ["#ff2d7b","#ff9ec8","#ffd700","#a855f7","#00e5ff","#4ade80"];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement("div");
    p.style.cssText = `position:fixed;width:6px;height:6px;background:${colors[Math.floor(Math.random()*colors.length)]};pointer-events:none;z-index:10000;left:${rect.left+rect.width/2}px;top:${rect.top+rect.height/2}px;`;
    document.body.appendChild(p);
    const angle = (Math.PI*2*i)/25;
    const vel = 40 + Math.random()*50;
    const tx = Math.cos(angle)*vel, ty = Math.sin(angle)*vel;
    p.animate([
      { transform:"translate(0,0) scale(1)", opacity:1 },
      { transform:`translate(${tx}px,${ty}px) scale(0)`, opacity:0 }
    ], { duration:600, easing:"cubic-bezier(0,.9,.57,1)" }).onfinish = () => p.remove();
  }
}

function animateScore(target) {
  const el = document.getElementById("sync-score");
  const mcEl = document.getElementById("match-count");
  if (!el) return;
  let cur = 0; const inc = target / 30;
  const timer = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = Math.floor(cur);
  }, 30);
  if (mcEl) {
    const matched = Math.round(target * quizData.length / 100);
    mcEl.textContent = `答对 ${matched}/${quizData.length} 题`;
  }
}

// ═══════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════

// Sound toggle
soundToggle.addEventListener("click", () => {
  AudioEngine.init();
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
  if (soundEnabled) AudioEngine.click();
});

// Yes / No
yesBtn.addEventListener("click", () => {
  AudioEngine.init();
  AudioEngine.click();
  showScreen("quiz").then(() => renderQuestion());
});
noBtn.addEventListener("click", () => {
  AudioEngine.init();
  handleNo();
});

// Next question
nextBtn.addEventListener("click", () => {
  if (selectedAnswer === null) return;
  AudioEngine.click();
  answers.push(selectedAnswer);
  if (currentQuestion + 1 < quizData.length) {
    currentQuestion++;
    renderQuestion();
  } else {
    const score = answers.filter((a,i) => a === quizData[i].correct).length;
    showScreen("wish").then(() => {
      document.getElementById("score-title").textContent = "挑战完成！";
      scoreDesc.textContent = scoreMessage(score, quizData.length);
      renderScoreBreakdown();
    });
  }
});

// Dream form (seal treasure chest)
dreamForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dreams = [
    document.getElementById("dream-1").value.trim(),
    document.getElementById("dream-2").value.trim(),
    document.getElementById("dream-3").value.trim(),
  ];
  if (dreams.some(d => !d)) { alert("请填写3个愿望~"); return; }

  AudioEngine.seal();
  sealBtn.classList.add("sealing");
  setTimeout(() => sealBtn.classList.remove("sealing"), 600);

  await showScreen("final");

  const score = answers.filter((a,i) => a === quizData[i].correct).length;
  const pct = Math.round((score / quizData.length) * 100);
  animateScore(pct);
  renderMissions(dreams, score, quizData.length);

  // Achievement popup
  setTimeout(() => {
    const popup = document.getElementById("achievement-popup");
    if (popup) popup.classList.add("show");
  }, 600);

  // Fireworks
  const fw = new PixelFireworks(document.getElementById("fireworks-canvas"));
  fw.start();
  AudioEngine.stageClear();
});

// Share
shareBtn.addEventListener("click", async () => {
  const dreams = Array.from(document.querySelectorAll(".mission-item:not(.completed) .mission-text"))
    .map(el => el.textContent).filter(t => !t.includes("默契问答"));
  const done = Array.from(document.querySelectorAll(".mission-item.completed .mission-text"))
    .map(el => el.textContent).filter(t => !t.includes("默契问答"));
  const sc = document.getElementById("sync-score")?.textContent || "0";

  const text = `🎮 我们的默契挑战完成！\n\n默契指数：${sc}%\n🏆 ACHIEVEMENT UNLOCKED: 心有灵犀\n\n📜 待完成任务：\n${dreams.map((d,i) => `${i+1}. ${d}`).join("\n")||"全部完成！"}\n\n✅ 已完成：\n${done.map((d,i) => `${i+1}. ${d}`).join("\n")||"暂无"}\n\n💕 Deal. It is a date.`;
  try {
    await navigator.clipboard.writeText(text);
    copyMsg.textContent = "📋 已复制！快发给TA炫耀一下吧！";
    copyMsg.style.color = "#4ade80";
  } catch { copyMsg.textContent = "❌ 复制失败，请手动截图分享~"; }
  AudioEngine.click();
});

// Restart
restartBtn.addEventListener("click", () => {
  AudioEngine.click();
  currentQuestion = 0; answers.length = 0;
  yesScale = 1; noScale = 1; noClickCount = 0;
  yesBtn.style.transform = "scale(1)";
  noBtn.style.transform = "scale(1)";
  noBtn.style.opacity = "1"; noBtn.style.pointerEvents = "auto";
  easterEggMsg.textContent = ""; easterEggMsg.classList.remove("blink");
  dreamForm.reset();
  const um = document.getElementById("unlock-msg");
  if (um) {
    um.innerHTML = '<span class="sparkle">✨</span>完成所有任务解锁下一个惊喜<span class="sparkle">✨</span>';
    um.style.color = "";
  }
  const popup = document.getElementById("achievement-popup");
  if (popup) popup.classList.remove("show");
  showScreen("intro");
});

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
BG.init();
startHeartEmitter();

// Typewriter intro text
(async () => {
  const kicker = document.getElementById("kicker-text");
  const title = document.getElementById("title-text");
  const sub = document.getElementById("subtitle-text");
  await typewriter(kicker, "For my favorite person across the ocean", 30);
  await typewriter(title, "Will you be my Valentine?", 50);
  await typewriter(sub, "就算不在你身边，也想把今天变得很特别。", 40);
})();