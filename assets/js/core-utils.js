// Core utilities: sound, simple animations, notifications, validation

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = { click: [200, 0.1, 0.3], success: [400, 0.2, 0.5], error: [150, 0.3, 0.8], cart: [300, 0.15, 0.4] };
    const [frequency, duration, volume] = sounds[type] || sounds.click;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration);
}

function animateElement(el, props, duration = 300) {
    if (!el) return;
    el.style.transition = `all ${duration}ms ease`;
    Object.keys(props).forEach(p => (el.style[p] = props[p]));
    setTimeout(() => (el.style.transition = ''), duration);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.textContent = msg;
    Object.assign(n.style, {
        position: 'fixed', top: '20px', right: '20px', padding: '1rem 2rem', borderRadius: '8px',
        color: 'white', fontWeight: 'bold', zIndex: '1000', transform: 'translateX(100%)', transition: 'transform 0.3s ease'
    });
    const colors = { success: '#4CAF50', error: '#f44336', info: '#2196F3' };
    n.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(n);
    setTimeout(() => (n.style.transform = 'translateX(0)'), 100);
    setTimeout(() => {
        n.style.transform = 'translateX(100%)';
        setTimeout(() => n.remove(), 300);
    }, 3000);
}


