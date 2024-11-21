import { gameState } from './state.js';
import {logoSpin} from './ui/animations.js';
import { saveGame, loadGame, } from './saveSystem.js';
import { AUTOSAVE_INTERVAL } from './config.js';
import { updateDisplayElements, loadScreens, loadSelectedMechanic } from './ui/display.js';
import { setTheme  } from './ui/formatters.js';
import { loreModal, settingsModal } from './ui/modals.js';
import { mines } from './systems/mines.js';
import { craftingSystem } from './systems/crafting.js';
import { SmeltingSystem, smeltingSystem } from './systems/smelting.js';
import { resetGame, manualSave } from './ui/settings.js';
import { assetManager } from './systems/assetManager.js';

// Initialize systems
window.setTheme = setTheme; // Loading theme
window.onload = loreModal; // Initial Modal

loadScreens();
resetGame();
manualSave();
mines()

settingsModal();
logoSpin();

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedMechanic();
    loadGame();
    updateDisplayElements();
  
    // Set up autosave
    setInterval(() => {
        saveGame();
    }, AUTOSAVE_INTERVAL);
});

// Save before leaving
window.addEventListener('beforeunload', () => {
    saveGame();
});

// Initialize asset manager
window.addEventListener('load', async () => {
    try {
        await assetManager.preloadAssets();
        console.log('Assets loaded successfully');
    } catch (error) {
        console.error('Error loading assets:', error);
    }
});

// crafting--------------------------------------------------------
// Expose crafting function to window
window.craftItem = craftingSystem.addToQueue.bind(craftingSystem);

// smelting-----------------------------------------------------
// Expose smelting functions to window
window.addOre = function(oreType, amount) {
    smeltingSystem.addOre(oreType, amount);
    updateDisplayElements();
}

window.addFuel = function(amount) {
    smeltingSystem.addFuel(amount);
    updateDisplayElements();
}

window.startSmelting = function(recipeId) {
    if (smeltingSystem.canStartSmelting(recipeId)) {
        smeltingSystem.startSmelting(recipeId);
        updateDisplayElements();
        return true;
    }
    return false;
}

window.debugg = function() {
    console.log('Game State:', gameState);
    console.log('Smelting System:', smeltingSystem);
    console.log('Crafting System:', craftingSystem);
    return {
        gameState,
        smeltingSystem,
        craftingSystem
    };
}