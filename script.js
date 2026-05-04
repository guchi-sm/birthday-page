/* ═══════════════════════════════════════════════════════════
   BIRTHDAY LANDING PAGE — script.js
   All interactive features in vanilla JS, no frameworks.
   ═══════════════════════════════════════════════════════════ */

"use strict";

/* ──────────────────────────────────────
   CONFIGURATION — edit these values
────────────────────────────────────── */
const CONFIG = {
  birthdayPersonName : "Bramwell Mulwa",  // 🔧 Change this
  birthdayDate       : "2026-05-05T00:00:00",       // 🔧 ISO date string
  whatsappPhone      : "[254739106613]",           // 🔧 e.g. 254712345678
  pageUrl            : window.location.href,          // auto-detected

  // Typewriter phrases — edit or add your own
  typewriterPhrases: [
    "A story written in memories, laughter, and love.",
    "To the one who makes every room brighter ✨",
    "Today we celebrate the magic that is you 🌹",
  ],
};

/* ════════════════════════════════════════════════
   1. DOM READY
   ════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initHeroParticles();
  initTypewriter();
  initVisitorEntry();
  initCountdown();
  initScrollReveal();
  initPhotoGallery();
  initMessageForm();
  initSurpriseSection();
  initMusicPlayer();
  initShareButtons();
  initEasterEgg();
  initFloatingHearts();
  confettiOnLoad();
});

/* ════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

/* ════════════════════════════════════════════════
   HERO PARTICLE CANVAS
   ════════════════════════════════════════════════ */
function initHeroParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const particles = [];

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  const COLORS = ["#e8637a","#c084a0","#d4a853","#f7c5cf","#f0d090","#d4a8d0"];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = rand(0, canvas.width);
      this.y     = rand(0, canvas.height);
      this.r     = rand(1, 3.5);
      this.vx    = rand(-0.25, 0.25);
      this.vy    = rand(-0.4, -0.1);
      this.alpha = rand(0.2, 0.8);
      this.color = COLORS[Math.floor(rand(0, COLORS.length))];
      this.life  = rand(0.002, 0.006);
    }
    update() {
      this.x     += this.vx;
      this.y     += this.vy;
      this.alpha -= this.life;
      if (this.alpha <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();
}

/* ════════════════════════════════════════════════
   TYPEWRITER EFFECT
   ════════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById("hero-sub");
  if (!el) return;

  const phrases = CONFIG.typewriterPhrases;
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 65);
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }

  // Delay start to let CSS animation finish
  setTimeout(type, 1600);
}

/* ════════════════════════════════════════════════
   VISITOR ENTRY
   ════════════════════════════════════════════════ */
function initVisitorEntry() {
  const input    = document.getElementById("visitor-name");
  const btn      = document.getElementById("entry-btn");
  const form     = document.getElementById("entry-form");
  const greeting = document.getElementById("entry-greeting");

  // Restore from localStorage
  const saved = localStorage.getItem("bdayVisitorName");
  if (saved) showGreeting(saved, form, greeting);

  btn.addEventListener("click", () => submitEntry(input, form, greeting));
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") submitEntry(input, form, greeting);
  });

  // Pre-fill message name field with visitor name
  const msgName = document.getElementById("msg-name");
  if (saved && msgName) msgName.value = saved;
}

function submitEntry(input, form, greeting) {
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  localStorage.setItem("bdayVisitorName", name);
  showGreeting(name, form, greeting);

  const msgName = document.getElementById("msg-name");
  if (msgName) msgName.value = name;
}

function showGreeting(name, form, greeting) {
  form.classList.add("hidden");
  greeting.classList.remove("hidden");
  greeting.innerHTML = `Hi <strong>${escHtml(name)}</strong> 🌸<br>
    Leave something beautiful for <em>${escHtml(CONFIG.birthdayPersonName)}</em> below 💌`;
}

/* ════════════════════════════════════════════════
   COUNTDOWN TIMER
   ════════════════════════════════════════════════ */
function initCountdown() {
  const target = new Date(CONFIG.birthdayDate).getTime();

  const days  = document.getElementById("cd-days");
  const hours = document.getElementById("cd-hours");
  const mins  = document.getElementById("cd-mins");
  const secs  = document.getElementById("cd-secs");
  const msg   = document.getElementById("countdown-message");

  function pad(n) { return String(n).padStart(2, "0"); }

  function update() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      // Birthday has arrived!
      [days, hours, mins, secs].forEach(el => el.textContent = "00");
      msg.textContent = `🎉 It's the big day! Happy Birthday, ${CONFIG.birthdayPersonName}! 🎂`;
      triggerConfetti(6000);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    setNum(days,  pad(d));
    setNum(hours, pad(h));
    setNum(mins,  pad(m));
    setNum(secs,  pad(s));

    const totalDays = Math.ceil(diff / 86400000);
    if (totalDays <= 1)      msg.textContent = "🎂 Tomorrow is the big day!";
    else if (totalDays <= 7) msg.textContent = `Just ${totalDays} more sleeps! 🌙`;
    else                     msg.textContent = `${d} day${d !== 1 ? "s" : ""} of anticipation ✨`;
  }

  function setNum(el, val) {
    if (el.textContent !== val) {
      el.classList.remove("flip");
      void el.offsetWidth; // reflow to restart animation
      el.classList.add("flip");
      el.textContent = val;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ════════════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
   ════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealOpts = { threshold: 0.12, rootMargin: "0px 0px -60px 0px" };
  const cardOpts   = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" };

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        sectionObs.unobserve(e.target);
      }
    });
  }, revealOpts);

  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.classList.add("visible");
          cardObs.unobserve(e.target);
        }, i * 120);
      }
    });
  }, cardOpts);

  document.querySelectorAll(".reveal-section").forEach(el => sectionObs.observe(el));
  document.querySelectorAll(".reveal-card").forEach(el => cardObs.observe(el));
}

/* ════════════════════════════════════════════════
   PHOTO GALLERY + LIGHTBOX
   ════════════════════════════════════════════════ */
function initPhotoGallery() {
  const items    = [...document.querySelectorAll(".photo-item")];
  const lightbox = document.getElementById("lightbox");
  const lbImg    = document.getElementById("lb-img");
  const lbPrev   = document.getElementById("lb-prev");
  const lbNext   = document.getElementById("lb-next");
  const lbClose  = document.getElementById("lb-close");
  const lbCount  = document.getElementById("lb-counter");
  const lbAuto   = document.getElementById("lb-autoplay");

  let current  = 0;
  let autoTimer = null;
  const images = items.map(i => i.querySelector("img").src);

  function openAt(idx) {
    current = (idx + images.length) % images.length;
    lbImg.src = images[current];
    lbImg.classList.remove("zoomed");
    lbCount.textContent = `${current + 1} / ${images.length}`;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
    stopAuto();
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    lbImg.style.opacity = "0";
    setTimeout(() => {
      lbImg.src = images[current];
      lbImg.style.opacity = "1";
      lbImg.classList.remove("zoomed");
      lbCount.textContent = `${current + 1} / ${images.length}`;
    }, 200);
  }

  // Zoom on image click
  lbImg.addEventListener("click", () => lbImg.classList.toggle("zoomed"));

  // Slideshow
  function startAuto()  { autoTimer = setInterval(() => navigate(1), 2800); lbAuto.classList.add("active"); lbAuto.textContent = "⏸ Slideshow"; }
  function stopAuto()   { clearInterval(autoTimer); autoTimer = null; lbAuto.classList.remove("active"); lbAuto.textContent = "⏵ Slideshow"; }

  lbAuto.addEventListener("click", () => autoTimer ? stopAuto() : startAuto());

  items.forEach((item, idx) => item.addEventListener("click", () => openAt(idx)));
  lbPrev.addEventListener("click",  () => navigate(-1));
  lbNext.addEventListener("click",  () => navigate(1));
  lbClose.addEventListener("click", close);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft")  navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "Escape")     close();
  });

  // Touch swipe
  let tsX = null;
  lightbox.addEventListener("touchstart", e => { tsX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend",   e => {
    if (tsX === null) return;
    const dx = e.changedTouches[0].clientX - tsX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    tsX = null;
  });
}

/* ════════════════════════════════════════════════
   MESSAGE WALL — FIREBASE REALTIME
   ════════════════════════════════════════════════ */
function initMessageForm() {
  // Wait for Firebase to be ready
  window.addEventListener("firebase-ready", setupFirestore);
  // Fallback if event already fired
  if (window.__db) setupFirestore();
}

function setupFirestore() {
  const db   = window.__db;
  const { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } = window.__fbModules;

  const nameInput = document.getElementById("msg-name");
  const textInput = document.getElementById("msg-text");
  const submitBtn = document.getElementById("msg-submit");
  const statusEl  = document.getElementById("msg-status");
  const wall      = document.getElementById("messages-wall");

  // Real-time listener
  const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    wall.innerHTML = "";

    if (snapshot.empty) {
      wall.innerHTML = `<p class="msg-loading">Be the first to leave a wish! 🌸</p>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "message-card";

      const ts = data.timestamp?.toDate?.();
      const timeStr = ts ? ts.toLocaleString("en-GB", {
        day:"2-digit", month:"short", year:"numeric",
        hour:"2-digit", minute:"2-digit"
      }) : "Just now";

      card.innerHTML = `
        <p class="msg-card-name">${escHtml(data.name)}</p>
        <p class="msg-card-text">${escHtml(data.text)}</p>
        <p class="msg-card-time">🕐 ${timeStr}</p>
      `;
      wall.appendChild(card);
    });
  }, (err) => {
    console.warn("Firestore error:", err.message);
    wall.innerHTML = `<p class="msg-loading" style="color:#c2415b">
      ⚠️ Could not load messages. Check your Firebase config.
    </p>`;
  });

  // Submit
  async function submitMessage() {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name) { nameInput.focus(); statusEl.textContent = "Please enter your name."; return; }
    if (!text) { textInput.focus(); statusEl.textContent = "Write something beautiful first!"; return; }

    submitBtn.disabled   = true;
    submitBtn.textContent = "Sending… ✨";
    statusEl.textContent  = "";

    try {
      await addDoc(collection(db, "messages"), {
        name,
        text,
        timestamp: serverTimestamp()
      });
      nameInput.value   = "";
      textInput.value   = "";
      statusEl.textContent = "🎉 Your wish was sent!";
      setTimeout(() => statusEl.textContent = "", 3000);
    } catch (e) {
      statusEl.textContent = "❌ Failed to send. Check Firebase setup.";
      console.error(e);
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Send Wish ✦";
    }
  }

  submitBtn.addEventListener("click", submitMessage);
  textInput.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submitMessage();
  });
}

/* ════════════════════════════════════════════════
   SURPRISE SECTION — copy + QR code
   ════════════════════════════════════════════════ */
function initSurpriseSection() {
  // Copy phone number
  const copyBtn   = document.getElementById("copy-phone-btn");
  const phone     = CONFIG.whatsappPhone;
  const waBtn     = document.getElementById("wa-btn");
  const waLink    = `https://wa.me/${phone}`;

  // Update WhatsApp link dynamically
  if (waBtn) waBtn.href = waLink;

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(`+${phone}`).then(() => {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => copyBtn.textContent = "📋 Copy Number", 2200);
      }).catch(() => {
        // Fallback
        const tmp = document.createElement("input");
        tmp.value = `+${phone}`;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => copyBtn.textContent = "📋 Copy Number", 2200);
      });
    });
  }

  // QR Code
  const qrCanvas = document.getElementById("qr-canvas");
  if (qrCanvas) {
    try {
      new QRCode(qrCanvas, {
        text: waLink,
        width: 160,
        height: 160,
        colorDark: "#1a0a10",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch(e) {
      // QRCode library may not be loaded in test mode
      console.warn("QRCode library not available:", e.message);
    }
  }
}

/* ════════════════════════════════════════════════
   BACKGROUND MUSIC
   ════════════════════════════════════════════════ */
function initMusicPlayer() {
  const player  = document.getElementById("music-player");
  const audio   = document.getElementById("bg-music");
  const icon    = document.getElementById("music-icon");

  if (!player || !audio) return;

  let playing = false;

  player.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      player.classList.remove("playing");
      icon.textContent = "🎵";
    } else {
      audio.play().catch(e => console.warn("Autoplay blocked:", e.message));
      player.classList.add("playing");
      icon.textContent = "🔇";
    }
    playing = !playing;
  });
}

/* ════════════════════════════════════════════════
   SHARE BUTTONS
   ════════════════════════════════════════════════ */
function initShareButtons() {
  const copyLinkBtn = document.getElementById("copy-link-btn");
  const shareWaBtn  = document.getElementById("share-wa");
  const pageUrl     = CONFIG.pageUrl;

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(pageUrl).then(() => {
        copyLinkBtn.textContent = "✅ Copied!";
        setTimeout(() => copyLinkBtn.textContent = "🔗 Copy Link", 2200);
      });
    });
  }

  if (shareWaBtn) {
    const msg = encodeURIComponent(
      `🎂 Come celebrate with ${CONFIG.birthdayPersonName}! ${pageUrl}`
    );
    shareWaBtn.href = `https://wa.me/?text=${msg}`;
  }

  // Native share API (mobile)
  if (navigator.share) {
    const nativeBtn = document.createElement("button");
    nativeBtn.className = "btn-copy";
    nativeBtn.textContent = "📤 Share";
    nativeBtn.style.cssText = "background:rgba(255,255,255,0.7);border-color:rgba(180,100,130,0.25);color:var(--text-body)";
    nativeBtn.addEventListener("click", () => {
      navigator.share({
        title : `Happy Birthday, ${CONFIG.birthdayPersonName}!`,
        text  : `A special birthday page for ${CONFIG.birthdayPersonName} 🎂`,
        url   : pageUrl
      });
    });
    document.querySelector(".share-actions")?.appendChild(nativeBtn);
  }
}

/* ════════════════════════════════════════════════
   EASTER EGG
   ════════════════════════════════════════════════ */
function initEasterEgg() {
  const egg     = document.getElementById("easter-egg");
  const modal   = document.getElementById("easter-modal");
  const closeBtn = document.getElementById("easter-close");

  if (!egg || !modal) return;

  egg.addEventListener("click", () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    triggerConfetti(3000);
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  });
}

/* ════════════════════════════════════════════════
   FLOATING HEARTS
   ════════════════════════════════════════════════ */
function initFloatingHearts() {
  const container = document.getElementById("hearts-container");
  if (!container) return;

  const symbols = ["💗","💓","💕","💞","🌸","✨","💫","🌹","💖","🌷"];

  function spawnHeart() {
    const el = document.createElement("span");
    el.className = "floating-heart";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 8}s;
      --delay: ${Math.random() * 3}s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 14000);
  }

  // Spawn occasionally
  spawnHeart();
  setInterval(spawnHeart, 2800);
}

/* ════════════════════════════════════════════════
   CONFETTI
   ════════════════════════════════════════════════ */
function triggerConfetti(duration = 4000) {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#e8637a","#c084a0","#d4a853","#f7c5cf","#f0d090","#d4a8d0","#ffffff","#ff99b4"];
  const pieces = [];
  const count  = 180;

  class Piece {
    constructor() {
      this.x   = Math.random() * canvas.width;
      this.y   = -10;
      this.w   = 8 + Math.random() * 8;
      this.h   = 4 + Math.random() * 4;
      this.vx  = (Math.random() - 0.5) * 4;
      this.vy  = 3 + Math.random() * 4;
      this.rot = Math.random() * Math.PI * 2;
      this.vr  = (Math.random() - 0.5) * 0.15;
      this.col = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 1;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.rot += this.vr;
      this.vy  += 0.08;
      if (this.y > canvas.height) this.alpha = 0;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = this.col;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) {
    setTimeout(() => pieces.push(new Piece()), Math.random() * 1000);
  }

  let start = null;
  function animate(ts) {
    if (!start) start = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => { p.update(); p.draw(); });
    if (ts - start < duration) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(animate);
}

function confettiOnLoad() {
  // Small celebratory burst on first load
  setTimeout(() => triggerConfetti(3500), 1800);
}

/* ════════════════════════════════════════════════
   UTILITY: escape HTML to prevent XSS
   ════════════════════════════════════════════════ */
function escHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
