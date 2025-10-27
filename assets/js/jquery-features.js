// jQuery Features for Assignment 7
// Task 0: jQuery is ready!
$(document).ready(function(){
    console.log("jQuery is ready!");
    
    // All jQuery tasks will be implemented here
    
    // Task 1-2: Real-time search and autocomplete for menu items
    initializeSearchAndAutocomplete();
    
    // Task 3: Search highlighting
    initializeSearchHighlighting();
    
    // Task 4: Colorful scroll progress bar
    initializeScrollProgressBar();
    
    // Task 5: Animated number counter
    initializeNumberCounter();
    
    // Task 6: Loading spinner on form submit
    initializeFormLoadingSpinner();
    
    // Task 7: Notification/Toast system
    initializeNotificationSystem();
    
    // Task 8: Copy to clipboard button
    initializeCopyToClipboard();
    
    // Task 9: Image lazy loading
    initializeLazyLoading();
    
});

// Task 1-2: Real-time Search and Autocomplete
function initializeSearchAndAutocomplete() {
    // Create search bar if it doesn't exist on menu page
    if ($('.menu-search-container').length === 0) {
        $('.menu-section').before('<div class="menu-search-container" style="margin-bottom: 2rem;"><input type="text" class="menu-search" placeholder="🔍 Search menu items..." style="padding: 1rem; width: 100%; max-width: 500px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;"><div class="autocomplete-results" style="margin-top: 1rem;"></div></div>');
    }
    
    const menuItems = $('.menu-item');
    const menuItemData = [];
    
    // Extract menu item data
    menuItems.each(function() {
        menuItemData.push({
            element: $(this),
            name: $(this).find('h4').text(),
            description: $(this).find('p').text(),
            category: $(this).data('category') || 'unknown'
        });
    });
    
    // Search functionality
    $('.menu-search').on('keyup', function() {
        const searchText = $(this).val().toLowerCase();
        const autocompleteResults = $('.autocomplete-results');
        
        if (searchText.length === 0) {
            autocompleteResults.empty();
            menuItems.show();
            return;
        }
        
        // Filter and show matching items
        const matches = [];
        menuItemData.forEach(item => {
            if (item.name.toLowerCase().includes(searchText) || 
                item.description.toLowerCase().includes(searchText)) {
                matches.push(item.name);
                item.element.show();
            } else {
                item.element.hide();
            }
        });
        
        // Show autocomplete suggestions
        if (matches.length > 0 && searchText.length > 0) {
            autocompleteResults.empty();
            matches.slice(0, 5).forEach(match => {
                autocompleteResults.append(`<div class="autocomplete-item" style="padding: 0.5rem; background: white; border: 1px solid #ddd; margin-bottom: 0.5rem; border-radius: 5px; cursor: pointer;">${match}</div>`);
            });
        } else {
            autocompleteResults.empty();
        }
    });
    
    // Click on autocomplete item
    $(document).on('click', '.autocomplete-item', function() {
        $('.menu-search').val($(this).text()).trigger('keyup');
    });
}

// Task 3: Search Highlighting
function initializeSearchHighlighting() {
    $('.menu-search').on('keyup', function() {
        const searchText = $(this).val();
        
        if (searchText.length === 0) {
            // Remove all highlights
            $('.menu-item').find('h4, p').each(function() {
                $(this).html($(this).data('original-text') || $(this).text());
            });
            return;
        }
        
        // Highlight matching text
        $('.menu-item').each(function() {
            const $item = $(this);
            $item.find('h4, p').each(function() {
                const originalText = $(this).data('original-text') || $(this).text();
                $(this).data('original-text', originalText);
                
                const regex = new RegExp(`(${searchText})`, 'gi');
                const highlightedText = originalText.replace(regex, '<mark style="background: #ffd700; padding: 0.2rem;">$1</mark>');
                $(this).html(highlightedText);
            });
        });
    });
}

// Task 4: Colorful Scroll Progress Bar
function initializeScrollProgressBar() {
    // Create progress bar
    $('body').prepend('<div class="scroll-progress-bar" style="position: fixed; top: 0; left: 0; height: 5px; background: linear-gradient(90deg, #ff6b6b, #ee5a24, #4CAF50, #2196F3); width: 0%; z-index: 9999; transition: width 0.3s ease;"></div>');
    
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        const documentHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        $('.scroll-progress-bar').css('width', scrollPercent + '%');
    });
}

// Task 5: Animated Number Counter
function initializeNumberCounter() {
    // Add stats section to home page
    if ($('.stats-section').length === 0) {
        $('.features').after('<section class="stats-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3rem; border-radius: 15px; margin: 2rem 0; text-align: center;"><h2 style="color: white; margin-bottom: 2rem;">Our Achievements</h2><div class="stats-container" style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;"><div class="stat-item" data-target="1000"><h3 class="stat-number" style="font-size: 3rem; color: #ffd700; font-weight: bold;">0</h3><p style="color: white;">Happy Customers</p></div><div class="stat-item" data-target="500"><h3 class="stat-number" style="font-size: 3rem; color: #ffd700; font-weight: bold;">0</h3><p style="color: white;">Pizzas Sold</p></div><div class="stat-item" data-target="50"><h3 class="stat-number" style="font-size: 3rem; color: #ffd700; font-weight: bold;">0</h3><p style="color: white;">Chefs</p></div></div></section>');
    }
    
    // Counter animation
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
    
    // Trigger on scroll
    let statsAnimated = false;
    $(window).on('scroll', function() {
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

// Task 6: Loading Spinner on Form Submit
function initializeFormLoadingSpinner() {
    $('.contact-form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $submitButton = $form.find('button[type="submit"]');
        const originalText = $submitButton.text();
        
        // Show spinner and disable button
        $submitButton.html('<span class="spinner"></span> Please wait...');
        $submitButton.prop('disabled', true);
        
        // Simulate server call
        setTimeout(function() {
            // Success notification
            showToastNotification('Form submitted successfully!', 'success');
            
            // Reset button
            $submitButton.text(originalText);
            $submitButton.prop('disabled', false);
            $form[0].reset();
        }, 2000);
    });
}

// Task 7: Notification/Toast System
function initializeNotificationSystem() {
    // Toast container
    $('body').append('<div class="toast-container" style="position: fixed; top: 20px; right: 20px; z-index: 10000;"></div>');
}

function showToastNotification(message, type = 'info') {
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    const toast = $(`
        <div class="toast" style="background: ${colors[type]}; color: white; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateX(400px); transition: transform 0.3s ease;">
            ${message}
        </div>
    `);
    
    $('.toast-container').append(toast);
    
    setTimeout(function() {
        toast.css('transform', 'translateX(0)');
    }, 100);
    
    setTimeout(function() {
        toast.css('transform', 'translateX(400px)');
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Task 8: Copy to Clipboard Button
function initializeCopyToClipboard() {
    // Add copy buttons to contact info
    if ($('.footer-section p').length > 0) {
        $('.footer-section p').each(function() {
            const text = $(this).text().trim();
            if (text.includes('📞') || text.includes('📧')) {
                $(this).append(` <button class="copy-btn" data-text="${text.replace(/📞|📧/g, '').trim()}" style="background: #4CAF50; border: none; padding: 0.3rem 0.6rem; border-radius: 5px; color: white; cursor: pointer; font-size: 0.8rem;">📋 Copy</button>`);
            }
        });
    }
    
    // Copy functionality
    $(document).on('click', '.copy-btn', function() {
        const text = $(this).data('text');
        const $button = $(this);
        
        // Copy to clipboard
        navigator.clipboard.writeText(text).then(function() {
            const originalText = $button.text();
            $button.text('✓ Copied!').css('background', '#4CAF50');
            
            showToastNotification('Copied to clipboard!', 'success');
            
            setTimeout(function() {
                $button.text(originalText);
            }, 2000);
        });
    });
}

// Task 9: Image Lazy Loading
function initializeLazyLoading() {
    // Convert all images to lazy load
    $('img:not(.lazy-loaded)').each(function() {
        const $img = $(this);
        const src = $img.attr('src');
        
        // Store original source
        $img.attr('data-src', src);
        $img.attr('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E');
        $img.addClass('lazy-load');
        
        // Add loading placeholder
        $img.css('background', '#f0f0f0');
        $img.css('min-height', '200px');
    });
    
    // Check if image is in viewport
    function isInViewport($element) {
        const elementTop = $element.offset().top;
        const elementBottom = elementTop + $element.outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        
        return elementBottom > viewportTop && elementTop < viewportBottom;
    }
    
    // Load images
    function loadVisibleImages() {
        $('.lazy-load').each(function() {
            const $img = $(this);
            
            if (!$img.hasClass('lazy-loaded') && isInViewport($img)) {
                const src = $img.attr('data-src');
                
                $img.attr('src', src);
                $img.addClass('lazy-loaded');
                $img.css('background', 'none');
                
                $img.on('load', function() {
                    $img.fadeIn(500);
                });
            }
        });
    }
    
    // Load images on scroll
    $(window).on('scroll', loadVisibleImages);
    $(window).on('resize', loadVisibleImages);
    
    // Initial load
    loadVisibleImages();
}

