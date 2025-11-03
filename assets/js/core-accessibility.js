// Keyboard navigation for nav links

function handleKeyboardNavigation(e) {
    const items = document.querySelectorAll('.nav-link');
    const idx = [...items].findIndex(i => i === document.activeElement);
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        items[idx <= 0 ? items.length - 1 : idx - 1]?.focus();
    } else if (['Enter', ' '].includes(e.key)) {
        if (document.activeElement.classList.contains('nav-link')) {
            e.preventDefault();
            document.activeElement.click();
        }
    }
}


