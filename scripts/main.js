import { gameState } from './state.js';
import { handleUpgrade } from './upgrades.js';
import { startAutoClicker, stopAutoClicker, handleAutoClickerUpgrade } from './autoc.js';
import { saveGame, loadGame, showSaveIndicator} from './saveSystem.js';
import { AUTOSAVE_INTERVAL } from './config.js';
import { setTheme  } from './formatters.js';
import { updateDisplayElements } from './display.js';
import { loreModal, settingsModal } from './modals.js';
import {getMechanic1} from '../pages/mechanic1.js';
import {getMechanic2} from '../pages/mechanic2.js';
import {getMechanic3} from '../pages/mechanic3.js';

window.setTheme = setTheme; // Loading theme
window.onload = loreModal; // Inital Modal


window.mineIron = () => {
    gameState.updateResource('iron',gameState.efficiency);
};

window.mineStone = () => {
    gameState.updateResource('stone',gameState.efficiency);
};

window.mineCopper = () => {
    gameState.updateResource('copper',gameState.efficiency);
};

window.mineCoal = () => {
    gameState.updateResource('coal',gameState.efficiency);
};


// Upgrade handler
window.upgradeClick = () => {
    if (handleUpgrade()) {
        updateDisplayElements();
    }
};
//Screen functions
function defaultScreeen(){
    document.getElementById('game').innerHTML = getMechanic1();
}

function switchContent(getMechanicContent) {
    document.getElementById('game').innerHTML = getMechanicContent();
    updateDisplayElements();
}

document.getElementById('loadMechanic1').addEventListener('click', () => switchContent(getMechanic1));
document.getElementById('loadMechanic2').addEventListener('click', () => switchContent(getMechanic2));
document.getElementById('loadMechanic3').addEventListener('click', () => switchContent(getMechanic3));


// Auto clicker handlers
window.toggleAutoClicker = () => {
    if (gameState.autoClickerActive) {
        stopAutoClicker();
        return;
    }

    if (gameState.clicks >= 100) {
        gameState.clicks -= 100;
        startAutoClicker();
        updateDisplayElements();
    } else {
        alert('You need 100 clicks to start Auto Clicker!');
    }
};

window.upgradeAutoClicker = () => {
    if (handleAutoClickerUpgrade()) {
        updateDisplayElements();
    }
};
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
document.addEventListener('DOMContentLoaded', () => {
  defaultScreeen(); // Initial screen
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

// Display update - now includes auto clicker cost


settingsModal();

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

