export function logoSpin(){
    document.addEventListener('DOMContentLoaded', () => {
        const logoImage = document.querySelector('.gameTitle img');
    
        logoImage.addEventListener('click', () => {
            // Start with a fast spin
            let duration = 2;
            logoImage.style.animationDuration = `${duration}s`;
    
            // Function to gradually slow down the animation
            const slowDown = () => {
                duration += 0.05; // Gradually increase duration to slow down
                logoImage.style.animationDuration = `${duration}s`;
    
                // Continue slowing down until reaching the normal speed
                if (duration < 7) {
                    requestAnimationFrame(slowDown);
                }
            };
    
            // Start the slowdown process
            requestAnimationFrame(slowDown);
        });
    });
}

export function showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.textContent = 'Game Saved!';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.padding = '10px';
    indicator.style.backgroundColor = 'rgba(53, 31, 31, 0.5)';
    indicator.style.borderRadius = '5px';
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 2000);
}