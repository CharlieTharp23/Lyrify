const albumCovers = document.querySelectorAll('.album-covers img');
let currentIndex = 0;

function updateCovers() {
    albumCovers.forEach((cover, index) => {
        cover.classList.remove('active'); // Remove active class from all covers
        if (index === currentIndex) {
            cover.classList.add('active'); // Add active class to the current cover
        }
    });

    // Move to the next cover
    currentIndex = (currentIndex + 1) % albumCovers.length;
}

// Change active cover every 2.5 seconds
setInterval(updateCovers, 2500);