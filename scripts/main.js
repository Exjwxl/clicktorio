import { gameState } from './state.js';
import { handleUpgrade } from './upgrades.js';
import { startAutoClicker, stopAutoClicker, handleAutoClickerUpgrade } from './autoc.js';
import { saveGame, loadGame, showSaveIndicator} from './saveSystem.js';
import { AUTOSAVE_INTERVAL } from './config.js';
import { formatNumber, setTheme } from './formatters.js';
import { loreModal, settingsModal } from './modals.js';

window.setTheme = setTheme; // Loading theme
window.onload = loreModal; // Inital Modal

// Click handler
window.clicker = () => {
    gameState.addClicks(gameState.upgrade);
    updateDisplayElements();
};

// Upgrade handler
window.upgradeClick = () => {
    if (handleUpgrade()) {
        updateDisplayElements();
    }
};


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
export function updateDisplayElements() {
    document.getElementById('score').innerHTML = `Clicks: ${formatNumber(gameState.clicks)} (+ ${formatNumber(gameState.upgrade)})`;
    document.getElementById('upgradeCostDisplay').innerHTML = `Upgrade Cost: ${formatNumber(gameState.upgradeCost)}`;
    document.getElementById('autoClickerUpgradeCostDisplay').innerHTML = 
        `Auto Clicker Upgrade Cost: ${formatNumber(gameState.autoClickerUpgradeCost)}`;
    
}

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

