import { researchSystem } from '../scripts/systems/research.js';

export function getMechanic3(){
    return `
    <div class="research-panel">
        <h2>Research</h2>
        <div id="available-research"></div>
        <div id="research-progress"></div>
    </div>
    `
}

export function initMechanic3() {
    // Initialize research display
    researchSystem.updateResearchDisplay();
}

// Event listener for tab activation
document.addEventListener('tabChanged', (event) => {
    if (event.detail === 'mechanic3') {
        researchSystem.updateResearchDisplay();
    }
});