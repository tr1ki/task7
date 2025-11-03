// Initialize all vanilla JS features

function initializeApp() {
    console.log('🍕 Initializing Bobo Pizza Interactive Features...');
    initializeTheme();
    initializeRating();
    initializeGallery();
    initializeMenuFilter();
    processMenuItems();
    attachPhoneMask();

    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle && themeToggle.addEventListener('click', toggleTheme);
    const timeButton = document.querySelector('.time-button');
    timeButton && timeButton.addEventListener('click', handleTimeButtonClick);
    const resetButton = document.querySelector('.reset-button');
    resetButton && resetButton.addEventListener('click', handleResetButtonClick);
    const submitNameButton = document.querySelector('.submit-name');
    submitNameButton && submitNameButton.addEventListener('click', handleNameSubmission);
    document.addEventListener('keydown', handleKeyboardNavigation);
    wireOrderButtons();

    console.log('✅ Bobo Pizza Interactive Features Initialized!');
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initializeApp)
    : initializeApp();


