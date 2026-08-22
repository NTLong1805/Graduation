/* =========================================================
   GRADUATION INVITATION — SCRIPT
   Vanilla JavaScript, no dependencies.
   ========================================================= */

/* =========================================================
   1. CONFIG — edit everything here, nothing else.
   ========================================================= */
const CONFIG = {
  graduateName: "Nguyễn Thành Long",

  // Event date/time — used by hero, event cards and countdown.
  // Format: "YYYY-MM-DDTHH:mm:ss" (24h clock), local time.
  eventDateTimeISO: "2026-09-07T16:00:00",
  eventDateDisplay: "07.09.2026",
  eventDayDisplay: "Thứ Hai",
  eventTimeDisplay: "16:00 PM",

  venueName: "Hội trường",
  schoolName: "Đại học Giao Thông Vận Tải",
  city: "Hà Nội",
  fullAddress: "Hội trường, Đại học Giao Thông Vận Tải, Hà Nội",
  cohort: "Khóa 2022–2026",

  // Google Maps: link used by the "Xem trên Google Maps" button.
  googleMapsUrl: "https://maps.app.goo.gl/PeGucviTjLzUNyYv5",
  // Optional separate embed URL for the iframe (leave null to derive one from fullAddress)
  googleMapsEmbedUrl: null,

  contactEmail: "your-email@example.com",

  invitationMessage: [
    "Sau những năm tháng học tập và trưởng thành, mình đã chính thức hoàn thành một hành trình rất đáng nhớ.",
    "Đây là một cột mốc đặc biệt đối với mình, và mình rất mong bạn có thể đến chung vui trong ngày quan trọng này.",
    "Sự có mặt của bạn sẽ khiến ngày hôm ấy trở nên ý nghĩa hơn rất nhiều."
  ],

  journey: [
    { year: "2022", text: "Bắt đầu hành trình đại học" },
    { year: "2023", text: "Những năm tháng đáng nhớ" },
    { year: "2025", text: "Hoàn thành những cột mốc quan trọng" },
    { year: "2026", text: "GRADUATION 🎓", final: true }
  ],

  // Gallery photos — put real files in assets/images/ and list them here.
  // Leave empty to show elegant placeholder tiles instead.
  galleryImages: [
    // "assets/images/photo-1.jpg",
    // "assets/images/photo-2.jpg",
  ],
  galleryCount: 6 // used only when galleryImages is empty, to size the placeholder grid
};

/* =========================================================
   2. HELPERS
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function applyConfigToDOM() {
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };

  setText("graduateName", CONFIG.graduateName);
  setText("footerName", CONFIG.graduateName);

  setText("heroDate", CONFIG.eventDateDisplay);
  setText("heroTime", CONFIG.eventTimeDisplay);
  setText("heroVenue", `${CONFIG.venueName}, ${CONFIG.schoolName}`);

  setText("eventDate", CONFIG.eventDateDisplay);
  setText("eventDay", CONFIG.eventDayDisplay);
  setText("eventTime", CONFIG.eventTimeDisplay);
  setText("eventVenue", CONFIG.venueName);
  setText("eventSchool", CONFIG.schoolName);
  setText("eventCity", CONFIG.city);
  setText("eventCohort", CONFIG.cohort);

  setText("locationVenue", CONFIG.venueName);
  setText("locationAddress", CONFIG.fullAddress);

  const mapsLink = document.getElementById("mapsLink");
  if (mapsLink) mapsLink.href = CONFIG.googleMapsUrl;

  const mapEmbed = document.getElementById("mapEmbed");
  if (mapEmbed && CONFIG.googleMapsEmbedUrl) mapEmbed.src = CONFIG.googleMapsEmbedUrl;

  // Invitation letter
  const letterEl = document.getElementById("invitationMessage");
  if (letterEl && CONFIG.invitationMessage?.length) {
    letterEl.innerHTML = CONFIG.invitationMessage.map(p => `<p>${p}</p>`).join("");
  }

  // Journey timeline
  const timelineEl = document.getElementById("timeline");
  if (timelineEl && CONFIG.journey?.length) {
    timelineEl.innerHTML = CONFIG.journey.map(item => `
      <div class="timeline-item ${item.final ? "timeline-final" : ""}" data-reveal>
        <div class="timeline-dot ${item.final ? "timeline-dot-final" : ""}">
          ${item.final ? '<i class="fa-solid fa-graduation-cap"></i>' : ""}
        </div>
        <div class="timeline-content">
          <p class="timeline-year">${item.year}</p>
          <p class="timeline-text">${item.text}</p>
        </div>
      </div>
    `).join("");
  }

  // Gallery
  const galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid) {
    const icons = ["fa-graduation-cap", "fa-scroll", "fa-star", "fa-heart", "fa-award", "fa-hat-cowboy"];
    if (CONFIG.galleryImages?.length) {
      galleryGrid.innerHTML = CONFIG.galleryImages.map((src, i) => `
        <div class="gallery-item" data-reveal data-index="${i}">
          <img src="${src}" alt="Khoảnh khắc tốt nghiệp ${i + 1}" loading="lazy">
        </div>
      `).join("");
    } else {
      const count = CONFIG.galleryCount || 6;
      galleryGrid.innerHTML = Array.from({ length: count }).map((_, i) => `
        <div class="gallery-item" data-reveal>
          <div class="gallery-fallback"><i class="fa-solid ${icons[i % icons.length]}"></i></div>
        </div>
      `).join("");
    }
  }
}

/* =========================================================
   3. OPENING SCREEN
   ========================================================= */
function initOpeningScreen() {
  const openingScreen = document.getElementById("opening-screen");
  const mainSite = document.getElementById("main-site");
  const openBtn = document.getElementById("openInviteBtn");
  const particlesWrap = document.getElementById("openingParticles");

  // Ambient gold particles
  const PARTICLE_COUNT = 22;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    p.className = "opening-particle";
    const size = 2 + Math.random() * 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-${Math.random() * 20}px`;
    p.style.animationDuration = `${8 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    particlesWrap.appendChild(p);
  }

  function openInvite() {
    openingScreen.classList.add("hidden");
    document.body.style.overflow = "";
    mainSite.classList.add("visible");
    initRevealObserver(); // start scroll reveals once site is visible
    openingScreen.addEventListener("transitionend", () => {
      openingScreen.style.display = "none";
    }, { once: true });
  }

  document.body.style.overflow = "hidden";
  openBtn.addEventListener("click", openInvite);
}

/* =========================================================
   4. NAVIGATION — scroll style, active link, mobile menu
   ========================================================= */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const links = $$(".nav-link");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // Active section highlight
  const sections = links
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle("active", l.dataset.section === id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));
}

/* =========================================================
   5. SCROLL REVEAL
   ========================================================= */
let revealObserver = null;
function initRevealObserver() {
  if (revealObserver) return;
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("in-view"), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  $$("[data-reveal]").forEach(el => revealObserver.observe(el));
}

/* =========================================================
   6. COUNTDOWN
   ========================================================= */
function initCountdown() {
  const target = new Date(CONFIG.eventDateTimeISO).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds")
  };
  const grid = document.getElementById("countdown");
  const todayMsg = document.getElementById("countdownToday");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      grid.hidden = true;
      todayMsg.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* =========================================================
   7. GALLERY LIGHTBOX
   ========================================================= */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");

  document.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item img");
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* =========================================================
   8. RSVP FORM
   ========================================================= */
function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");
  const formStatus = document.getElementById("formStatus");
  const thankYou = document.getElementById("thankYou");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const attendanceError = document.getElementById("attendanceError");

  // "GỬI LỜI CHÚC" hero button focuses the message field once scrolled to RSVP
  const wishBtn = document.querySelector("[data-wish-btn]");
  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      setTimeout(() => messageInput.focus(), 500);
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearErrors() {
    [nameError, emailError, attendanceError].forEach(el => (el.textContent = ""));
    [nameInput, emailInput].forEach(el => el.classList.remove("invalid"));
    formStatus.textContent = "";
    formStatus.classList.remove("success");
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = "Vui lòng nhập họ và tên.";
      nameInput.classList.add("invalid");
      valid = false;
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = "Vui lòng nhập email.";
      emailInput.classList.add("invalid");
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      emailError.textContent = "Email không hợp lệ.";
      emailInput.classList.add("invalid");
      valid = false;
    }

    const attendance = form.querySelector('input[name="attendance"]:checked');
    if (!attendance) {
      attendanceError.textContent = "Vui lòng chọn xác nhận tham dự.";
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      attendance: form.querySelector('input[name="attendance"]:checked').value,
      message: messageInput.value.trim()
    };

    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoading.hidden = false;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Request failed");

      showThankYou();
    } catch (err) {
      formStatus.textContent = "Không thể gửi thông tin. Vui lòng thử lại sau.";
      formStatus.classList.remove("success");
    } finally {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoading.hidden = true;
    }
  });

  function showThankYou() {
    form.style.transition = "opacity .4s ease";
    form.style.opacity = "0";
    setTimeout(() => {
      form.hidden = true;
      thankYou.hidden = false;
      launchConfetti();
    }, 400);
  }
}

/* =========================================================
   9. CONFETTI (canvas, vanilla)
   ========================================================= */
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.opacity = "1";

  const colors = ["#D4AF37", "#E7C766", "#F7F3E9", "#1B263B"];
  const pieces = Array.from({ length: 90 }).map(() => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: -1.5 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: -6 + Math.random() * 12
  }));

  let frame = 0;
  const maxFrames = 260;

  function draw() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.transition = "opacity .6s ease";
      canvas.style.opacity = "0";
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 600);
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* =========================================================
   10. INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyConfigToDOM();
  initOpeningScreen();
  initNavigation();
  initCountdown();
  initLightbox();
  initRsvpForm();
});
