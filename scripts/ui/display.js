import { formatNumber } from "../ui/formatters.js";
import { gameState } from "../state.js";
import { getMechanic1 } from '../../pages/mechanic1.js';
import { getMechanic2 } from '../../pages/mechanic2.js';
import { getMechanic3, initMechanic3 } from '../../pages/mechanic3.js';
import { researchSystem } from '../systems/research.js';

export function updateDisplayElements() {
    // Helper function to safely update element with optional formatting
    const updateElement = (id, value, prefix = '', suffix = '') => {
        const element = document.getElementById(id);
        if (element) {
            const formattedValue = typeof value === 'number' ? formatNumber(value) : value;
            element.innerHTML = `${prefix}${formattedValue}${suffix}`;
        }
    };

    // Update each element safely
    updateElement('efficiency', gameState.systemValues.efficiency, 'Efficiency: ');
    updateElement('smelterFuel', gameState.systemValues.smelterFuel, 'Fuel: ');
    updateElement('ironOre', gameState.resources.iron, 'Iron Ore: ');
    updateElement('stone', gameState.resources.stone, 'Stone: ');
    updateElement('copperOre', gameState.resources.copper, 'Copper Ore: ');
    updateElement('coal', gameState.resources.coal, 'Coal: ');
    updateElement('ironPlates', gameState.smeltedItems.ironPlate);
    updateElement('copperPlate', gameState.smeltedItems.copperPlate);
    updateElement('redScience', gameState.craftedItems.redScience);
    updateElement('greenScience', gameState.craftedItems.greenScience);

    // Update research display if on research tab
    const researchPanel = document.querySelector('.research-panel');
    if (researchPanel) {
        researchSystem.updateResearchDisplay();
    }
}

export function loadScreens(){
    document.getElementById('loadMechanic1').addEventListener('click', () => switchContent(getMechanic1));
    document.getElementById('loadMechanic2').addEventListener('click', () => switchContent(getMechanic2));
    document.getElementById('loadMechanic3').addEventListener('click', () => {
        switchContent(getMechanic3);
        // Initialize research when switching to mechanic3
        initMechanic3();
    });
}

// Add this function to load the correct mechanic
export function loadSelectedMechanic() {
    const selectedMechanic = localStorage.getItem('selectedMechanic') || 'mechanic1';
    switch(selectedMechanic) {
        case 'mechanic1':
            switchContent(getMechanic1);
            break;
        case 'mechanic2':
            switchContent(getMechanic2);
            break;
        case 'mechanic3':
            switchContent(getMechanic3);
            break;
        default:
            switchContent(getMechanic1);
    }
}

// Modify your switchContent function
export function switchContent(getMechanicContent) {
    const gameSection = document.getElementById('game');
    if (gameSection) {
        gameSection.innerHTML = getMechanicContent();
    }
    
    // Save the selected mechanic
    const mechanicName = getMechanicContent.name.replace('get', '').toLowerCase();
    localStorage.setItem('selectedMechanic', mechanicName);
}