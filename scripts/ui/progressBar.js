export function showProgressBar() {
    const progressBarContainer = document.getElementById('progress-bar-container');
    if (progressBarContainer) {
        progressBarContainer.style.display = 'block'; // Show the progress bar
        console.log('Progress bar shown');
    } else {
        console.error('Progress bar container not found!');
    }
}

export function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    } else {
        console.error('Progress bar not found!');
    }
}

export function hideProgressBar() {
    const progressBarContainer = document.getElementById('progress-bar-container');
    if (progressBarContainer) {
        progressBarContainer.style.display = 'none';
        console.log('Progress bar hidden');
    } else {
        console.error('Progress bar container not found!');
    }
}