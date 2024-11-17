import { gameState } from './state.js';
import {logoSpin, showSaveIndicator} from './ui/animations.js';
import { saveGame, loadGame, } from './saveSystem.js';
import { AUTOSAVE_INTERVAL } from './config.js';
import { updateDisplayElements, loadScreens, loadSelectedMechanic } from './ui/display.js';
import { setTheme  } from './ui/formatters.js';
import { loreModal, settingsModal } from './ui/modals.js';
import { mines } from './systems/mines.js';
import { CraftingSystem } from './systems/crafting.js';

const craftingSystem = new CraftingSystem();


window.setTheme = setTheme; // Loading theme
window.onload = loreModal; // Inital Modal
loadScreens();
mines()

//manual save
window.manualSave = () => {
  saveGame();
  showSaveIndicator();
};

// Reset game handler
window.resetGame = () => {
  if (confirm('Are you sure you want to reset the game? This cannot be undone!')) {
      localStorage.removeItem('clickerGameSave');
      localStorage.removeItem('loreModalShown');
      gameState.reset();
      stopAutoClicker();
      updateDisplayElements();
      location.reload();
    
  }
};

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



settingsModal();
logoSpin();



// ---------------------------------------------------------


window.craftItem = (recipeId) => {
    if (craftingSystem.craft(recipeId)) {
        updateDisplayElements();
        console.log(gameState.craftedItems);
        
        
        
    } else {
        alert('Not enough resources!');
    }
};


