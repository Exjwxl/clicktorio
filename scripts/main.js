import { gameState } from './state.js';
import { handleUpgrade } from './upgrades.js';
import { startAutoClicker, stopAutoClicker, handleAutoClickerUpgrade } from './autoclicker.js';
import { saveGame, loadGame, showSaveIndicator} from './saveSystem.js';
import { AUTOSAVE_INTERVAL } from './config.js';
import { formatNumber } from './formatters.js';

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

//:/

// Auto clicker handlers
window.toggleAutoClicker = () => {
    if (!gameState.autoClickerActive && gameState.clicks >= 100) {  // Cost to start auto clicker
        gameState.clicks -= 100;  // Deduct cost
        startAutoClicker();
        updateDisplayElements();
    } else if (!gameState.autoClickerActive) {
        alert('You need 100 clicks to start Auto Clicker!');
    } else {
        stopAutoClicker();
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
      gameState.reset();
      stopAutoClicker();
      updateDisplayElements();
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
    document.getElementById('score').innerHTML = `Clicks: ${formatNumber(gameState.clicks)}`;
    document.getElementById('upgradeCostDisplay').innerHTML = `Upgrade Cost: ${formatNumber(gameState.upgradeCost)}`;
    document.getElementById('autoClickerUpgradeCostDisplay').innerHTML = 
        `Auto Clicker Upgrade Cost: ${formatNumber(gameState.autoClickerUpgradeCost)}`;
}
