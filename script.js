// --- Animations ---
document.addEventListener("DOMContentLoaded", () => {
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
            start: "top 80%", // Trigger when top of section hits 80% viewport height
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
});
