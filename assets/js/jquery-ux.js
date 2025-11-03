// jQuery UX features (Tasks 4-7)

function initializeScrollProgressBar() {
    if ($('.scroll-progress-bar').length === 0) {
        $('body').prepend('<div class="scroll-progress-bar" style="position: fixed; top: 0; left: 0; height: 5px; background: linear-gradient(90deg, #ff6b6b, #ee5a24, #4CAF50, #2196F3); width: 0%; z-index: 9999; transition: width 0.3s ease;"></div>');
    }
    $(window).off('scroll.scrollProgress').on('scroll.scrollProgress', function() {
        const scrollTop = $(window).scrollTop();
        const documentHeight = $(document).height() - $(window).height();
        const scrollPercent = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
        $('.scroll-progress-bar').css('width', scrollPercent + '%');
    });
}

function initializeNumberCounter() {
    if ($('.stats-section').length === 0 && $('.features').length) {
        $('.features').after('<section class="stats-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3rem; border-radius: 15px; margin: 2rem 0; text-align: center;"><h2 style="color: white; margin-bottom: 2rem;">Our Achievements</h2><div class="stats-container" style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;"><div class="stat-item" data-target="1000"><h3 class="stat-number" style="font-size: 3rem; color: #ffd700; font-weight: bold;">0</h3><p style="color: white;">Happy Customers</p></div><div class="stat-item" data-target="500"><h3 class="stat-number" style="font-size: 3rem; color: #ffd700; font-weight: bold;">0</h3><p style="color: white;">Pizzas Sold</p></div><div class="stat-item" data-target="50"><h3 class="stat-number" style="font-size: 3rem; color: #ffd700; font-weight: bold;">0</h3><p style="color: white;">Chefs</p></div></div></section>');
    }

    function animateCounter($element, target) {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            $element.text(Math.floor(current) + '+');
        }, 16);
    }

    let statsAnimated = false;
    $(window).off('scroll.statsCounter').on('scroll.statsCounter', function() {
        const statsSection = $('.stats-section');
        if (statsSection.length > 0 && !statsAnimated) {
            const elementTop = statsSection.offset().top;
            const elementBottom = elementTop + statsSection.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $('.stat-item').each(function() {
                    const target = parseInt($(this).data('target'));
                    const $number = $(this).find('.stat-number');
                    animateCounter($number, target);
                });
                statsAnimated = true;
            }
        }
    });
}

function initializeNotificationSystem() {
    if ($('.toast-container').length === 0) {
        $('body').append('<div class="toast-container" style="position: fixed; top: 20px; right: 20px; z-index: 10000;"></div>');
    }
}

function showToastNotification(message, type = 'info') {
    const colors = { success: '#4CAF50', error: '#f44336', info: '#2196F3', warning: '#ff9800' };
    const toast = $(`
        <div class="toast" style="background: ${colors[type]}; color: white; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateX(400px); transition: transform 0.3s ease;">
            ${message}
        </div>
    `);
    $('.toast-container').append(toast);
    setTimeout(function() { toast.css('transform', 'translateX(0)'); }, 100);
    setTimeout(function() {
        toast.css('transform', 'translateX(400px)');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

function initializeFormLoadingSpinner() {
    $(document).off('submit.contactForm').on('submit.contactForm', '.contact-form', function(e) {
        e.preventDefault();
        const $form = $(this);
        const $submitButton = $form.find('button[type="submit"], .cta-button');
        const originalText = $submitButton.text();

        // Basic validation (name, email, message) similar to script.js
        const formData = Object.fromEntries(new FormData($form[0]));
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '');
        // inline error above form body + field highlighting
        $form.find('.form-error').remove();
        $form.find('.form-input').removeClass('input-error');
        const missing = [];
        if (!formData.name) missing.push({ sel: '#name', label: 'Name' });
        if (!formData.email) missing.push({ sel: '#email', label: 'Email' });
        if (!formData.message) missing.push({ sel: '#message', label: 'Message' });

        const errors = [];
        if (missing.length) {
            missing.forEach(m => $form.find(m.sel).addClass('input-error'));
            errors.push('Please fill in ' + missing.map(m => m.label).join(', '));
        }
        if (formData.email && !emailValid) {
            errors.push('Please enter a valid email address');
            $form.find('#email').addClass('input-error');
        }
        // Optional phone: validate if provided
        const phone = ($form.find('#phone').val() || '').trim();
        if (phone && !/^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(phone)) {
            errors.push('Phone must match +7 777 083 16 18');
            $form.find('#phone').addClass('input-error');
        }
        if (errors.length) {
            $form.prepend('<div class="form-error">' + errors.join(' • ') + '</div>');
            return;
        }

        $submitButton.html('<span class="spinner"></span> Please wait...');
        $submitButton.prop('disabled', true);

        setTimeout(function() {
            showToastNotification('Form submitted successfully!', 'success');
            $submitButton.text(originalText);
            $submitButton.prop('disabled', false);
            $form[0].reset();
            $form.find('.form-input').removeClass('input-error');
        }, 2000);
    });
}


