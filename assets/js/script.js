// Theme and app states
let isDarkTheme = false;
let cart = { items: [], total: 0 };
let currentRating = 0;
let currentImageIndex = 0;

// DOM references
const themeToggle = document.querySelector('.theme-toggle');
const ratingStars = document.querySelectorAll('.rating-star');
const galleryImages = document.querySelectorAll('.gallery-item img');
const mainImage = document.querySelector('.main-gallery-image');
const menuFilter = document.querySelector('.menu-filter');
const menuItems = document.querySelectorAll('.menu-item');
const contactForm = document.querySelector('.contact-form');
const cartButton = document.querySelector('.cart-button');
const cartCount = document.querySelector('.cart-count');
const timeButton = document.querySelector('.time-button');
const timeDisplay = document.querySelector('.time-display');
const resetButton = document.querySelector('.reset-button');
const greetingElement = document.querySelector('.greeting');
const nameInput = document.querySelector('.name-input');
const submitNameButton = document.querySelector('.submit-name');

// Simple sound generator for UI feedback
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = {
        click: [200, 0.1, 0.3],
        success: [400, 0.2, 0.5],
        error: [150, 0.3, 0.8],
        cart: [300, 0.15, 0.4]
    };
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

// Apply quick CSS transitions for simple animations
function animateElement(el, props, duration = 300) {
    el.style.transition = `all ${duration}ms ease`;
    Object.keys(props).forEach(p => (el.style[p] = props[p]));
    setTimeout(() => (el.style.transition = ''), duration);
}

// Return greeting message based on time
function getTimeBasedGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
}

// Toggle light/dark theme and save to localStorage
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    playSound('click');
    document.body.classList.toggle('dark-theme', isDarkTheme);
    themeToggle.textContent = isDarkTheme ? '☀️ Day Mode' : '🌙 Night Mode';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Apply saved theme on page load
function initializeTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        isDarkTheme = true;
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Day Mode';
    }
}

// Setup interactive rating system
function initializeRating() {
    ratingStars.forEach((star, i) => {
        star.addEventListener('click', () => {
            setRating(i + 1);
            playSound('click');
        });
        star.addEventListener('mouseenter', () => highlightStars(i + 1));
    });
    const container = document.querySelector('.rating-container');
    container?.addEventListener('mouseleave', () => highlightStars(currentRating));
}

// Update current rating and feedback text
function setRating(r) {
    currentRating = r;
    highlightStars(r);
    const feedback = document.querySelector('.rating-feedback');
    if (feedback) {
        feedback.textContent = `You rated: ${r} star${r > 1 ? 's' : ''}`;
        feedback.style.opacity = '1';
    }
}

// Visually fill stars up to rating
function highlightStars(r) {
    ratingStars.forEach((star, i) => {
        star.style.color = i < r ? '#ffd700' : '#ddd';
        star.style.transform = i < r ? 'scale(1.1)' : 'scale(1)';
    });
}

// Enable image switching for gallery
function initializeGallery() {
    galleryImages.forEach((img, i) => {
        img.addEventListener('click', () => {
            switchMainImage(img.src, i);
            playSound('click');
        });
    });
}

// Change main gallery image with animation
function switchMainImage(src, i) {
    if (!mainImage) return;
    animateElement(mainImage, { opacity: '0', transform: 'scale(0.8)' }, 200);
    setTimeout(() => {
        mainImage.src = src;
        currentImageIndex = i;
        animateElement(mainImage, { opacity: '1', transform: 'scale(1)' }, 200);
    }, 200);
}

// Filter menu items using dropdown
function initializeMenuFilter() {
    menuFilter?.addEventListener('change', e => {
        filterMenuItems(e.target.value);
        playSound('click');
    });
}

// Show/hide items based on selected category
function filterMenuItems(cat) {
    menuItems.forEach(item => {
        const c = item.dataset.category;
        switch (cat) {
            case 'pizzas':
                item.style.display = c === 'pizza' ? 'block' : 'none';
                break;
            case 'drinks':
                item.style.display = c === 'drink' ? 'block' : 'none';
                break;
            default:
                item.style.display = 'block';
        }
        animateElement(item, { opacity: '1', transform: 'scale(1)' });
    });
}

// Add an item to cart and update display
function addToCart(item) {
    const existing = cart.items.find(i => i.id === item.id);
    existing ? (existing.quantity += 1) : cart.items.push({ ...item, quantity: 1 });
    updateCartDisplay();
    playSound('cart');
    showCartAnimation();
}

// Refresh cart count and total
function updateCartDisplay() {
    cart.total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    cartCount.textContent = cart.items.reduce((s, i) => s + i.quantity, 0);
    cartCount.style.display = cart.items.length ? 'block' : 'none';
    const totalEl = document.querySelector('.cart-total');
    if (totalEl) totalEl.textContent = `$${cart.total.toFixed(2)}`;
}

// Animate cart button on add
function showCartAnimation() {
    animateElement(cartButton, { transform: 'scale(1.2)' }, 150);
    setTimeout(() => animateElement(cartButton, { transform: 'scale(1)' }, 150), 150);
}

// Show current time
function handleTimeButtonClick() {
    timeDisplay.textContent = `Current time: ${new Date().toLocaleTimeString()}`;
    timeDisplay.style.opacity = '1';
    playSound('success');
}

// Reset forms, cart, and ratings
function handleResetButtonClick() {
    document.querySelectorAll('input, textarea, select').forEach(i => (i.value = ''));
    currentRating = 0;
    highlightStars(0);
    cart = { items: [], total: 0 };
    updateCartDisplay();
    playSound('success');
}

// Display personalized greeting
function handleNameSubmission() {
    const name = nameInput.value.trim();
    if (!name) return;
    greetingElement.textContent = `${getTimeBasedGreeting()}, ${name}! Welcome to Bobo Pizza!`;
    greetingElement.style.opacity = '1';
    playSound('success');
}

// Validate contact form and show notifications
function handleContactFormSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm));
    if (!data.name || !data.email || !data.message) return showNotification('Please fill in all required fields', 'error');
    if (!isValidEmail(data.email)) return showNotification('Please enter a valid email address', 'error');
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    contactForm.reset();
    playSound('success');
}

// Basic email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Display temporary floating message
function showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.textContent = msg;
    Object.assign(n.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
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

// Keyboard navigation for nav links
function handleKeyboardNavigation(e) {
    const items = document.querySelectorAll('.nav-link');
    const idx = [...items].findIndex(i => i === document.activeElement);
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        items[idx <= 0 ? items.length - 1 : idx - 1].focus();
    } else if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        if (document.activeElement.classList.contains('nav-link')) document.activeElement.click();
    }
}

// Demonstration of map, filter, forEach usage
function processMenuItems() {
    const data = [
        { id: 1, name: 'Margherita', price: 12.99, category: 'pizza' },
        { id: 2, name: 'Pepperoni', price: 15.99, category: 'pizza' },
        { id: 3, name: 'BBQ Chicken', price: 17.99, category: 'pizza' },
        { id: 4, name: 'Supreme', price: 19.99, category: 'pizza' },
        { id: 5, name: 'Coca Cola', price: 2.99, category: 'drink' },
        { id: 6, name: 'Orange Juice', price: 3.99, category: 'drink' }
    ];
    const processed = data.map(i => ({ ...i, displayName: i.name.toUpperCase(), isExpensive: i.price > 15 }));
    const pizzas = processed.filter(i => i.category === 'pizza');
    pizzas.forEach(i => console.log(`Pizza: ${i.displayName} - $${i.price}`));
    return processed;
}

// Initialize all features on load
function initializeApp() {
    console.log('🍕 Initializing Bobo Pizza Interactive Features...');
    initializeTheme();
    initializeRating();
    initializeGallery();
    initializeMenuFilter();
    processMenuItems();

    themeToggle?.addEventListener('click', toggleTheme);
    timeButton?.addEventListener('click', handleTimeButtonClick);
    resetButton?.addEventListener('click', handleResetButtonClick);
    submitNameButton?.addEventListener('click', handleNameSubmission);
    contactForm?.addEventListener('submit', handleContactFormSubmit);
    document.addEventListener('keydown', handleKeyboardNavigation);

    document.querySelectorAll('.card-button, .order-button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const card = btn.closest('.card');
            const name = card.querySelector('h3, h4').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            addToCart({ id: Date.now(), name, price });
        });
    });

    console.log('✅ Bobo Pizza Interactive Features Initialized!');
}

// Start app when DOM is ready
document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initializeApp)
    : initializeApp();
