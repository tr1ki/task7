// Rating stars logic

let currentRating = 0;

function initializeRating() {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, i) => {
        star.addEventListener('click', () => {
            setRating(i + 1);
            playSound('click');
        });
        star.addEventListener('mouseenter', () => highlightStars(i + 1));
    });
    const container = document.querySelector('.rating-container');
    container && container.addEventListener('mouseleave', () => highlightStars(currentRating));
}

function setRating(r) {
    currentRating = r;
    highlightStars(r);
    const feedback = document.querySelector('.rating-feedback');
    if (feedback) {
        feedback.textContent = `You rated: ${r} star${r > 1 ? 's' : ''}`;
        feedback.style.opacity = '1';
    }
}

function highlightStars(r) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, i) => {
        star.style.color = i < r ? '#ffd700' : '#ddd';
        star.style.transform = i < r ? 'scale(1.1)' : 'scale(1)';
    });
}


