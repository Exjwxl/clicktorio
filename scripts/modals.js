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
