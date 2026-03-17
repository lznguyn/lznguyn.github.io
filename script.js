// --- Animations ---
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Hero Section Animation (on load)
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
        heroTl.from(".greeting", { y: 30, opacity: 0, delay: 0.2 })
              .from(".name", { y: 40, opacity: 0, duration: 1.2 }, "-=0.6")
              .from(".role", { y: 30, opacity: 0 }, "-=0.8")
              .from(".bio", { y: 20, opacity: 0 }, "-=0.6")
              .from(".hero-content .cta-group", { y: 20, opacity: 0 }, "-=0.6");

        // Skills Section
        gsap.from(".skill-card", {
            scrollTrigger: {
                trigger: ".skills",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)"
        });

        // Projects Section
        gsap.from(".project-card", {
            scrollTrigger: {
                trigger: ".projects",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Background Parallax
        gsap.to(".pattern-1", {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            },
            y: 300,
            x: 100,
            ease: "none"
        });

        gsap.to(".pattern-2", {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 2
            },
            y: -300,
            x: -100,
            ease: "none"
        });
        
        // Try initialize Lenis if available
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis();
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time)=>{
              lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

    } catch (e) {
        console.error("Animation error:", e);
        // Fallback: make elements visible if JS fails
        document.querySelectorAll('.greeting, .name, .role, .bio, .cta-group, .skill-card, .project-card').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
});
