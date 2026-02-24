// ── AUTH.JS — Login, Signup, Three.js background for login page ──────────────

// ── THREE.JS PARTICLE BG ────────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 30;

    const geo = new THREE.BufferGeometry();
    const n = 1200;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) pos[i] = (Math.random() - 0.5) * 110;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.18, color: 0x7c3aed, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(geo, mat));

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth - 0.5);
        my = (e.clientY / window.innerHeight - 0.5);
    });

    const clock = new THREE.Clock();
    (function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        scene.rotation.y = t * 0.04 + mx * 0.4;
        scene.rotation.x = t * 0.02 + my * 0.2;
        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ── TAB SWITCHER ───────────────────────────────────────────────────────────
function switchTab(tab) {
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
}

// ── PASSWORD TOGGLE ────────────────────────────────────────────────────────
function togglePw(id, btn) {
    const inp = document.getElementById(id);
    if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
    else { inp.type = 'password'; btn.textContent = '👁'; }
}

// ── SHOW MESSAGE ───────────────────────────────────────────────────────────
function showMsg(id, text, type) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = 'msg-box ' + type;
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const email = document.getElementById('loginEmail').value.trim();
    const pw = document.getElementById('loginPassword').value;

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Signing in…';

    // Bypassing Backend: Any credentials work!
    const dummyUser = { id: 1, name: email.split('@')[0] || 'User', email: email };
    localStorage.setItem('currentUser', JSON.stringify(dummyUser));

    showMsg('loginMsg', `Welcome, ${dummyUser.name}! Redirecting…`, 'success');
    setTimeout(() => { window.location.href = 'app.html'; }, 800);
}

// ── SIGNUP ─────────────────────────────────────────────────────────────────
async function handleSignup(e) {
    e.preventDefault();
    const btn = document.getElementById('signupBtn');
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const roll_no = document.getElementById('signupRoll').value.trim();
    const pw = document.getElementById('signupPassword').value;

    btn.disabled = true;
    btn.querySelector('span').textContent = 'Creating account…';

    // Bypassing Backend: Any credentials work!
    const dummyUser = { id: 1, name: name || 'User', email: email, roll_no: roll_no };
    localStorage.setItem('currentUser', JSON.stringify(dummyUser));

    showMsg('signupMsg', `Account created! Welcome, ${dummyUser.name}! Redirecting…`, 'success');
    setTimeout(() => { window.location.href = 'app.html'; }, 800);
}
