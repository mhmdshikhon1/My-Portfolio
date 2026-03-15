document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // 0. Particle Canvas Animation
    // ─────────────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const MAX_PARTICLES = 90;
        const CONNECTION_DISTANCE = 130;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x    = Math.random() * canvas.width;
                this.y    = Math.random() * canvas.height;
                this.vx   = (Math.random() - 0.5) * 0.4;
                this.vy   = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = '#00d4e4';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < MAX_PARTICLES; i++) particles.push(new Particle());

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.18;
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        ctx.strokeStyle = '#14b8a6';
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ─────────────────────────────────────────
    // 1. Intersection Observer — Fade-In
    // ─────────────────────────────────────────
    const observerOptions = {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => observer.observe(section));

    // ─────────────────────────────────────────
    // 2. Typing Effect for Role (single phrase loop)
    // ─────────────────────────────────────────
    const typedTextSpan = document.getElementById('typed-text');
    const ROLE = "Data Analyst";
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (isDeleting) {
            typedTextSpan.textContent = ROLE.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = ROLE.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === ROLE.length) {
            // Fully typed — pause before deleting
            isDeleting = true;
            setTimeout(type, 2200);
        } else if (isDeleting && charIndex === 0) {
            // Fully deleted — pause before retyping
            isDeleting = false;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 45 : 95);
        }
    }

    if (typedTextSpan) type();

    // ─────────────────────────────────────────
    // 3. Decipher / Matrix Effect for H1 (page-stable)
    //    Lock the h1 width before animating so random
    //    uppercase letters never cause a layout reflow.
    // ─────────────────────────────────────────
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const h1 = document.querySelector("h1");

    if (h1 && h1.dataset.text) {
        // Freeze the element's rendered width so random caps
        // cannot push content around (no page shake).
        h1.style.width    = h1.offsetWidth + 'px';
        h1.style.display  = 'block';
        h1.style.overflow = 'hidden';

        let interval = null;
        const runDecipher = () => {
            let iteration = 0;
            const originalText = h1.dataset.text;
            clearInterval(interval);
            interval = setInterval(() => {
                h1.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");
                if (iteration >= originalText.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        };
        runDecipher();
        h1.addEventListener('mouseover', runDecipher);
        h1.addEventListener('touchstart', runDecipher);
    }

    // ─────────────────────────────────────────
    // 4. Smooth Scrolling
    // ─────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                const navLinks = document.querySelector('.nav-links');
                const bars = document.querySelectorAll('.bar');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    bars.forEach(bar => bar.classList.remove('active'));
                }
            }
        });
    });

    // ─────────────────────────────────────────
    // 5. Navbar Scroll Effect & Scroll Indicator
    // ─────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (scrollIndicator) scrollIndicator.classList.add('hidden');
        } else {
            navbar.classList.remove('scrolled');
            if (scrollIndicator) scrollIndicator.classList.remove('hidden');
        }
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        }
    });

    // ─────────────────────────────────────────
    // 6. Mobile Menu Toggle
    // ─────────────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.querySelectorAll('.bar').forEach(bar => bar.classList.toggle('active'));
        });
    }

    // ─────────────────────────────────────────
    // 7. Back to Top Button
    // ─────────────────────────────────────────
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─────────────────────────────────────────
    // 8. Parallax Effect for Globes
    // ─────────────────────────────────────────
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.globe').forEach((globe, index) => {
            const speed = (index + 1) * 0.08;
            globe.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

});
