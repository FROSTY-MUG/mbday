/* ============================================
   SWATI'S BIRTHDAY — script.js
   Uses "motion" (Framer Motion standalone)
   for scroll-driven, spring-based animations
   with perfectly smooth transitions.
   ============================================ */

// We import from the motion CDN — Framer Motion's standalone core engine
const motionReady = import("https://cdn.jsdelivr.net/npm/motion@11.18.0/+esm")
  .then((m) => m)
  .catch(() => {
    console.warn("Motion library failed to load — using CSS fallbacks");
    return null;
  });

// ──────────────────────────────────────────────
// IMMEDIATELY SHOW HERO (don't wait for motion)
// ──────────────────────────────────────────────
(function showHeroInstant() {
  // Small timeout ensures DOM is painted
  requestAnimationFrame(() => {
    const heroEls = document.querySelectorAll("#hero [data-motion]");
    heroEls.forEach((el, i) => {
      el.style.transition = `opacity 0.9s cubic-bezier(.4,0,.2,1) ${i * 0.2}s, transform 0.9s cubic-bezier(.34,1.56,.64,1) ${i * 0.2}s`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0) scale(1)";
    });
  });
})();

// ──────────────────────────────────────────────
// 1.  PARTICLES
// ──────────────────────────────────────────────
(function spawnParticles() {
  const box = document.getElementById("particles");
  const colors = ["#e63946", "#ff6b9d", "#ff9ec5", "#fff", "#c1121f"];
  for (let i = 0; i < 45; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 10}s;
    `;
    box.appendChild(p);
  }
})();

// ──────────────────────────────────────────────
// 2.  CONFETTI BURST (on hero load) & CONTINUOUS SHOWER
// ──────────────────────────────────────────────
(function confetti() {
  const burst = document.getElementById("confettiBurst");
  const colors = ["#e63946", "#ff6b9d", "#ff9ec5", "#ffd700", "#fff", "#c1121f", "#bae6fd", "#fed7aa"];
  for (let i = 0; i < 150; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 450 + 100;
    c.style.cssText = `
      --x:${Math.cos(angle) * dist}px;
      --y:${Math.sin(angle) * dist}px;
      width:${Math.random() * 10 + 4}px;
      height:${Math.random() * 10 + 4}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      animation-delay:${Math.random() * 0.8}s;
    `;
    burst.appendChild(c);
  }
})();

// Continuous background confetti shower
(function continuousConfetti() {
  const colors = ["#e63946", "#ff6b9d", "#ff9ec5", "#ffd700", "#fff", "#c1121f", "#a7f3d0", "#bae6fd"];
  setInterval(() => {
    if (document.hidden) return;
    const c = document.createElement("div");
    c.className = "confetti-shower-piece";
    const size = Math.random() * 8 + 4;
    const startX = Math.random() * 100;
    const duration = Math.random() * 5 + 5; // 5s to 10s
    c.style.cssText = `
      position: fixed;
      top: -10px;
      left: ${startX}vw;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      opacity: ${Math.random() * 0.6 + 0.3};
      z-index: -1;
      pointer-events: none;
      animation: confettiFall ${duration}s linear forwards;
    `;
    document.body.appendChild(c);
    c.addEventListener("animationend", () => c.remove());
  }, 250); // Spawns a piece every 250ms
})();

// ──────────────────────────────────────────────
// 3.  SCROLL PROGRESS BAR (pure JS fallback)
// ──────────────────────────────────────────────
const progressBar = document.getElementById("scrollProgress");

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// ──────────────────────────────────────────────
// 4.  INTERSECTION OBSERVER — scroll reveals
//     (works immediately, then enhanced by motion)
// ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const els = entry.target.querySelectorAll("[data-motion]");
        els.forEach((el, i) => {
          const delay = parseFloat(el.dataset.delay || 0) + i * 0.05;
          const type = el.dataset.motion;

          // Set initial off-screen state
          if (el.style.opacity !== "1") {
            if (type === "fade-up")     { el.style.transform = "translateY(50px)"; }
            if (type === "fade-down")   { el.style.transform = "translateY(-40px)"; }
            if (type === "scale-in")    { el.style.transform = "scale(0.82)"; }
            if (type === "slide-left")  { el.style.transform = "translateX(-70px)"; }
            if (type === "slide-right") { el.style.transform = "translateX(70px)"; }
          }

          // Animate in with CSS transitions
          setTimeout(() => {
            el.style.transition = `opacity 0.85s cubic-bezier(.34,1.56,.64,1), transform 0.85s cubic-bezier(.34,1.56,.64,1)`;
            el.style.opacity = "1";
            el.style.transform = "translate(0,0) scale(1)";
          }, delay * 1000);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "-5% 0px" }
);

document.querySelectorAll(".zone:not(#hero)").forEach((zone) => {
  revealObserver.observe(zone);
});

// ──────────────────────────────────────────────
// 5.  FRAMER MOTION ENHANCEMENTS (if loaded)
// ──────────────────────────────────────────────
motionReady.then((motion) => {
  if (!motion) return;
  const { animate: motionAnimate, scroll: motionScroll } = motion;

  // Enhanced scroll progress with motion
  try {
    motionScroll(
      motionAnimate(progressBar, { width: ["0%", "100%"] }, { ease: "linear" })
    );
  } catch (e) { /* fallback already active */ }

  // Parallax on abstract shapes
  try {
    document.querySelectorAll(".shape").forEach((s, i) => {
      const speed = (i % 2 === 0 ? -1 : 1) * (15 + i * 8);
      motionScroll(
        motionAnimate(s, { transform: [`translateY(0px)`, `translateY(${speed}px)`] }, { ease: "linear" })
      );
    });
  } catch (e) { /* shapes still float via CSS */ }

  console.log("✨ Framer Motion (standalone) enhancements applied!");
});

// ──────────────────────────────────────────────
// 6.  NAV DOTS — active on scroll
// ──────────────────────────────────────────────
const zones = document.querySelectorAll(".zone");
const dots = document.querySelectorAll(".dot");

function updateDots() {
  let current = "";
  zones.forEach((z) => {
    const rect = z.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      current = z.id;
    }
  });
  dots.forEach((d) => {
    d.classList.toggle("active", d.dataset.section === current);
  });
}
window.addEventListener("scroll", updateDots, { passive: true });
updateDots();

// ──────────────────────────────────────────────
// 7.  CAKE (ABSTRACT) — SPRINKLES & CANDLES
// ──────────────────────────────────────────────
const cake = document.getElementById("birthdayCake");
const sprinklesLayer = document.getElementById("sprinklesLayer");
const cakeCta = document.getElementById("cakeCta");

// Flame click logic
const flames = document.querySelectorAll(".flame-abs");
let candlesBlown = 0;

flames.forEach(flame => {
  flame.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent cake click
    if (flame.classList.contains("blown")) return;
    
    flame.classList.add("blown");
    candlesBlown++;
    
    if (candlesBlown === flames.length) {
      if (cakeCta) {
        cakeCta.textContent = "🎉 You made a wish! Happy Birthday Swati! 🎉";
        cakeCta.classList.add("done");
      }
      spawnHeartBurst(25);
    }
  });
});

// Cake click logic (Sprinkles)
const sprinkleTypes = [
  { type: "butterfly", text: "🦋", className: "sprinkle-butterfly", color: "#FF007F" },
  { type: "star", text: "✦", className: "sprinkle-star", color: "#fcd34d" },
  { type: "bullet", text: "🚀", className: "sprinkle-bullet", color: "" },
  { type: "skull", text: "💀", className: "sprinkle-skull", color: "" }
];

if (cake) {
  cake.addEventListener("click", (e) => {
    const rect = cake.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const sType = sprinkleTypes[Math.floor(Math.random() * sprinkleTypes.length)];
    const sprinkle = document.createElement("div");
    sprinkle.className = `sprinkle-item ${sType.className}`;
    sprinkle.textContent = sType.text;
    sprinkle.style.left = `${(x / rect.width) * 100}%`;
    sprinkle.style.top = `${(y / rect.height) * 100}%`;
    
    if (sType.color) sprinkle.style.color = sType.color;
    
    sprinklesLayer.appendChild(sprinkle);
    SoundFX.playPop();
  });
}

// ──────────────────────────────────────────────
// GLOBAL KEY MANAGER
// ──────────────────────────────────────────────
let globalKeysFound = 0;
function awardKeyPiece() {
  globalKeysFound++;
  updateVaultUI();
  if (globalKeysFound >= 3) {
    unlockVault();
  }
}
function updateVaultUI() {
  const pieces = document.querySelectorAll(".vault-key-slot");
  for (let i = 0; i < globalKeysFound; i++) {
    if (pieces[i]) pieces[i].classList.add("found");
  }
}
function unlockVault() {
  const vaultMessage = document.getElementById("vaultMessage");
  const forgeAnim = document.getElementById("forgeAnim");
  if (vaultMessage) vaultMessage.style.display = "none";
  if (forgeAnim) forgeAnim.style.display = "flex";
  
  setTimeout(() => {
    const vaultKeyWrapper = document.getElementById("vaultKeyWrapper");
    if (vaultKeyWrapper) vaultKeyWrapper.classList.add("forged");
    
    setTimeout(() => {
      // Hide the slots/vault visual structure if desired, or keep it.
      // Reveal all locked content (Piñata, Memories Carousel, Wishes)
      const lockedContent = document.getElementById("lockedContent");
      if (lockedContent) {
        lockedContent.style.display = "flex";
      }
      
      // Auto-scroll to lockedContent
      if (lockedContent) {
        lockedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1500);
  }, 1500);
}

// ──────────────────────────────────────────────
// 8.  DJ MIX PLAYER (Crossfade)
// ──────────────────────────────────────────────
const playlist = [
  "Hope  Maan Panu  I-Popstar  Vol.1  EP05  Amazon MX Player - Warner Music India (youtube).mp3",
  "Banjaare - Bairan (Lyrics) - 7clouds (youtube).mp3"
];

let songTimes = [0, 0];
let currentIndex = 0;

let audioA = new Audio(playlist[0]);
let audioB = new Audio(playlist[1]);

audioA.volume = 1;
audioB.volume = 0;

let isPlaying = false;
let djInteracted = false;
let segmentPlayTime = 0;
let crossfadeInProgress = false;

const djMixBtn = document.getElementById("djMixBtn");
const musicToggleBtn = document.getElementById("musicToggle");

function playDJMix() {
  if (isPlaying) {
    audioA.pause();
    if (audioB) audioB.pause();
    updateUIPlayState(false);
    isPlaying = false;
    return;
  }
  
  audioA.currentTime = songTimes[currentIndex];
  let playPromise = audioA.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      updateUIPlayState(true);
      isPlaying = true;
      djInteracted = true;
    }).catch(e => {
      console.log("Autoplay blocked:", e);
      isPlaying = false;
    });
  }
}

function updateUIPlayState(playing) {
  if (djMixBtn) {
    if (playing) {
      djMixBtn.textContent = "🔊 Playing Mix";
      djMixBtn.classList.add("playing");
    } else {
      djMixBtn.textContent = "🎵 Play Mix";
      djMixBtn.classList.remove("playing");
    }
  }
  if (musicToggleBtn) {
    if (playing) {
      musicToggleBtn.classList.add("playing");
      musicToggleBtn.querySelector(".music-ico").textContent = "🔊";
    } else {
      musicToggleBtn.classList.remove("playing");
      musicToggleBtn.querySelector(".music-ico").textContent = "🎵";
    }
  }
}

// Try to autoplay on load
window.addEventListener("DOMContentLoaded", () => {
  playDJMix();
});

// User interactions to bypass browser autoplay policy
["click", "scroll", "touchstart"].forEach(evt => {
  document.body.addEventListener(evt, () => {
    if (!djInteracted) {
      playDJMix();
      djInteracted = true;
    }
  }, { once: true });
});

if (djMixBtn) {
  djMixBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    djInteracted = true;
    playDJMix();
  });
}
if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    djInteracted = true;
    playDJMix();
  });
}

// Interval to monitor play time and handle crossfading after 40 seconds
setInterval(() => {
  if (!isPlaying || crossfadeInProgress) return;
  
  // Save current playback time
  songTimes[currentIndex] = audioA.currentTime;
  
  segmentPlayTime += 0.5; // check runs every 500ms
  
  if (segmentPlayTime >= 40) {
    crossfadeInProgress = true;
    segmentPlayTime = 0;
    
    let nextIndex = (currentIndex + 1) % playlist.length;
    
    // Prep audioB
    audioB.src = playlist[nextIndex];
    audioB.currentTime = songTimes[nextIndex];
    audioB.volume = 0;
    
    let playPromise = audioB.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        SoundFX.playDJRiser();
        
        let fadeSteps = 30;
        let fadeInt = setInterval(() => {
          if (!isPlaying) {
            clearInterval(fadeInt);
            crossfadeInProgress = false;
            return;
          }
          
          try {
            if (audioA.volume >= 0.035) audioA.volume -= 0.033;
            if (audioB.volume <= 0.965) audioB.volume += 0.033;
          } catch(e) {}
          
          fadeSteps--;
          if (fadeSteps <= 0) {
            clearInterval(fadeInt);
            audioA.pause();
            audioA.volume = 0;
            audioB.volume = 1;
            
            // Swap players so audioA is always active
            let temp = audioA;
            audioA = audioB;
            audioB = temp;
            
            currentIndex = nextIndex;
            crossfadeInProgress = false;
          }
        }, 100);
      }).catch(e => {
        console.error("Crossfade play blocked:", e);
        crossfadeInProgress = false;
      });
    } else {
      crossfadeInProgress = false;
    }
  }
}, 500);

// ──────────────────────────────────────────────
// 9.  GAMING STATS — count-up on reveal
// ──────────────────────────────────────────────
let statsCounted = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        document.querySelectorAll(".stat-num").forEach((el) => {
          const target = parseInt(el.dataset.count, 10);
          const duration = 2000;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
const statsRow = document.querySelector(".stats-row");
if (statsRow) statsObserver.observe(statsRow);

// ──────────────────────────────────────────────
// 10. FLOATING HEARTS (final section)
// ──────────────────────────────────────────────
const heartsBox = document.getElementById("floatingHearts");
const heartEmojis = ["❤️", "💖", "💕", "💗", "🩷", "🌹", "✨"];

function spawnHeartBurst(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnOneHeart(), i * 120);
  }
}

function spawnOneHeart() {
  const h = document.createElement("div");
  h.className = "fh";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "%";
  h.style.animationDuration = (Math.random() * 3 + 4) + "s";
  h.style.fontSize = (Math.random() * 1 + 1) + "rem";
  heartsBox.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}

// Spawn hearts when wishes section is in view
const wishesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        spawnHeartBurst(15);
      }
    });
  },
  { threshold: 0.2 }
);
const wishesZone = document.getElementById("wishes");
if (wishesZone) wishesObserver.observe(wishesZone);

// ──────────────────────────────────────────────
// SOUND EFFECTS ENGINE (Web Audio API)
// ──────────────────────────────────────────────
const sfxContext = new (window.AudioContext || window.webkitAudioContext)();

const SoundFX = {
  playPop: () => {
    if (sfxContext.state === 'suspended') sfxContext.resume();
    const osc = sfxContext.createOscillator();
    const gain = sfxContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, sfxContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, sfxContext.currentTime + 0.1);
    gain.gain.setValueAtTime(1, sfxContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, sfxContext.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(sfxContext.destination);
    osc.start();
    osc.stop(sfxContext.currentTime + 0.1);
  },
  playPing: () => {
    if (sfxContext.state === 'suspended') sfxContext.resume();
    const osc = sfxContext.createOscillator();
    const gain = sfxContext.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, sfxContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, sfxContext.currentTime + 0.2);
    gain.gain.setValueAtTime(0.5, sfxContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, sfxContext.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(sfxContext.destination);
    osc.start();
    osc.stop(sfxContext.currentTime + 0.2);
  },
  playHit: () => {
    if (sfxContext.state === 'suspended') sfxContext.resume();
    const osc = sfxContext.createOscillator();
    const gain = sfxContext.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, sfxContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, sfxContext.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, sfxContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, sfxContext.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(sfxContext.destination);
    osc.start();
    osc.stop(sfxContext.currentTime + 0.1);
  },
  playFanfare: () => {
    if (sfxContext.state === 'suspended') sfxContext.resume();
    const playNote = (freq, startTime, duration) => {
      const osc = sfxContext.createOscillator();
      const gain = sfxContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
      osc.connect(gain);
      gain.connect(sfxContext.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = sfxContext.currentTime;
    playNote(440, now, 0.2);
    playNote(554, now + 0.2, 0.2);
    playNote(659, now + 0.4, 0.4);
  },
  playDJRiser: () => {
    if (sfxContext.state === 'suspended') sfxContext.resume();
    const noise = sfxContext.createBufferSource();
    const buffer = sfxContext.createBuffer(1, sfxContext.sampleRate * 3, sfxContext.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) { output[i] = Math.random() * 2 - 1; }
    noise.buffer = buffer;
    
    const filter = sfxContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, sfxContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(10000, sfxContext.currentTime + 3);
    
    const gain = sfxContext.createGain();
    gain.gain.setValueAtTime(0, sfxContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, sfxContext.currentTime + 2.8);
    gain.gain.linearRampToValueAtTime(0, sfxContext.currentTime + 3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxContext.destination);
    noise.start(sfxContext.currentTime);
  }
};

// ──────────────────────────────────────────────
// 11. PARALLAX SHAPES (CSS fallback for scroll)
// ──────────────────────────────────────────────
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      document.querySelectorAll(".shape").forEach((s, i) => {
        const speed = (i % 2 === 0 ? -0.02 : 0.02) * (1 + i * 0.3);
        s.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ──────────────────────────────────────────────
// 13. BALLOON MINIGAME
// ──────────────────────────────────────────────
const startBalloonBtn = document.getElementById("startBalloonBtn");
const balloonArea = document.getElementById("balloonArea");
const startGameOverlay = document.getElementById("startGameOverlay");
const gameWinOverlay = document.getElementById("gameWinOverlay");
const bgScoreEl = document.getElementById("bgScore");
const bgTimeEl = document.getElementById("bgTime");

let balloonScore = 0;
let balloonTime = 20;
let balloonInterval;
let spawnInterval;
let gameActive = false;

const balloonColors = ["#e63946", "#ff6b9d", "#ff9ec5", "#4ade80", "#facc15", "#60a5fa"];

if (startBalloonBtn) {
  startBalloonBtn.addEventListener("click", () => {
    startGameOverlay.style.display = "none";
    gameActive = true;
    balloonScore = 0;
    balloonTime = 20;
    bgScoreEl.textContent = balloonScore;
    bgTimeEl.textContent = balloonTime;
    balloonArea.innerHTML = ""; // Clear existing

    balloonInterval = setInterval(() => {
      balloonTime--;
      bgTimeEl.textContent = balloonTime;
      if (balloonTime <= 0) {
        endBalloonGame();
      }
    }, 1000);

    spawnInterval = setInterval(spawnBalloon, 600);
  });
}

function spawnBalloon() {
  if (!gameActive) return;
  const balloon = document.createElement("div");
  balloon.className = "balloon";
  balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.color = balloon.style.backgroundColor; 
  balloon.style.left = Math.random() * 80 + 10 + "%";
  balloon.style.bottom = "-60px";
  
  balloon.style.transition = "bottom 4s linear";
  
  balloon.addEventListener("click", () => {
    if (!gameActive) return;
    SoundFX.playPop();
    balloonScore++;
    bgScoreEl.textContent = balloonScore;
    spawnHeartBurst(3, balloon.getBoundingClientRect().left, balloon.getBoundingClientRect().top);
    balloon.remove();
    if (balloonScore >= 15) {
      endBalloonGame(true);
    }
  });

  balloonArea.appendChild(balloon);
  
  requestAnimationFrame(() => {
    balloon.style.bottom = "110%";
  });

  setTimeout(() => {
    if (balloon && balloon.parentNode) balloon.remove();
  }, 4000);
}

function endBalloonGame(won = false) {
  gameActive = false;
  clearInterval(balloonInterval);
  clearInterval(spawnInterval);
  
  if (won || balloonScore >= 15) {
    gameWinOverlay.style.display = "flex";
    SoundFX.playFanfare();
    spawnHeartBurst(30);
    const rewardUI = document.getElementById("balloonKeyReward");
    if (rewardUI && rewardUI.style.display === "none") {
      rewardUI.style.display = "flex";
      awardKeyPiece();
    }
  } else {
    startGameOverlay.style.display = "flex";
    startBalloonBtn.textContent = "Try Again (15 needed)";
  }
}

// ──────────────────────────────────────────────
// 14. SPARKLE CURSOR TRAIL
// ──────────────────────────────────────────────
document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.3) return;
  
  const sparkle = document.createElement("div");
  sparkle.className = "cursor-sparkle";
  sparkle.textContent = Math.random() > 0.5 ? "✨" : "💖";
  sparkle.style.left = e.clientX + "px";
  sparkle.style.top = e.clientY + "px";
  document.body.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1000);
});

// ──────────────────────────────────────────────
// 15. MINIGAME 2: MEMORY MATCH
// ──────────────────────────────────────────────
const memoryArea = document.getElementById("memoryArea");
const startMemoryBtn = document.getElementById("startMemoryBtn");
const startMemoryOverlay = document.getElementById("startMemoryOverlay");
const memoryWinOverlay = document.getElementById("memoryWinOverlay");
const mmScoreEl = document.getElementById("mmScore");

const memoryEmojis = ["🎮", "🦋", "🌹", "🎮", "🦋", "🌹"];
let mmMatched = 0;
let mmFlipped = [];

if (startMemoryBtn) {
  startMemoryBtn.addEventListener("click", () => {
    startMemoryOverlay.style.display = "none";
    mmMatched = 0;
    mmScoreEl.textContent = "0";
    memoryArea.innerHTML = "";
    
    memoryEmojis.sort(() => Math.random() - 0.5);
    
    memoryEmojis.forEach((emoji, idx) => {
      const card = document.createElement("div");
      card.className = "memory-card hidden";
      card.dataset.emoji = emoji;
      card.dataset.idx = idx;
      card.textContent = emoji;
      
      card.addEventListener("click", () => handleMemoryClick(card));
      memoryArea.appendChild(card);
    });
  });
}

function handleMemoryClick(card) {
  if (mmFlipped.length >= 2 || !card.classList.contains("hidden")) return;
  
  card.classList.remove("hidden");
  mmFlipped.push(card);
  
  if (mmFlipped.length === 2) {
    setTimeout(checkMemoryMatch, 800);
  }
}

function checkMemoryMatch() {
  const [c1, c2] = mmFlipped;
  if (c1.dataset.emoji === c2.dataset.emoji) {
    c1.classList.add("matched");
    c2.classList.add("matched");
    mmMatched++;
    mmScoreEl.textContent = mmMatched;
    SoundFX.playPing();
    spawnHeartBurst(5, c1.getBoundingClientRect().left, c1.getBoundingClientRect().top);
    
    if (mmMatched === 3) {
      setTimeout(() => {
        SoundFX.playFanfare();
        memoryWinOverlay.style.display = "flex";
        awardKeyPiece();
      }, 500);
    }
  } else {
    c1.classList.add("hidden");
    c2.classList.add("hidden");
  }
  mmFlipped = [];
}

// ──────────────────────────────────────────────
// 16. MINIGAME 3: CATCH TARGET
// ──────────────────────────────────────────────
const targetArea = document.getElementById("targetArea");
const startTargetBtn = document.getElementById("startTargetBtn");
const startTargetOverlay = document.getElementById("startTargetOverlay");
const targetWinOverlay = document.getElementById("targetWinOverlay");
const tgScoreEl = document.getElementById("tgScore");
const tgTimeEl = document.getElementById("tgTime");

let tgCaught = 0;
let tgTime = 15;
let tgInterval;
let tgTarget;
let tgMoveTimeout;

if (startTargetBtn) {
  startTargetBtn.addEventListener("click", () => {
    startTargetOverlay.style.display = "none";
    tgCaught = 0;
    tgTime = 15;
    tgScoreEl.textContent = tgCaught;
    tgTimeEl.textContent = tgTime;
    
    // Create target
    if (tgTarget) tgTarget.remove();
    tgTarget = document.createElement("div");
    tgTarget.className = "target-dot";
    tgTarget.textContent = "🎯";
    tgTarget.addEventListener("click", handleTargetClick);
    targetArea.appendChild(tgTarget);
    
    if (tgMoveTimeout) clearTimeout(tgMoveTimeout);
    moveTarget();
    
    tgInterval = setInterval(() => {
      tgTime--;
      tgTimeEl.textContent = tgTime;
      if (tgTime <= 0) {
        clearInterval(tgInterval);
        if (tgMoveTimeout) clearTimeout(tgMoveTimeout);
        if (tgCaught < 5) {
          startTargetOverlay.style.display = "flex";
          startTargetBtn.textContent = "Try Again!";
        }
      }
    }, 1000);
  });
}

function moveTarget() {
  if (tgTime <= 0 || tgCaught >= 5) return;
  if (tgMoveTimeout) clearTimeout(tgMoveTimeout);
  
  const areaRect = targetArea.getBoundingClientRect();
  const maxX = areaRect.width - 50;
  const maxY = areaRect.height - 50;
  
  tgTarget.style.left = Math.max(0, Math.random() * maxX) + "px";
  tgTarget.style.top = Math.max(0, Math.random() * maxY) + "px";
  
  // Move automatically if not clicked fast enough
  tgMoveTimeout = setTimeout(() => {
    if (tgTime > 0 && tgCaught < 5) moveTarget();
  }, 2000); // changes position every 2s
}

function handleTargetClick() {
  tgCaught++;
  tgScoreEl.textContent = tgCaught;
  SoundFX.playPing();
  spawnHeartBurst(5, tgTarget.getBoundingClientRect().left, tgTarget.getBoundingClientRect().top);
  if (tgCaught >= 5) {
    clearInterval(tgInterval);
    targetWinOverlay.style.display = "flex";
    tgTarget.style.display = "none";
    SoundFX.playFanfare();
    awardKeyPiece();
  } else {
    moveTarget();
  }
}

// ──────────────────────────────────────────────
// 17. PINATA FINALE LOGIC
// ──────────────────────────────────────────────
const grabBatBtn = document.getElementById("grabBatBtn");
const pinataVisual = document.getElementById("pinataVisual");
const pinataContainer = document.getElementById("pinataContainer");
const pinataNotes = document.getElementById("pinataNotes");
const noteModal = document.getElementById("noteModal");
const closeNoteBtn = document.getElementById("closeNoteBtn");
const pinataHealthBar = document.getElementById("pinataHealthBar");
const pinataHealthFill = document.getElementById("pinataHealthFill");

let pinataHp = 500;
let batActive = false;

if (grabBatBtn) {
  grabBatBtn.addEventListener("click", () => {
    grabBatBtn.style.display = "none";
    batActive = true;
    document.body.classList.add("bat-cursor");
    pinataVisual.style.cursor = "inherit"; // Let body cursor apply
    if (pinataHealthBar) pinataHealthBar.style.display = "block";
  });
}

if (pinataVisual) {
  pinataVisual.addEventListener("click", (e) => {
    if (!batActive) return;
    
    // Deal damage
    pinataHp -= 100;
    SoundFX.playHit();
    
    // Update health bar
    const hpPct = Math.max(0, (pinataHp / 500) * 100);
    if (pinataHealthFill) {
      pinataHealthFill.style.width = hpPct + "%";
      if (hpPct <= 50) pinataHealthFill.style.background = "#facc15";
      if (hpPct <= 20) pinataHealthFill.style.background = "#ef4444";
    }
    
    // Spawn damage text
    const dmg = document.createElement("div");
    dmg.className = "damage-text";
    dmg.textContent = "-100";
    
    // Position slightly offset from center using translate via css
    pinataContainer.appendChild(dmg);
    setTimeout(() => dmg.remove(), 800);

    // Shake animation
    pinataVisual.classList.remove("shake");
    void pinataVisual.offsetWidth; // trigger reflow
    pinataVisual.classList.add("shake");
    
    if (pinataHp <= 0) {
      breakPinata();
    }
  });
}

function breakPinata() {
  batActive = false;
  document.body.classList.remove("bat-cursor");
  if (pinataHealthBar) pinataHealthBar.style.display = "none";
  
  // Explode piñata
  SoundFX.playFanfare();
  pinataVisual.style.transition = "transform 0.5s";
  pinataVisual.style.transform = "scale(0)";
  spawnHeartBurst(50);
  
  setTimeout(() => {
    pinataVisual.style.display = "none";
    pinataNotes.style.display = "flex";
    pinataNotes.style.gap = "20px";
    
    // Spawn JUST ONE note!
    const note = document.createElement("div");
    note.className = "falling-note";
    note.textContent = "💌";
    note.style.left = "45%";
    note.addEventListener("click", () => {
      noteModal.style.display = "flex";
    });
    pinataNotes.appendChild(note);
  }, 300);
}

if (closeNoteBtn) {
  closeNoteBtn.addEventListener("click", () => {
    noteModal.style.display = "none";
  });
}

// ──────────────────────────────────────────────
// DYNAMIC FLYING BUTTERFLIES
// ──────────────────────────────────────────────
(function initButterflies() {
  const butterflyColors = [
    "rgba(251, 113, 133, 0.75)", // pink
    "rgba(191, 219, 254, 0.75)", // blue
    "rgba(233, 213, 255, 0.75)", // purple
    "rgba(254, 240, 138, 0.75)", // yellow
    "rgba(187, 247, 208, 0.75)"  // green
  ];

  function spawnButterfly() {
    if (document.hidden) return;
    
    const container = document.createElement("div");
    container.className = "butterfly-container";
    
    const wingL = document.createElement("div");
    wingL.className = "butterfly-wing butterfly-wing-left";
    const wingR = document.createElement("div");
    wingR.className = "butterfly-wing butterfly-wing-right";
    const body = document.createElement("div");
    body.className = "butterfly-body";
    
    const wingColor = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
    wingL.style.background = wingColor;
    wingR.style.background = wingColor;
    
    container.appendChild(wingL);
    container.appendChild(wingR);
    container.appendChild(body);
    
    const startFromLeft = Math.random() > 0.5;
    const startY = Math.random() * 80 + 10;
    const endY = Math.random() * 80 + 10;
    
    container.style.top = `${startY}vh`;
    container.style.left = startFromLeft ? "-50px" : "calc(100vw + 10px)";
    
    const scale = Math.random() * 0.4 + 0.6;
    
    document.body.appendChild(container);
    
    const startTime = performance.now();
    const duration = Math.random() * 5000 + 8000;
    
    function animateFlight(now) {
      const elapsed = now - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        container.remove();
        return;
      }
      
      let currentX;
      if (startFromLeft) {
        currentX = -50 + (window.innerWidth + 100) * progress;
      } else {
        currentX = (window.innerWidth + 50) - (window.innerWidth + 100) * progress;
      }
      
      const driftY = startY + (endY - startY) * progress;
      const flutterY = Math.sin(progress * Math.PI * 14) * 35;
      const currentY = driftY + (flutterY / window.innerHeight * 100);
      
      const tilt = Math.cos(progress * Math.PI * 14) * 12;
      
      container.style.left = `${currentX}px`;
      container.style.top = `${currentY}vh`;
      container.style.transform = `scale(${scale}) rotate(${tilt}deg)`;
      
      requestAnimationFrame(animateFlight);
    }
    
    requestAnimationFrame(animateFlight);
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(spawnButterfly, Math.random() * 5000);
  }
  setInterval(spawnButterfly, 6000);
})();

console.log("🎂 Happy Birthday Swati! Full site & games loaded.");

