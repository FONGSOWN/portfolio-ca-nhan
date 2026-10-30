/* ============================================================
   DƯƠNG NHƯ PHONG SƠN — ROYAL BLACK DIAMOND & LIQUID GOLD
   Three.js 3D Gemstones Engine, Starburst Sparkles & Audio Engine
   ============================================================ */

/* ============================================================
   1. THREE.JS 3D BRILLIANT DIAMONDS UNIVERSE
   ============================================================ */
(function initThreeDiamondUniverse() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReduced) return;

  let scene, camera, renderer;
  let diamonds = [];
  let stardustPoints;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollY = 0;

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020203, 0.0016);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.z = 850;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // --- Dynamic Lighting ---
    const ambientLight = new THREE.AmbientLight(0x221a0e, 2.0);
    scene.add(ambientLight);

    const goldSpotLight = new THREE.PointLight(0xf3d375, 3.2, 1400);
    goldSpotLight.position.set(400, 500, 400);
    scene.add(goldSpotLight);

    const diamondCyanLight = new THREE.PointLight(0xd8f4ff, 2.4, 1200);
    diamondCyanLight.position.set(-450, -350, 300);
    scene.add(diamondCyanLight);

    const centralKeyLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
    centralKeyLight.position.set(0, 600, 600);
    scene.add(centralKeyLight);

    // --- Create 3D Faceted Brilliant Diamonds ---
    createFacetedDiamonds();

    // --- Create Floating Gold & Stardust Particles ---
    createStardustStream();

    // --- Events ---
    document.addEventListener('mousemove', e => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.45;
      targetY = (e.clientY - window.innerHeight / 2) * 0.45;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  }

  function createFacetedDiamonds() {
    // Physical Refraction Gemstone Material
    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x161308,
      emissive: 0x050402,
      roughness: 0.05,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.98,
      transmission: 0.86,
      ior: 2.417, // Real Diamond Refraction
      transparent: true,
      opacity: 0.88
    });

    const wireframeGold = new THREE.MeshBasicMaterial({
      color: 0xf3d375,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    // 7 Faceted Gemstones positioned dynamically
    const diamondConfigs = [
      { size: 110, x: -360, y: 190,  z: -120, speedX: 0.005, speedY: 0.007 },
      { size: 140, x: 420,  y: -140, z: -180, speedX: 0.004, speedY: 0.006 },
      { size: 75,  x: 260,  y: 300,  z: 40,   speedX: 0.007, speedY: 0.009 },
      { size: 90,  x: -300, y: -290, z: -60,  speedX: 0.005, speedY: 0.008 },
      { size: 60,  x: 0,    y: -360, z: 80,   speedX: 0.008, speedY: 0.011 },
      { size: 85,  x: 460,  y: 220,  z: -260, speedX: 0.004, speedY: 0.005 },
      { size: 55,  x: -460, y: 30,   z: -90,  speedX: 0.007, speedY: 0.009 }
    ];

    diamondConfigs.forEach(cfg => {
      const group = new THREE.Group();
      
      // Icosahedron with facets
      const geom = new THREE.IcosahedronGeometry(cfg.size, 1);
      const mesh = new THREE.Mesh(geom, gemMaterial.clone());
      const wire = new THREE.Mesh(geom, wireframeGold.clone());

      group.add(mesh);
      group.add(wire);

      group.position.set(cfg.x, cfg.y, cfg.z);
      group.userData = {
        baseX: cfg.x,
        baseY: cfg.y,
        baseZ: cfg.z,
        speedX: cfg.speedX,
        speedY: cfg.speedY,
        pulseOffset: Math.random() * Math.PI * 2
      };

      scene.add(group);
      diamonds.push(group);
    });
  }

  function createStardustStream() {
    const count = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const goldColor = new THREE.Color(0xf3d375);
    const diamondColor = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 1800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;

      const c = Math.random() > 0.35 ? goldColor : diamondColor;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Shimmer Point Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');

    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(243, 211, 117, 0.9)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.3)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    pCtx.fillStyle = grad;
    pCtx.beginPath();
    pCtx.arc(16, 16, 16, 0, Math.PI * 2);
    pCtx.fill();

    const pTexture = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 7.0,
      map: pTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    stardustPoints = new THREE.Points(geometry, material);
    scene.add(stardustPoints);
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth Spring Camera Parallax
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    camera.position.x = mouseX * 0.4;
    camera.position.y = -mouseY * 0.4 + (scrollY * 0.2);
    camera.lookAt(0, scrollY * 0.2, 0);

    // Rotate Diamonds with subtle pulsing float
    diamonds.forEach((diamond, i) => {
      diamond.rotation.x += diamond.userData.speedX;
      diamond.rotation.y += diamond.userData.speedY;

      const floatY = Math.sin(elapsed * 1.4 + diamond.userData.pulseOffset) * 20;
      const floatX = Math.cos(elapsed * 0.9 + diamond.userData.pulseOffset) * 14;

      diamond.position.y = diamond.userData.baseY + floatY + (scrollY * 0.15);
      diamond.position.x = diamond.userData.baseX + floatX;
    });

    // Animate Stardust
    if (stardustPoints) {
      stardustPoints.rotation.y = elapsed * 0.04;
      stardustPoints.rotation.x = elapsed * 0.018;
    }

    renderer.render(scene, camera);
  }

  try {
    init();
  } catch (err) {
    console.warn("Three.js active in fallback mode:", err);
  }
})();

/* ============================================================
   2. LUXURY 2D STARBURST SPARKLE TRAIL
   ============================================================ */
(function initStarburstSparkles() {
  const canvas = document.getElementById('sparkleCanvas');
  const cursorRing = document.getElementById('cursorRing');
  if (!canvas || !cursorRing) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  let mouseX = W / 2, mouseY = H / 2;
  let ringX = W / 2, ringY = H / 2;
  let sparkles = [];

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Spawn 4-point Diamond Starbursts
    if (Math.random() > 0.35) {
      sparkles.push({
        x: mouseX + (Math.random() - 0.5) * 14,
        y: mouseY + (Math.random() - 0.5) * 14,
        size: Math.random() * 5 + 3,
        alpha: 1,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        color: Math.random() > 0.4 ? '#f3d375' : '#ffffff',
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0 - 0.4
      });
    }
  });

  // Burst starburst on click
  document.addEventListener('click', e => {
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 / 18) * i;
      const speed = Math.random() * 3.5 + 1.5;
      sparkles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 7 + 4,
        alpha: 1,
        rotation: Math.random() * Math.PI,
        rotSpeed: 0.15,
        color: i % 2 === 0 ? '#f3d375' : '#ffffff',
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      });
    }
  });

  function draw4PointStar(cx, cy, spikes, outerRadius, innerRadius, rot) {
    let rotAngle = Math.PI / 2 * 3 + rot;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rotAngle) * outerRadius;
      y = cy + Math.sin(rotAngle) * outerRadius;
      ctx.lineTo(x, y);
      rotAngle += step;

      x = cx + Math.cos(rotAngle) * innerRadius;
      y = cy + Math.sin(rotAngle) * innerRadius;
      ctx.lineTo(x, y);
      rotAngle += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Spring ring cursor
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    // Render 4-point Diamond Starbursts
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotSpeed;
      s.alpha -= 0.022;

      if (s.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.shadowColor = '#d4af37';
      ctx.shadowBlur = 10;
      draw4PointStar(s.x, s.y, 4, s.size, s.size * 0.28, s.rotation);
      ctx.restore();
    }

    requestAnimationFrame(loop);
  }
  loop();

  // Hover detection
  document.querySelectorAll('a, button, .skill-facet-box, .master-project-card, .concierge-link-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });
})();

/* ============================================================
   3. ROYAL WELCOME SCREEN TRIGGER
   ============================================================ */
(function initRoyalWelcome() {
  const intro = document.getElementById('introScreen');
  const enterBtn = document.getElementById('enterButton');

  if (!intro || !enterBtn) return;

  enterBtn.addEventListener('click', () => {
    intro.classList.add('leaving');
    document.body.classList.remove('locked');

    // Tự động kích hoạt phát nhạc bài "Ông Bà Già Tao Lo Hết"
    setTimeout(() => {
      if (typeof MusicPlayer !== 'undefined') {
        MusicPlayer.playTrack(3, true);
      }
    }, 450);

    setTimeout(() => {
      intro.style.display = 'none';
    }, 1150);
  });
})();

/* ============================================================
   4. NAVIGATION & ACTIVE HIGHLIGHT
   ============================================================ */
(function initNav() {
  const header = document.getElementById('mainHeader');
  const menuBtn = document.getElementById('menuButton');
  const navLinks = document.getElementById('navlinks');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 35);
    }
    highlightNav();
  }, { passive: true });

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function highlightNav() {
    let curr = 'home';
    const pos = window.scrollY + 200;

    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        curr = sec.id;
      }
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === curr);
    });
  }
})();

/* ============================================================
   5. HERO TYPING EFFECT
   ============================================================ */
(function initTyping() {
  const out = document.getElementById('typingText');
  if (!out) return;

  const phrases = [
    'Software Engineer ⚜️',
    'Full-Stack Developer 💻',
    'Database Architect 🏛️',
    'IoT Systems Explorer 🌐',
    'UTH IT Student 🎓'
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function run() {
    const text = phrases[pIdx];

    if (!deleting) {
      out.textContent = text.substring(0, ++cIdx);
      if (cIdx === text.length) {
        deleting = true;
        setTimeout(run, 2200);
        return;
      }
    } else {
      out.textContent = text.substring(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }

    setTimeout(run, deleting ? 40 : 85);
  }

  setTimeout(run, 1200);
})();

/* ============================================================
   6. METRIC COUNTERS & AOS REVEAL
   ============================================================ */
(function initCountersAndAOS() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let curr = 0;
        const step = Math.floor(1200 / (target || 1));
        const timer = setInterval(() => {
          curr++;
          el.textContent = curr + '+';
          if (curr >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          }
        }, step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObs.observe(c));

  // Pure Smooth CSS AOS Fade
  const fadeEls = document.querySelectorAll('[data-aos]');
  const aosObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px)';
    el.style.transition = 'opacity 0.85s cubic-bezier(0.19, 1, 0.22, 1), transform 0.85s cubic-bezier(0.19, 1, 0.22, 1)';
    aosObs.observe(el);
  });
})();

/* ============================================================
   7. 3D PROJECT TILT & MOUSE SPOTLIGHT
   ============================================================ */
(function initTiltAndSpotlight() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.master-project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const tiltX = (x / rect.width - 0.5) * 12;
      const tiltY = (y / rect.height - 0.5) * -12;

      card.style.transform = `perspective(900px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) translateY(-10px)`;

      const spot = card.querySelector('.card-mouse-spotlight');
      if (spot) {
        spot.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(243, 211, 117, 0.15) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const spot = card.querySelector('.card-mouse-spotlight');
      if (spot) spot.style.background = '';
    });
  });
})();

/* ============================================================
   8. MAGNETIC LUXURY BUTTONS
   ============================================================ */
(function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const btns = document.querySelectorAll('.magnetic-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ============================================================
   9. ULTRA LUXURY MUSIC PLAYER ENGINE (HTML5)
   ============================================================ */
const MusicPlayer = (() => {
  const TRACKS = [
    {
      title:  'Em Của Ngày Hôm Qua',
      artist: 'Sơn Tùng M-TP',
      src:    'assets/music/Em-Cua-Ngay-Hom-Qua-Son-Tung-M-TP.mp3'
    },
    {
      title:  'Nắng Ấm Xa Dần',
      artist: 'Sơn Tùng M-TP',
      src:    'assets/music/Nang-Am-Xa-Dan-Son-Tung-M-TP.mp3'
    },
    {
      title:  'Hãy Trao Cho Anh',
      artist: 'Sơn Tùng M-TP • Snoop Dogg',
      src:    'assets/music/Hay-Trao-Cho-Anh-Son-Tung-M-TP-Snoop-Dogg.mp3'
    },
    {
      title:  'Ông Bà Già Tao Lo Hết',
      artist: 'BÌNH GOLD ft. SHADY',
      src:    'assets/music/BÌNH GOLD ft SHADY ÔNG BÀ GIÀ TAO LO HẾT I m worried about all of them Official MV 1080p.mp3'
    }
  ];

  const player = document.getElementById('musicPlayer');
  const audio = document.getElementById('audioPlayer');
  const titleEl = document.getElementById('mpTitle');
  const artistEl = document.getElementById('mpArtist');
  const playBtn = document.getElementById('mpPlay');
  const prevBtn = document.getElementById('mpPrev');
  const nextBtn = document.getElementById('mpNext');
  const muteBtn = document.getElementById('mpMute');
  const volumeSlider = document.getElementById('mpVolume');
  const progressBar = document.getElementById('mpProgressBar');
  const progressFill = document.getElementById('mpProgressFill');
  const progressThumb = document.getElementById('mpProgressThumb');
  const currentTimeEl = document.getElementById('mpCurrentTime');
  const durationEl = document.getElementById('mpDuration');
  const playlistToggle = document.getElementById('mpPlaylistToggle');
  const playlistEl = document.getElementById('mpPlaylist');
  const noticeEl = document.getElementById('mpNotice');
  const trackBtns = document.querySelectorAll('.mp-track');

  const iconPlay = playBtn ? playBtn.querySelector('.icon-play') : null;
  const iconPause = playBtn ? playBtn.querySelector('.icon-pause') : null;

  let currentIdx = 3; // Mặc định bài Ông Bà Già Tao Lo Hết
  let isPlaying = false;
  let isScrubbing = false;

  function fmtTime(sec) {
    if (!isFinite(sec) || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    if (player) player.classList.toggle('playing', playing);
    if (iconPlay) iconPlay.style.display = playing ? 'none' : 'block';
    if (iconPause) iconPause.style.display = playing ? 'block' : 'none';
  }

  function updatePlaylistUI() {
    trackBtns.forEach(btn => {
      const idx = parseInt(btn.dataset.index, 10);
      const active = idx === currentIdx;
      btn.classList.toggle('active', active);
      const status = btn.querySelector('.mp-track-status');
      if (status) {
        status.innerHTML = active 
          ? `<span class="mp-eq-mini"><span></span><span></span><span></span></span>`
          : '–';
      }
    });
  }

  function loadTrack(index, autoplay = false) {
    currentIdx = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    const track = TRACKS[currentIdx];

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (durationEl) durationEl.textContent = '0:00';
    if (progressFill) progressFill.style.width = '0%';
    if (noticeEl) noticeEl.textContent = '';

    updatePlaylistUI();

    audio.pause();
    audio.src = encodeURI(track.src);
    audio.load();

    if (autoplay) {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => setPlayingState(true))
         .catch(err => {
           setPlayingState(false);
           console.warn("Autoplay waiting for interaction:", err);
         });
      }
    } else {
      setPlayingState(false);
    }
  }

  audio.addEventListener('timeupdate', () => {
    if (isScrubbing || !isFinite(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressThumb) progressThumb.style.right = (100 - pct) + '%';
    if (currentTimeEl) currentTimeEl.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (durationEl) durationEl.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    loadTrack(currentIdx + 1, true); // Auto next
  });

  audio.addEventListener('play', () => setPlayingState(true));
  audio.addEventListener('pause', () => setPlayingState(false));

  audio.addEventListener('error', () => {
    setPlayingState(false);
    const t = TRACKS[currentIdx];
    if (noticeEl) {
      noticeEl.textContent = `⚠️ Không thể mở file "${t.title}". Vui lòng kiểm tra lại assets/music/.`;
    }
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.readyState === 0) {
        loadTrack(currentIdx, true);
        return;
      }
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(e => console.warn(e));
      }
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => loadTrack(currentIdx - 1, true));
  if (nextBtn) nextBtn.addEventListener('click', () => loadTrack(currentIdx + 1, true));

  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      loadTrack(idx, true);
    });
  });

  if (playlistToggle && playlistEl) {
    playlistToggle.addEventListener('click', () => {
      const hidden = !playlistEl.hidden;
      playlistEl.hidden = hidden;
      playlistToggle.classList.toggle('active', !hidden);
      playlistToggle.setAttribute('aria-expanded', String(!hidden));
    });
  }

  // Scrubbing
  function seekTo(e) {
    if (!progressBar || !isFinite(audio.duration)) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
    if (progressFill) progressFill.style.width = (pct * 100) + '%';
    if (progressThumb) progressThumb.style.right = (100 - pct * 100) + '%';
  }

  if (progressBar) {
    progressBar.addEventListener('mousedown', e => {
      isScrubbing = true;
      seekTo(e);
    });
    document.addEventListener('mousemove', e => {
      if (isScrubbing) seekTo(e);
    });
    document.addEventListener('mouseup', () => {
      isScrubbing = false;
    });

    progressBar.addEventListener('touchstart', e => {
      isScrubbing = true;
      seekTo(e.touches[0]);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (isScrubbing) seekTo(e.touches[0]);
    }, { passive: true });
    document.addEventListener('touchend', () => {
      isScrubbing = false;
    });
  }

  if (volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value);
    volumeSlider.addEventListener('input', () => {
      audio.volume = parseFloat(volumeSlider.value);
      audio.muted = false;
      updateMuteIcon(false);
    });
  }

  function updateMuteIcon(muted) {
    const iconVol = muteBtn ? muteBtn.querySelector('.icon-vol') : null;
    const iconMute = muteBtn ? muteBtn.querySelector('.icon-mute') : null;
    if (iconVol) iconVol.style.display = muted ? 'none' : 'block';
    if (iconMute) iconMute.style.display = muted ? 'block' : 'none';
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      updateMuteIcon(audio.muted);
    });
  }

  // Sẵn sàng track 3: Ông Bà Già Tao Lo Hết
  loadTrack(3, false);

  return {
    playTrack: (idx, autoplay) => loadTrack(idx, autoplay)
  };
})();

/* ============================================================
   10. YEAR & BACK TO TOP
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
