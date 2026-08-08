/* 
  Figma Portfolio Interactive Script - Wajit Shaikh
*/

const paperData = {
    paper1: {
        title: "Custom Honeypot For SSH and Telnet Intrusion Detection: A Comprehensive Review",
        journal: "IJEDR (2025)",
        issn: "ISSN: 2321-9939",
        abstract: "Network security intrusion detection decoy systems play a critical role in proactive threat intelligence. This paper presents a custom-built low-interaction honeypot framework specifically engineered to capture unauthorized SSH and Telnet login attempts, command payloads, and automated brute-force scripts. The system logs keystrokes, attacker IPs, and exploit patterns in real-time, providing actionable cyber security insights for enterprise network defense."
    },
    paper2: {
        title: "Security & Privacy Implications of Malicious Third-Party Alexa Skills: A Case Study on Voice-Based Phishing Attacks",
        journal: "JETIR (2025)",
        issn: "ISSN: 2349-5162",
        abstract: "As smart voice assistants become ubiquitous in homes and offices, third-party voice apps ('skills') present novel attack vectors. This study analyzes voice phishing ('vishing'), invocation name squatting, and background eavesdropping in Amazon Alexa skills. We propose security recommendations for developer verification and runtime voice intent sanitization."
    },
    paper3: {
        title: "Krushi Sarthi Android Application",
        journal: "IJARIIE (2022)",
        issn: "Paper ID: 18938",
        abstract: "Agricultural productivity in rural India benefits significantly from real-time mobile decision support systems. Krushi Sarthi is an Android application developed to provide farmers with localized crop advisory services, real-time APMC market crop prices, weather alerts, and direct expert consultation, bridging technology adoption gaps in farming communities."
    }
};

function openPaperModal(paperId) {
    const modal = document.getElementById('paper-modal');
    const modalContent = document.getElementById('paper-modal-content');
    const paper = paperData[paperId];

    if (modal && modalContent && paper) {
        modalContent.innerHTML = `
            <div style="font-size: 0.85rem; color: var(--accent-orange); font-family: var(--font-code); font-weight: 600; margin-bottom: 0.5rem;">
                ${paper.journal} | ${paper.issn}
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff; line-height: 1.4; margin-bottom: 1.25rem;">
                ${paper.title}
            </h3>
            <div style="background: #171717; padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.98rem; line-height: 1.75;">
                <strong style="color: #fff; display: block; margin-bottom: 0.5rem;">Abstract:</strong>
                ${paper.abstract}
            </div>
        `;
        modal.classList.add('active');
    }
}

function closePaperModal() {
    const modal = document.getElementById('paper-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Close modal on click outside
    const modal = document.getElementById('paper-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePaperModal();
            }
        });
    }

    // 1. Mobile Menu Drawer Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // 2. Header Background on Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function runStatsAnimation() {
        if (animatedStats) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let count = 0;
            const increment = Math.ceil(target / 40);
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.innerText = target + '+';
                    clearInterval(timer);
                } else {
                    stat.innerText = count + '+';
                }
            }, 35);
        });
        
        animatedStats = true;
    }

    // Trigger stats animation when visible
    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runStatsAnimation();
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsStrip);
    }

    // 4. Figma Circular Skill Gauges Animation
    const progressCircles = document.querySelectorAll('.circle-progress');
    let animatedGauges = false;

    function animateSkillGauges() {
        if (animatedGauges) return;

        progressCircles.forEach(circle => {
            const targetPercent = parseInt(circle.getAttribute('data-progress'), 10);
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius; // ~339.29
            
            const offset = circumference - (targetPercent / 100) * circumference;
            circle.style.strokeDasharray = `${circumference}`;
            circle.style.strokeDashoffset = `${offset}`;
        });

        animatedGauges = true;
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateSkillGauges();
            }
        }, { threshold: 0.3 });
        skillsObserver.observe(skillsSection);
    }

    // 5. Portfolio Filter Tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // 6. Contact Form Handler
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fname = document.getElementById('contact-fname')?.value.trim() || 'Friend';
            const lname = document.getElementById('contact-lname')?.value.trim() || '';
            const email = document.getElementById('contact-email')?.value.trim() || '';
            const phone = document.getElementById('contact-phone')?.value.trim() || 'Not provided';
            const hireFor = document.getElementById('contact-hire-for')?.value.trim() || 'Not provided';
            const message = document.getElementById('contact-message')?.value.trim() || '';

            const recipient = 'wajitshaikh02@gmail.com';
            const subject = `Portfolio Contact Form - ${fname} ${lname}`.trim();
            const body = [
                `Name: ${fname} ${lname}`.trim(),
                `Email: ${email}`,
                `Phone: ${phone}`,
                `Hire For: ${hireFor}`,
                '',
                'Message:',
                message
            ].join('\n');

            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
            alert(`Thank you ${fname} ${lname}! Your email app will open with your message ready to send to ${recipient}.`);
            contactForm.reset();
        });
    }
});
