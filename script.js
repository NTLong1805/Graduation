/* =========================================================
   GRADUATION INVITATION — SCRIPT
   Vanilla JavaScript + EmailJS
   ========================================================= */

/* =========================================================
   1. CONFIG
   ========================================================= */
const CONFIG = {
  graduateName: "Nguyễn Thành Long",

  // Event date/time
  eventDateTimeISO: "2026-09-07T16:00:00",
  eventDateDisplay: "07.09.2026",
  eventDayDisplay: "Thứ Hai",
  eventTimeDisplay: "16:00 PM",

  venueName: "Hội trường",
  schoolName: "Đại học Giao Thông Vận Tải",
  city: "Hà Nội",
  fullAddress: "Hội trường, Đại học Giao Thông Vận Tải, Hà Nội",
  cohort: "Khóa 2022–2026",

  // Google Maps
  googleMapsUrl: "https://maps.app.goo.gl/PeGucviTjLzUNyYv5",
  googleMapsEmbedUrl: null,

  // Email nhận thông báo RSVP
  contactEmail: "longprolc10@gmail.com",

  /* =======================================================
     EMAILJS CONFIGURATION
     ======================================================= */
  emailjs: {
    publicKey: "sXuAz3C9uJoehYJA-",
    serviceId: "service_rxquwrp",
    templateId: "template_bfleu1c",
  },

  invitationMessage: [
    "Sau những năm tháng học tập và trưởng thành, mình đã chính thức hoàn thành một hành trình rất đáng nhớ.",
    "Đây là một cột mốc đặc biệt đối với mình, và mình rất mong bạn có thể đến chung vui trong ngày quan trọng này.",
    "Sự có mặt của bạn sẽ khiến ngày hôm ấy trở nên ý nghĩa hơn rất nhiều.",
  ],

  journey: [
    { year: "2022", text: "Bắt đầu hành trình đại học" },
    { year: "2023", text: "Những năm tháng đáng nhớ" },
    { year: "2025", text: "Hoàn thành những cột mốc quan trọng" },
    { year: "2026", text: "GRADUATION 🎓", final: true },
  ],

  galleryImages: [
    // "assets/images/photo-1.jpg",
    // "assets/images/photo-2.jpg",
  ],

  galleryCount: 6,
};

/* =========================================================
   2. HELPERS
   ========================================================= */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* =========================================================
   3. APPLY CONFIG TO DOM
   ========================================================= */

function applyConfigToDOM() {
  const setText = (id, value) => {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = value;
    }
  };

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

  /* Google Maps */

  const mapsLink = document.getElementById("mapsLink");

  if (mapsLink) {
    mapsLink.href = CONFIG.googleMapsUrl;
  }

  const mapEmbed = document.getElementById("mapEmbed");

  if (mapEmbed && CONFIG.googleMapsEmbedUrl) {
    mapEmbed.src = CONFIG.googleMapsEmbedUrl;
  }

  /* Invitation letter */

  const letterEl = document.getElementById("invitationMessage");

  if (letterEl && CONFIG.invitationMessage?.length) {
    letterEl.innerHTML = CONFIG.invitationMessage
      .map((p) => `<p>${p}</p>`)
      .join("");
  }

  /* Timeline */

  const timelineEl = document.getElementById("timeline");

  if (timelineEl && CONFIG.journey?.length) {
    timelineEl.innerHTML = CONFIG.journey
      .map(
        (item) => `
          <div
            class="timeline-item ${item.final ? "timeline-final" : ""}"
            data-reveal
          >

            <div
              class="timeline-dot ${item.final ? "timeline-dot-final" : ""}"
            >

              ${item.final ? '<i class="fa-solid fa-graduation-cap"></i>' : ""}

            </div>

            <div class="timeline-content">

              <p class="timeline-year">
                ${item.year}
              </p>

              <p class="timeline-text">
                ${item.text}
              </p>

            </div>

          </div>
        `
      )
      .join("");
  }

  /* Gallery */

  const galleryGrid = document.getElementById("galleryGrid");

  if (galleryGrid) {
    const icons = [
      "fa-graduation-cap",
      "fa-scroll",
      "fa-star",
      "fa-heart",
      "fa-award",
      "fa-hat-cowboy",
    ];

    if (CONFIG.galleryImages?.length) {
      galleryGrid.innerHTML = CONFIG.galleryImages
        .map(
          (src, i) => `
            <div
              class="gallery-item"
              data-reveal
              data-index="${i}"
            >

              <img
                src="${src}"
                alt="Khoảnh khắc tốt nghiệp ${i + 1}"
                loading="lazy"
              >

            </div>
          `
        )
        .join("");
    } else {
      const count = CONFIG.galleryCount || 6;

      galleryGrid.innerHTML = Array.from({ length: count })
        .map(
          (_, i) => `
            <div
              class="gallery-item"
              data-reveal
            >

              <div class="gallery-fallback">

                <i
                  class="fa-solid ${icons[i % icons.length]}"
                ></i>

              </div>

            </div>
          `
        )
        .join("");
    }
  }
}

/* =========================================================
   4. EMAILJS
   ========================================================= */

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    /* EmailJS đã được load */

    if (window.emailjs) {
      resolve(window.emailjs);

      return;
    }

    /* Load EmailJS SDK */

    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

    script.async = true;

    script.onload = () => {
      if (window.emailjs) {
        resolve(window.emailjs);
      } else {
        reject(new Error("EmailJS SDK không được khởi tạo."));
      }
    };

    script.onerror = () => {
      reject(new Error("Không thể tải EmailJS SDK."));
    };

    document.head.appendChild(script);
  });
}

async function initEmailJS() {
  try {
    const emailjs = await loadEmailJS();

    emailjs.init({
      publicKey: CONFIG.emailjs.publicKey,

      limitRate: {
        id: "graduation-rsvp",

        throttle: 1000,
      },
    });

    console.log("EmailJS initialized successfully.");

    return true;
  } catch (error) {
    console.error("EmailJS initialization error:", error);

    return false;
  }
}

/* =========================================================
   5. OPENING SCREEN
   ========================================================= */

function initOpeningScreen() {
  const openingScreen = document.getElementById("opening-screen");

  const mainSite = document.getElementById("main-site");

  const openBtn = document.getElementById("openInviteBtn");

  const particlesWrap = document.getElementById("openingParticles");

  if (!openingScreen || !mainSite || !openBtn || !particlesWrap) {
    return;
  }

  /* Ambient particles */

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

    initRevealObserver();

    openingScreen.addEventListener(
      "transitionend",
      () => {
        openingScreen.style.display = "none";
      },
      { once: true }
    );
  }

  document.body.style.overflow = "hidden";

  openBtn.addEventListener("click", openInvite);
}

/* =========================================================
   6. NAVIGATION
   ========================================================= */

function initNavigation() {
  const navbar = document.getElementById("navbar");

  const navToggle = document.getElementById("navToggle");

  const navLinks = document.getElementById("navLinks");

  const links = $$(".nav-link");

  if (!navbar || !navToggle || !navLinks) {
    return;
  }

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");

    navLinks.classList.toggle("open");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");

      navLinks.classList.remove("open");
    });
  });

  const sections = links
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            links.forEach((link) => {
              link.classList.toggle("active", link.dataset.section === id);
            });
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",

        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }
}

/* =========================================================
   7. SCROLL REVEAL
   ========================================================= */

let revealObserver = null;

function initRevealObserver() {
  if (revealObserver || !("IntersectionObserver" in window)) {
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("in-view");
          }, i * 60);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,

      rootMargin: "0px 0px -60px 0px",
    }
  );

  $$("[data-reveal]").forEach((el) => revealObserver.observe(el));
}

/* =========================================================
   8. COUNTDOWN
   ========================================================= */

function initCountdown() {
  const target = new Date(CONFIG.eventDateTimeISO).getTime();

  const els = {
    days: document.getElementById("cd-days"),

    hours: document.getElementById("cd-hours"),

    minutes: document.getElementById("cd-minutes"),

    seconds: document.getElementById("cd-seconds"),
  };

  const grid = document.getElementById("countdown");

  const todayMsg = document.getElementById("countdownToday");

  if (!grid || !todayMsg) {
    return;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      grid.hidden = true;

      todayMsg.hidden = false;

      clearInterval(timer);

      return;
    }

    const days = Math.floor(diff / 86400000);

    const hours = Math.floor((diff / 3600000) % 24);

    const minutes = Math.floor((diff / 60000) % 60);

    const seconds = Math.floor((diff / 1000) % 60);

    if (els.days) els.days.textContent = pad(days);

    if (els.hours) els.hours.textContent = pad(hours);

    if (els.minutes) els.minutes.textContent = pad(minutes);

    if (els.seconds) els.seconds.textContent = pad(seconds);
  }

  tick();

  const timer = setInterval(tick, 1000);
}

/* =========================================================
   9. GALLERY LIGHTBOX
   ========================================================= */

function initLightbox() {
  const lightbox = document.getElementById("lightbox");

  const lightboxImg = document.getElementById("lightboxImg");

  const closeBtn = document.getElementById("lightboxClose");

  if (!lightbox || !lightboxImg || !closeBtn) {
    return;
  }

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
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });
}

/* =========================================================
   10. RSVP FORM + EMAILJS
   ========================================================= */

function initRsvpForm(emailJsReady) {
  const form = document.getElementById("rsvpForm");

  const submitBtn = document.getElementById("submitBtn");

  const formStatus = document.getElementById("formStatus");

  const thankYou = document.getElementById("thankYou");

  if (!form || !submitBtn || !formStatus || !thankYou) {
    console.error("RSVP form elements not found.");

    return;
  }

  const btnText = submitBtn.querySelector(".btn-text");

  const btnLoading = submitBtn.querySelector(".btn-loading");

  const nameInput = document.getElementById("name");

  const emailInput = document.getElementById("email");

  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");

  const emailError = document.getElementById("emailError");

  const attendanceError = document.getElementById("attendanceError");

  /* Hero button */

  const wishBtn = document.querySelector("[data-wish-btn]");

  if (wishBtn && messageInput) {
    wishBtn.addEventListener("click", () => {
      setTimeout(() => {
        messageInput.focus();
      }, 500);
    });
  }

  /* Email validation */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* Clear validation */

  function clearErrors() {
    [nameError, emailError, attendanceError]
      .filter(Boolean)
      .forEach((el) => (el.textContent = ""));

    [nameInput, emailInput]
      .filter(Boolean)
      .forEach((el) => el.classList.remove("invalid"));

    formStatus.textContent = "";

    formStatus.classList.remove("success");
  }

  /* Validate */

  function validate() {
    clearErrors();

    let valid = true;

    if (!nameInput.value.trim()) {
      if (nameError) {
        nameError.textContent = "Vui lòng nhập họ và tên.";
      }

      nameInput.classList.add("invalid");

      valid = false;
    }

    if (!emailInput.value.trim()) {
      if (emailError) {
        emailError.textContent = "Vui lòng nhập email.";
      }

      emailInput.classList.add("invalid");

      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      if (emailError) {
        emailError.textContent = "Email không hợp lệ.";
      }

      emailInput.classList.add("invalid");

      valid = false;
    }

    const attendance = form.querySelector('input[name="attendance"]:checked');

    if (!attendance) {
      if (attendanceError) {
        attendanceError.textContent = "Vui lòng chọn xác nhận tham dự.";
      }

      valid = false;
    }

    return valid;
  }

  /* Loading state */

  function setLoading(loading) {
    submitBtn.disabled = loading;

    if (btnText) {
      btnText.hidden = loading;
    }

    if (btnLoading) {
      btnLoading.hidden = !loading;
    }
  }

  /* =======================================================
     SEND EMAIL
     ======================================================= */

  async function sendRsvpEmail({
    toEmail,
    name,
    email,
    attendance,
    message,
    type,
  }) {
    const attendanceText =
      attendance === "yes" ? "Sẽ tham dự 🎉" : "Không thể tham dự";

    const templateParams = {
      /* Email recipient */

      to_email: toEmail,

      /* Recipient name */

      to_name: type === "guest" ? name : CONFIG.graduateName,

      /* Guest information */

      name: name,

      email: email,

      attendance: attendanceText,

      attendance_value: attendance,

      message: message || "(Không có lời chúc)",

      /* Event information */

      event_date: CONFIG.eventDateDisplay,

      event_time: CONFIG.eventTimeDisplay,

      event_day: CONFIG.eventDayDisplay,

      venue: CONFIG.venueName,

      school: CONFIG.schoolName,

      address: CONFIG.fullAddress,

      cohort: CONFIG.cohort,

      /* Graduate */

      graduate_name: CONFIG.graduateName,

      /* Email type */

      email_type: type === "guest" ? "Xác nhận tham dự" : "Thông báo RSVP",
    };

    console.log("Sending EmailJS:", templateParams);

    return window.emailjs.send(
      CONFIG.emailjs.serviceId,

      CONFIG.emailjs.templateId,

      templateParams
    );
  }

  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* Validate */

    if (!validate()) return;

    /* Check EmailJS */

    if (!emailJsReady || !window.emailjs) {
      formStatus.textContent =
        "Không thể kết nối EmailJS. Vui lòng tải lại trang và thử lại.";

      return;
    }

    /* Get form data */

    const attendance = form.querySelector(
      'input[name="attendance"]:checked'
    ).value;

    const payload = {
      name: nameInput.value.trim(),

      email: emailInput.value.trim(),

      attendance: attendance,

      message: messageInput ? messageInput.value.trim() : "",
    };

    /* Loading */

    setLoading(true);

    formStatus.textContent = "";

    try {
      /* =================================================
           EMAIL #1
           Gửi email xác nhận cho người tham dự
           ================================================= */

      await sendRsvpEmail({
        ...payload,

        toEmail: payload.email,

        type: "guest",
      });

      console.log("Guest confirmation email sent.");

      /* =================================================
           Wait 1.2 seconds
           ================================================= */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      /* =================================================
           EMAIL #2
           Gửi thông báo RSVP cho Long
           ================================================= */

      await sendRsvpEmail({
        ...payload,

        toEmail: CONFIG.contactEmail,

        type: "owner",
      });

      console.log("Owner notification email sent.");

      /* =================================================
           SUCCESS
           ================================================= */

      showThankYou();
    } catch (error) {
      console.error("========== EMAILJS ERROR ==========");
      console.error("Error object:", error);
      console.error("Status:", error?.status);
      console.error("Text:", error?.text);
      console.error("Message:", error?.message);
      console.error("===================================");

      formStatus.textContent = `EmailJS lỗi: ${
        error?.text || error?.message || "Không xác định"
      }`;
    } finally {
      setLoading(false);
    }
  });

  /* =======================================================
     THANK YOU
     ======================================================= */

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
   11. CONFETTI
   ========================================================= */

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");

  if (!canvas) return;

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

    rotationSpeed: -6 + Math.random() * 12,
  }));

  let frame = 0;

  const maxFrames = 260;

  function draw() {
    frame++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
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

      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 600);
    }
  }

  requestAnimationFrame(draw);
}

/* =========================================================
   12. RESIZE
   ========================================================= */

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confettiCanvas");

  if (canvas) {
    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;
  }
});

/* =========================================================
   13. INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  /* General website */

  applyConfigToDOM();

  initOpeningScreen();

  initNavigation();

  initCountdown();

  initLightbox();

  /* EmailJS */

  const emailJsReady = await initEmailJS();

  /* RSVP */

  initRsvpForm(emailJsReady);
});
