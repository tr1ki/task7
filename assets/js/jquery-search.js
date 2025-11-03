// jQuery Search features (Tasks 1-3)

function initializeSearchAndAutocomplete() {
    // Prefer rendering inside filter container if present
    if ($('.menu-filter-container .menu-search-container').length) {
        $('.menu-filter-container .menu-search-container').html('<input type="text" class="menu-search" placeholder="🔍 Search menu items..." style="padding: 0.9rem 1rem; width: 100%; border: 2px solid #ddd; border-radius: 10px; font-size: 1rem; background:#fff"><div class="autocomplete-results" style="margin-top: 0.5rem;"></div>');
    } else if ($('.menu-search-container').length === 0 && $('.menu-section').length) {
        // Fallback: insert above first menu section
        $('.menu-section').first().before('<div class="menu-search-container" style="margin-bottom: 2rem;"><input type="text" class="menu-search" placeholder="🔍 Search menu items..." style="padding: 1rem; width: 100%; max-width: 500px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;"><div class="autocomplete-results" style="margin-top: 1rem;"></div></div>');
    }

    const menuItems = $('.menu-item');
    const menuItemData = [];

    menuItems.each(function() {
        menuItemData.push({
            element: $(this),
            name: $(this).find('h4').text(),
            description: $(this).find('p').text(),
            category: $(this).data('category') || 'unknown'
        });
    });

    $('.menu-search').on('keyup', function() {
        const searchText = $(this).val().toLowerCase();
        const autocompleteResults = $('.autocomplete-results');

        if (searchText.length === 0) {
            autocompleteResults.empty();
            menuItems.show();
            return;
        }

        const matches = [];
        menuItemData.forEach(item => {
            if (item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText)) {
                matches.push(item.name);
                item.element.show();
            } else {
                item.element.hide();
            }
        });

        if (matches.length > 0) {
            autocompleteResults.empty();
            matches.slice(0, 5).forEach(match => {
                autocompleteResults.append(`<div class="autocomplete-item" style="padding: 0.5rem; background: white; border: 1px solid #ddd; margin-bottom: 0.5rem; border-radius: 5px; cursor: pointer;">${match}</div>`);
            });
        } else {
            autocompleteResults.empty();
        }
    });

    $(document).on('click', '.autocomplete-item', function() {
        $('.menu-search').val($(this).text()).trigger('keyup');
    });
}

function initializeSearchHighlighting() {
    $(document).off('keyup.searchHighlight').on('keyup.searchHighlight', '.menu-search', function() {
        const searchText = $(this).val();
        if (searchText.length === 0) {
            $('.menu-item').find('h4, p').each(function() {
                $(this).html($(this).data('original-text') || $(this).text());
            });
            return;
        }

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


