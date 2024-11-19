import { gameState } from './state.js';
import {logoSpin} from './ui/animations.js';
import { saveGame, loadGame, } from './saveSystem.js';
import { AUTOSAVE_INTERVAL } from './config.js';
import { updateDisplayElements, loadScreens, loadSelectedMechanic } from './ui/display.js';
import { setTheme  } from './ui/formatters.js';
import { loreModal, settingsModal } from './ui/modals.js';
import { mines } from './systems/mines.js';
import { CraftingSystem } from './systems/crafting.js';
import { SmeltingSystem } from './systems/smelting.js';
import { resetGame, manualSave } from './ui/settings.js';

const craftingSystem = new CraftingSystem();
export const smeltingSystem = new SmeltingSystem();

window.setTheme = setTheme; // Loading theme
window.onload = loreModal; // Inital Modal

loadScreens();
resetGame();
manualSave();
mines()

settingsModal();
logoSpin();



// Initialize game
document.addEventListener('DOMContentLoaded', () => {// Initial screen
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





// crafting--------------------------------------------------------


window.craftItem = (recipeId) => {
    if (craftingSystem.craft(recipeId)) {
        console.log(gameState.craftedItems);
        updateDisplayElements();
        
        
        
    } else {
        alert('Not enough resources!');
    }
};


// smelting-----------------------------------------------------
window.smeltingSystem = smeltingSystem

window.startSmelting = (recipeId) => {
    if (smeltingSystem.startSmelting(recipeId)) {
        updateDisplayElements();

    } else {
        console.log('Failed to start smelting');
        alert('Not enough resources or fuel!');
    }
};

window.debugg = () =>{
    console.log(gameState.smeltedItems);
    console.log(gameState.craftedItems);
    console.log(gameState.resources);
}