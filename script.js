/* ==========================================================================
   WAJIT R. SHAIKH - 3D INTERACTIVE ENGINE & ANIMATIONS
   Inspired by dungyov.com (3D Starfield Canvas, Card Perspective Tilt & Cursor Tracking)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. CUSTOM 3D CURSOR FOLLOWER WITH LERP
     ------------------------------------------------------------------------ */
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Expand cursor on interactive elements hover
  const hoverables = document.querySelectorAll('a, button, .tilt-card, .skill-chip, input, textarea');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('active'));
  });

  /* ------------------------------------------------------------------------
     2. 3D STARFIELD SPACE CANVAS (dungyov "scroll to fly" effect)
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('particles-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const numStars = 250;
    let cameraZ = 0;
    let targetCameraZ = 0;
    let tiltX = 0;
    let tiltY = 0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star3D {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * canvas.width * 2;
        this.y = (Math.random() - 0.5) * canvas.height * 2;
        this.z = Math.random() * 1000 + 1;
        this.size = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
      }

      update() {
        this.z -= 0.8;
        if (this.z <= 0) {
          this.reset();
          this.z = 1000;
        }
      }

      draw() {
        const k = 400 / this.z;
        const px = this.x * k + canvas.width / 2 + tiltX * 20;
        const py = this.y * k + canvas.height / 2 + tiltY * 20;
        const size = Math.max(0.1, this.size * k);

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const alpha = (1 - this.z / 1000) * this.opacity;
          ctx.fillStyle = `rgba(192, 132, 252, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star3D());
    }

    window.addEventListener('mousemove', (e) => {
      tiltX = (e.clientX / window.innerWidth - 0.5);
      tiltY = (e.clientY / window.innerHeight - 0.5);
    });

    window.addEventListener('scroll', () => {
      targetCameraZ = window.scrollY * 0.5;
    });

    function animateSpace() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cameraZ += (targetCameraZ - cameraZ) * 0.1;

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      requestAnimationFrame(animateSpace);
    }

    animateSpace();
  }

  /* ------------------------------------------------------------------------
     3. REAL-TIME 3D CARD PERSPECTIVE TILT & SPOTLIGHT REFLECTION
     ------------------------------------------------------------------------ */
  const tiltCards = document.querySelectorAll('.tilt-card, .hero-profile-frame');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Pass mouse coordinates for CSS light spot
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ------------------------------------------------------------------------
     4. HEADER SCROLL & SECTION INDICATOR TRACKER
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const sectionNameIndicator = document.getElementById('current-section-name');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navLink) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
        if (sectionNameIndicator) {
          sectionNameIndicator.textContent = `SECTION: ${sectionId.toUpperCase()}`;
        }
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. SCROLL ENTRANCE REVEAL (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-3d');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------------
     6. ANIMATED STATS COUNTER
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function runStatsAnimation() {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const duration = 1600;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + '+';
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  }

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          runStatsAnimation();
          animatedStats = true;
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsStrip);
  }

  /* ------------------------------------------------------------------------
     7. CONTACT FORM SUBMIT
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      alert(`Thank you ${name}! Your message has been sent successfully. Mr. Wajit R. Shaikh will get back to you shortly.`);
      contactForm.reset();
    });
  }

});

/* ------------------------------------------------------------------------
   8. RESEARCH PAPER MODAL HANDLER
   ------------------------------------------------------------------------ */
const paperDetails = {
  paper1: {
    title: "Custom Honeypot For SSH and Telnet Intrusion Detection: A Comprehensive Review",
    journal: "International Journal of Engineering Development and Research (IJEDR)",
    issn: "2321-9939",
    year: "2025",
    authors: "Mr. Wajit R. Shaikh",
    abstract: "SSH and Telnet protocols remain prime targets for unauthorized access and automated brute-force botnets across computer networks. This research paper presents a comprehensive design and evaluation of a custom multi-stage honeypot tailored specifically for SSH and Telnet intrusion detection. By emulating interactive terminal prompts and logging full keystroke session logs, packet payloads, and attacker IP demographics, the system provides vital threat intelligence for proactively identifying zero-day exploits, dictionary attacks, and malicious botnet activity in real-time."
  },
  paper2: {
    title: "Security & Privacy Implications of Malicious Third-Party Alexa Skills: Voice Phishing",
    journal: "Journal of Emerging Technologies and Innovative Research (JETIR)",
    issn: "2349-5162",
    year: "2025",
    authors: "Mr. Wajit R. Shaikh",
    abstract: "As smart voice assistants penetrate modern homes and enterprise environments, voice user interfaces (VUI) introduce novel attack vectors. This paper conducts a case study on malicious third-party Alexa Skills and voice-based phishing ('vishing'). We analyze skill squatted invocations, voice prompt eavesdropping, and deceptive authentication prompts designed to steal user credentials. The study provides mitigation frameworks for voice app developers and platform auditors to enforce strict privacy compliance."
  },
  paper3: {
    title: "Krushi Sarthi Android Application",
    journal: "International Journal of Advance Research & Innovative Ideas in Education (IJARIIE)",
    issn: "Paper ID: 18938",
    year: "2022",
    authors: "Mr. Wajit R. Shaikh",
    abstract: "The Krushi Sarthi Android Application is an agricultural tech solution developed to bridge information gaps for rural farming communities. The system integrates real-time crop disease diagnosis, localized weather alerts, market rate trends, and direct government scheme advisories. Built with an intuitive multilingual UI/UX, the application empowers farmers with data-driven decision support to optimize yield and streamline market access."
  }
};

function openPaperModal(paperKey) {
  const paper = paperDetails[paperKey];
  if (!paper) return;

  const contentWrap = document.getElementById('paper-modal-content');
  contentWrap.innerHTML = `
    <span style="font-family: var(--font-code); color: var(--accent-neon); font-size: 0.85rem; letter-spacing: 1px;">
      // PUBLISHED RESEARCH PAPER
    </span>
    <h2 style="font-family: var(--font-heading); color: #fff; font-size: 1.6rem; margin: 0.5rem 0 1rem 0; line-height: 1.3;">
      ${paper.title}
    </h2>
    <div style="background: rgba(11, 9, 34, 0.7); padding: 1.1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.5rem; font-size: 0.95rem;">
      <p style="color: var(--accent-neon); margin-bottom: 0.3rem;"><strong>Journal:</strong> ${paper.journal}</p>
      <p style="color: var(--text-muted); margin-bottom: 0.3rem;"><strong>Identifier:</strong> ${paper.issn} | <strong>Year:</strong> ${paper.year}</p>
      <p style="color: var(--text-muted);"><strong>Author:</strong> ${paper.authors}</p>
    </div>
    <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 0.5rem;"><i class="fa-solid fa-align-left"></i> Abstract Overview</h3>
    <p style="color: var(--text-muted); line-height: 1.8; font-size: 1rem; margin-bottom: 1.75rem;">
      ${paper.abstract}
    </p>
    <button class="btn btn-purple" onclick="closePaperModal()">Close Preview</button>
  `;

  document.getElementById('paper-modal').classList.add('active');
}

function closePaperModal() {
  document.getElementById('paper-modal').classList.remove('active');
}
