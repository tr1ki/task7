// jQuery Clipboard + Lazy Loading (Tasks 8-9)

function initializeCopyToClipboard() {
    if ($('.footer-section p').length > 0) {
        $('.footer-section p').each(function() {
            const text = $(this).text().trim();
            if (text.includes('📞') || text.includes('📧')) {
                $(this).append(` <button class="copy-btn" data-text="${text.replace(/📞|📧/g, '').trim()}" style="background: #4CAF50; border: none; padding: 0.3rem 0.6rem; border-radius: 5px; color: white; cursor: pointer; font-size: 0.8rem;">📋 Copy</button>`);
            }
        });
    }

    $(document).off('click.copyBtn').on('click.copyBtn', '.copy-btn', function() {
        const text = $(this).data('text');
        const $button = $(this);
        navigator.clipboard.writeText(text).then(function() {
            const originalText = $button.text();
            $button.text('✓ Copied!').css('background', '#4CAF50');
            if (typeof showToastNotification === 'function') {
                showToastNotification('Copied to clipboard!', 'success');
            }
            setTimeout(function() { $button.text(originalText); }, 2000);
        });
    });
}

function initializeLazyLoading() {
    $('img:not(.lazy-loaded)').each(function() {
        const $img = $(this);
        const src = $img.attr('src');
        if (!src) return;
        $img.attr('data-src', src);
        $img.attr('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E');
        $img.addClass('lazy-load');
        $img.css('background', '#f0f0f0');
        $img.css('min-height', '200px');
    });

    function isInViewport($element) {
        const elementTop = $element.offset().top;
        const elementBottom = elementTop + $element.outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    }

    function loadVisibleImages() {
        $('.lazy-load').each(function() {
            const $img = $(this);
            if (!$img.hasClass('lazy-loaded') && isInViewport($img)) {
                const src = $img.attr('data-src');
                // Apply src and reveal with CSS transition after actual load
                $img.one('load', function() {
                    $img.addClass('lazy-loaded');
                    $img.css('background', 'none');
                    $img.css('min-height', '');
                }).attr('src', src);
            }
        });
    }

    $(window).off('scroll.lazyLoad resize.lazyLoad').on('scroll.lazyLoad resize.lazyLoad', loadVisibleImages);
    loadVisibleImages();
}


