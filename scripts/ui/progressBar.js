export function showProgressBar(recipeId) {
    const progressBarContainer = document.getElementById(`progress-bar-container-${recipeId}`);
    if (!progressBarContainer) {
        // Create progress bar container if it doesn't exist
        const container = document.createElement('div');
        container.id = `progress-bar-container-${recipeId}`;
        container.className = 'progress-bar-container';
        
        // Create the progress bar element
        const progressBar = document.createElement('div');
        progressBar.id = `progress-bar-${recipeId}`;
        progressBar.className = 'progress-bar';
        progressBar.style.width = '0%';
        
        container.appendChild(progressBar);
        
        // Add it to the smelting operation
        const smeltingOp = document.querySelector(`[data-recipe-id="${recipeId}"]`);
        if (smeltingOp) {
            smeltingOp.appendChild(container);
        }
    } else {
        progressBarContainer.style.display = 'block';
    }
}

export function updateProgressBar(recipeId, percentage) {
    const progressBar = document.getElementById(`progress-bar-${recipeId}`);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

export function hideProgressBar(recipeId) {
    const progressBarContainer = document.getElementById(`progress-bar-container-${recipeId}`);
    if (progressBarContainer) {
        progressBarContainer.style.display = 'none';
    }
}