// --- Animations ---
window.addEventListener("load", () => {
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

    // Skills Section - trigger on each card
    gsap.utils.toArray(".skill-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%", // Trigger when top of card hits 90% viewport height
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: (i % 4) * 0.15 // Stagger effect based on grid column
        });
    });

    // Projects Section - trigger on each card
    gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
            delay: (i % 3) * 0.2
        });
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
    
    // Refresh ScrollTrigger after all initial animations and setup
    ScrollTrigger.refresh();
});
