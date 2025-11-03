// Contact helpers: greeting, time, reset

function handleTimeButtonClick() {
    const timeDisplay = document.querySelector('.time-display');
    if (!timeDisplay) return;
    timeDisplay.textContent = `Current time: ${new Date().toLocaleTimeString()}`;
    timeDisplay.style.opacity = '1';
    playSound('success');
}

function handleResetButtonClick() {
    document.querySelectorAll('input, textarea, select').forEach(i => (i.value = ''));
    // Reset rating visuals
    if (typeof highlightStars === 'function') highlightStars(0);
    // Reset cart
    if (typeof updateCartDisplay === 'function') {
        if (typeof cart !== 'undefined') cart = { items: [], total: 0 };
        updateCartDisplay();
    }
    playSound('success');
}

function getTimeBasedGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
}

function handleNameSubmission() {
    const greetingElement = document.querySelector('.greeting');
    const nameInput = document.querySelector('.name-input');
    if (!greetingElement || !nameInput) return;
    const name = nameInput.value.trim();
    if (!name) return;
    greetingElement.textContent = `${getTimeBasedGreeting()}, ${name}! Welcome to Bobo Pizza!`;
    greetingElement.style.opacity = '1';
    playSound('success');
}

// Phone mask: enforce +7 and format as "+7 777 083 16 18"
function formatKzPhone(rawDigits) {
    // rawDigits should be only numbers; ensure we take exactly 10 after country code
    const digits = rawDigits.replace(/\D/g, '');
    // remove leading 7 if user pasted with it
    const rest = digits.replace(/^7/, '').slice(0, 10);
    const parts = [];
    const cuts = [3, 3, 2, 2];
    let idx = 0;
    cuts.forEach(len => {
        if (rest.length > idx) {
            parts.push(rest.slice(idx, idx + len));
            idx += len;
        }
    });
    return `+7 ${parts.join(' ')}`.trim();
}

function maskKzPhoneInput(inputEl) {
    if (!inputEl) return;
    // initialize value if empty or not starting with +7
    if (!/^\+7/.test(inputEl.value)) inputEl.value = '+7 ';

    inputEl.addEventListener('keydown', (e) => {
        const start = inputEl.selectionStart || 0;
        if ((e.key === 'Backspace' || e.key === 'Delete') && start <= 3) {
            e.preventDefault();
        }
    });

    inputEl.addEventListener('input', () => {
        const digits = inputEl.value.replace(/\D/g, '');
        const formatted = formatKzPhone(digits);
        inputEl.value = formatted;
        inputEl.classList.remove('input-error');
    });

    inputEl.addEventListener('focus', () => {
        if (inputEl.value.trim() === '') inputEl.value = '+7 ';
    });
}

function attachPhoneMask() {
    const contactPhone = document.getElementById('phone');
    if (contactPhone) maskKzPhoneInput(contactPhone);
}


