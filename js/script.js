document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // 2. Typing Effect for Role
    const roles = ["Data Analyst"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.getElementById('typed-text');
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 2000;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, pauseBeforeDelete);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
        }
    }

    if (typedTextSpan) type();

    // 3. Decipher/Matrix Effect for Name
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const h1 = document.querySelector("h1");

    if (h1 && h1.dataset.text) {
        let interval = null;

        const runDecipher = () => {
            let iteration = 0;
            const originalText = h1.dataset.text;

            clearInterval(interval);

            interval = setInterval(() => {
                h1.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        // Run on load
        runDecipher();

        // Run on hover/touch
        h1.addEventListener('mouseover', runDecipher);
        h1.addEventListener('touchstart', runDecipher);
    }

    // 4. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetelement = document.querySelector(targetId);
            if (targetelement) {
                window.scrollTo({
                    top: targetelement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const bars = document.querySelectorAll('.bar');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    bars.forEach(bar => bar.classList.remove('active'));
                }
            }
        });
    });

    // 5. Navbar Scroll Effect & Scroll Indicator
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (scrollIndicator) scrollIndicator.classList.add('hidden');
        } else {
            navbar.classList.remove('scrolled');
            if (scrollIndicator) scrollIndicator.classList.remove('hidden');
        }

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    // 6. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
        });
    }

    // 7. Back to Top Button Click
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Parallax Effect for Globes
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const globes = document.querySelectorAll('.globe');
        globes.forEach((globe, index) => {
            const speed = (index + 1) * 0.1;
            globe.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

});
