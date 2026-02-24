// ── LANDING.JS — Three.js 3D Scene + Scroll Animations ──────────────────────

(function () {
    'use strict';

    // ── THREE.JS SETUP ─────────────────────────────────────────────────────────
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    // ── PARTICLE FIELD ──────────────────────────────────────────────────────────
    const starCount = 2200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const palette = [
        new THREE.Color(0x7c3aed), // purple
        new THREE.Color(0xa78bfa), // light purple
        new THREE.Color(0x6366f1), // indigo
        new THREE.Color(0x22d3ee), // cyan
        new THREE.Color(0xffffff), // white
    ];

    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 180;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 180;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 180;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── FLOATING TORUS KNOT (decorative 3D object) ──────────────────────────────
    const torusGeo = new THREE.TorusKnotGeometry(6, 1.8, 180, 20);
    const torusMat = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        emissive: 0x3b0fa0,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.15,
        wireframe: false,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(22, 0, -10);
    scene.add(torus);

    // ── AMBIENT + POINT LIGHTS ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pLight1 = new THREE.PointLight(0x7c3aed, 4, 80);
    pLight1.position.set(20, 10, 20);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0x22d3ee, 2, 80);
    pLight2.position.set(-20, -10, 10);
    scene.add(pLight2);

    // ── MOUSE PARALLAX ──────────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── RESIZE ─────────────────────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ── SCROLL PARALLAX ────────────────────────────────────────────────────────
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    // ── ANIMATION LOOP ──────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Slowly rotate the star field
        stars.rotation.y = t * 0.018;
        stars.rotation.x = t * 0.008;

        // Torus knot spin + float
        torus.rotation.x = t * 0.22;
        torus.rotation.y = t * 0.38;
        torus.position.y = Math.sin(t * 0.5) * 2.5;

        // Subtle camera parallax on mouse
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;

        // Scroll: push camera back slightly
        camera.position.z = 40 + scrollY * 0.01;

        renderer.render(scene, camera);
    }
    animate();

    // ── NAV SCROLL EFFECT ───────────────────────────────────────────────────────
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // ── SCROLL REVEAL ───────────────────────────────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.feature-card, .step, .info-row, .stat-card, .about-grid > *, .tech-card'
    );
    revealEls.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered delay for sibling cards
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));

})();
