import { formatNumber } from "../ui/formatters.js";
import { gameState } from "../state.js";
import {getMechanic1} from '../../pages/mechanic1.js';
import {getMechanic2} from '../../pages/mechanic2.js';
import {getMechanic3} from '../../pages/mechanic3.js';
import { smeltingSystem } from "../main.js";

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
    updateElement('ironOre', gameState.resources.iron, 'Iron Ore: ');
    updateElement('stone', gameState.resources.stone, 'Stone: ');
    updateElement('copperOre', gameState.resources.copper, 'Copper Ore: ');
    updateElement('coal', gameState.resources.coal, 'Coal: ');
    updateElement('ironPlates', gameState.smeltedItems.ironPlate);
    updateElement('copperPlate', gameState.smeltedItems.copperPlate);
    updateElement('redScience', gameState.craftedItems.redScience);
    updateElement('greenScience', gameState.craftedItems.greenScience);
    updateElement('smelterFuel',smeltingSystem.fuelAmount);
}


export function loadScreens(){
    document.getElementById('loadMechanic1').addEventListener('click', () => switchContent(getMechanic1));
    document.getElementById('loadMechanic2').addEventListener('click', () => switchContent(getMechanic2));
    document.getElementById('loadMechanic3').addEventListener('click', () => switchContent(getMechanic3));

}

// ... (previous imports)

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
function switchContent(getMechanicContent) {
    document.getElementById('game').innerHTML = getMechanicContent();
    // Store the current mechanic
    if (getMechanicContent === getMechanic1) {
        localStorage.setItem('selectedMechanic', 'mechanic1');
    } else if (getMechanicContent === getMechanic2) {
        localStorage.setItem('selectedMechanic', 'mechanic2');
    } else if (getMechanicContent === getMechanic3) {
        localStorage.setItem('selectedMechanic', 'mechanic3');
    }
    updateDisplayElements();
}

// Replace defaultScreen function call with loadSelectedMechanic


// ... (rest of your code)