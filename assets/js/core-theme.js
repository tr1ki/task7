// Theme toggle with localStorage persistence

let isDarkTheme = false;

function toggleTheme() {
    const btn = document.querySelector('.theme-toggle');
    isDarkTheme = !isDarkTheme;
    playSound('click');
    document.body.classList.toggle('dark-theme', isDarkTheme);
    if (btn) btn.textContent = isDarkTheme ? '☀️ Day Mode' : '🌙 Night Mode';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function initializeTheme() {
    const btn = document.querySelector('.theme-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        isDarkTheme = true;
        document.body.classList.add('dark-theme');
        if (btn) btn.textContent = '☀️ Day Mode';
    }
}


