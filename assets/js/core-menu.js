// Menu filter and simple cart logic

let cart = { items: [], total: 0 };
const CART_KEY = 'bobo_cart_v1';

function initializeMenuFilter() {
    const menuFilter = document.querySelector('.menu-filter');
    menuFilter && menuFilter.addEventListener('change', e => {
        filterMenuItems(e.target.value);
        playSound('click');
    });
}

function filterMenuItems(cat) {
    const menuItems = document.querySelectorAll('.menu-item');
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

    // Hide entire sections with no visible items
    document.querySelectorAll('.menu-section').forEach(section => {
        const visible = [...section.querySelectorAll('.menu-item')].some(it => it.style.display !== 'none');
        section.style.display = visible ? 'block' : 'none';
    });
}

function addToCart(item) {
    const existing = cart.items.find(i => i.name === item.name && i.price === item.price);
    existing ? (existing.quantity += 1) : cart.items.push({ ...item, quantity: 1 });
    persistCart();
    updateCartDisplay();
    playSound('cart');
    showCartAnimation();
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    cart.total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
    if (cartCount) {
        cartCount.textContent = cart.items.reduce((s, i) => s + i.quantity, 0);
        cartCount.style.display = cart.items.length ? 'block' : 'none';
    }
    const totalEl = document.querySelector('.cart-total');
    if (totalEl) totalEl.textContent = `$${cart.total.toFixed(2)}`;
    const drawerSubtotal = document.querySelector('.cart-subtotal');
    if (drawerSubtotal) drawerSubtotal.textContent = `$${cart.total.toFixed(2)}`;
    renderCartDrawerItems();
}

function showCartAnimation() {
    const cartButton = document.querySelector('.cart-button');
    animateElement(cartButton, { transform: 'scale(1.2)' }, 150);
    setTimeout(() => animateElement(cartButton, { transform: 'scale(1)' }, 150), 150);
}

function wireOrderButtons() {
    document.querySelectorAll('.card-button, .order-button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const card = btn.closest('.card');
            const titleEl = card.querySelector('h3, h4');
            const priceEl = card.querySelector('.price');
            if (!titleEl || !priceEl) return;
            const name = titleEl.textContent;
            const price = parseFloat(priceEl.textContent.replace('$', ''));
            addToCart({ id: Date.now(), name, price });
        });
    });

    // open/close cart drawer
    const cartBtn = document.querySelector('.cart-button');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = drawer ? drawer.querySelector('.cart-close') : null;
    cartBtn && cartBtn.addEventListener('click', openCartDrawer);
    closeBtn && closeBtn.addEventListener('click', closeCartDrawer);
    drawer && drawer.addEventListener('click', (e) => { /* drawer click-through disabled */ });

    // ESC to close cart
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCartDrawer(); });

    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(p => p.addEventListener('click', () => {
        pills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        filterMenuItems(p.dataset.filter || 'all');
    }));

    const checkoutBtn = document.getElementById('checkout-button');
    checkoutBtn && checkoutBtn.addEventListener('click', openCheckoutModal);
    const continueBtn = document.getElementById('continue-shopping');
    continueBtn && continueBtn.addEventListener('click', closeCartDrawer);
}

function renderCartDrawerItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    container.innerHTML = '';
    if (cart.items.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }
    cart.items.forEach((it, idx) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div>
                <div class="cart-item-name">${it.name}</div>
                <div class="qty-controls" data-idx="${idx}">
                    <button class="qty-btn qty-dec" aria-label="Decrease">−</button>
                    <span class="qty">${it.quantity}</span>
                    <button class="qty-btn qty-inc" aria-label="Increase">+</button>
                    <button class="qty-btn qty-rem" aria-label="Remove" title="Remove" style="width:auto;border-radius:6px;padding:0 8px">Remove</button>
                </div>
            </div>
            <div class="cart-item-price">$${(it.price * it.quantity).toFixed(2)}</div>
        `;
        container.appendChild(row);
    });

    container.querySelectorAll('.qty-controls').forEach(ctrl => {
        const idx = parseInt(ctrl.getAttribute('data-idx'));
        ctrl.querySelector('.qty-inc').addEventListener('click', () => { cart.items[idx].quantity += 1; persistCart(); updateCartDisplay(); });
        ctrl.querySelector('.qty-dec').addEventListener('click', () => { cart.items[idx].quantity = Math.max(1, cart.items[idx].quantity - 1); persistCart(); updateCartDisplay(); });
        ctrl.querySelector('.qty-rem').addEventListener('click', () => { cart.items.splice(idx, 1); persistCart(); updateCartDisplay(); });
    });
}

function persistCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}

function restoreCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (raw) cart = JSON.parse(raw);
    } catch {}
}

function openCheckoutModal() {
    if (cart.items.length === 0) { showNotification('Your cart is empty', 'error'); return; }
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">Checkout</div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label>Name</label><input class="input" id="chk-name" placeholder="Your name" required></div>
            <div class="form-group"><label>Phone</label><input class="input" id="chk-phone" placeholder="+7 777 083 16 18" required></div>
          </div>
          <div class="form-group"><label>Address</label><input class="input" id="chk-addr" placeholder="Street, house, apt" required></div>
          <div class="form-row">
            <div class="form-group"><label>Payment</label><select id="chk-pay" class="input"><option>Cash</option><option>Card</option></select></div>
            <div class="form-group"><label>Comment</label><input class="input" id="chk-note" placeholder="Optional"></div>
          </div>
          <div style="margin-top:0.5rem;font-weight:600">Total: $${cart.total.toFixed(2)}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="chk-cancel">Cancel</button>
          <button class="btn btn-primary" id="chk-confirm">Place Order</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    // attach phone mask for checkout
    if (typeof maskKzPhoneInput === 'function') maskKzPhoneInput(backdrop.querySelector('#chk-phone'));
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
    backdrop.querySelector('#chk-cancel').addEventListener('click', () => backdrop.remove());
    backdrop.querySelector('#chk-confirm').addEventListener('click', () => {
        const nameEl = backdrop.querySelector('#chk-name');
        const phoneEl = backdrop.querySelector('#chk-phone');
        const addrEl = backdrop.querySelector('#chk-addr');
        const name = nameEl.value.trim();
        const phone = phoneEl.value.trim();
        const addr = addrEl.value.trim();
        [nameEl, phoneEl, addrEl].forEach(el => el.classList.remove('input-error'));
        const messages = [];
        if (!name) nameEl.classList.add('input-error');
        if (!phone) phoneEl.classList.add('input-error');
        if (!addr) addrEl.classList.add('input-error');
        const missing = [];
        if (!name) missing.push('name');
        if (!phone) missing.push('phone');
        if (!addr) missing.push('address');
        if (missing.length) {
            const pretty = missing.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
            messages.push(`Please fill in ${pretty}`);
        }
        const phoneValid = /^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(phone);
        if (phone && !phoneValid) {
            phoneEl.classList.add('input-error');
            messages.push('Phone must match +7 777 083 16 18');
        }
        if (messages.length) { showModalError(backdrop, messages.join(' • ')); return; }
        // Simulate order success
        showNotification('Order placed! Thank you!', 'success');
        cart = { items: [], total: 0 };
        persistCart();
        updateCartDisplay();
        const drawer = document.getElementById('cart-drawer');
        drawer && drawer.classList.remove('open');
        backdrop.remove();
    });
}

// Bootstrapping cart on app init
(function initCartOnLoad(){
    restoreCart();
    updateCartDisplay();
})();

function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.add('open');
    let backdrop = document.querySelector('.cart-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'cart-backdrop';
        document.body.appendChild(backdrop);
    }
    requestAnimationFrame(() => backdrop.classList.add('open'));
    backdrop.onclick = closeCartDrawer;
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    const backdrop = document.querySelector('.cart-backdrop');
    if (backdrop) {
        backdrop.classList.remove('open');
        setTimeout(() => backdrop.remove(), 200);
    }
}




function showModalError(backdrop, message) {
    const body = backdrop.querySelector('.modal-body');
    if (!body) return;
    let alert = body.querySelector('.modal-error');
    if (!alert) {
        alert = document.createElement('div');
        alert.className = 'modal-error';
        body.prepend(alert);
    }
    alert.textContent = message;
}