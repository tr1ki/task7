// Image gallery logic

let currentImageIndex = 0;

function initializeGallery() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach((img, i) => {
        img.addEventListener('click', () => {
            switchMainImage(img.src, i);
            playSound('click');
        });
    });
}

function switchMainImage(src, i) {
    const mainImage = document.querySelector('.main-gallery-image');
    if (!mainImage) return;
    animateElement(mainImage, { opacity: '0', transform: 'scale(0.8)' }, 200);
    setTimeout(() => {
        mainImage.src = src;
        currentImageIndex = i;
        animateElement(mainImage, { opacity: '1', transform: 'scale(1)' }, 200);
    }, 200);
}


