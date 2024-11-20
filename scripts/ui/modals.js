export function loreModal(){
    const modal = document.getElementById('loreModal');
    const closeButton = document.querySelector('.close-button');
    
           // Check if the modal has been shown before
    if (!localStorage.getItem('loreModalShown')) {
            // Show the modal
        modal.style.display = 'block';
    
            // Set a flag in localStorage
        localStorage.setItem('loreModalShown', 'true');
    }
    
        // Close the modal when the close button is clicked
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };
    
        // Close the modal when clicking outside of the modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
};

export function settingsModal(){
    document.addEventListener('DOMContentLoaded', () => {
        const optionsButton = document.getElementById('optionsButton');
        const optionsModal = document.getElementById('settingsModal');
        const closeOptions = document.querySelector('.close-options');
    
        // Show the options modal when the Options button is clicked
        optionsButton.addEventListener('click', () => {
            optionsModal.style.display = 'block';
        });
    
        // Close the options modal when the close button is clicked
        closeOptions.addEventListener('click', () => {
            optionsModal.style.display = 'none';
        });
    
        // Close the options modal when clicking outside of the modal content
        window.addEventListener('click', (event) => {
            if (event.target === optionsModal) {
                optionsModal.style.display = 'none';
            }
        });
    });
}