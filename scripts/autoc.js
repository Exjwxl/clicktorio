import { gameState } from './state.js';
import { updateDisplayElements } from './display.js';

let autoClickerInterval = null;

export function startAutoClicker() {
    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
    }
    
    autoClickerInterval = setInterval(() => {
        gameState.addClicks(gameState.upgrade);
        updateDisplayElements();
    }, gameState.autoClickerSpeed);
    
    gameState.autoClickerActive = true;
    document.getElementById("autoClicker").innerHTML = "Stop Auto Clicker";
}

export function stopAutoClicker() {
    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
        autoClickerInterval = null;
    }
    gameState.autoClickerActive = false;
    document.getElementById("autoClicker").innerHTML = "Start Auto Clicker";
}

export function handleAutoClickerUpgrade() {
    if (gameState.clicks >= gameState.autoClickerUpgradeCost) {
        gameState.clicks -= gameState.autoClickerUpgradeCost;
        gameState.autoClickerUpgradeCost = Math.floor(gameState.autoClickerUpgradeCost * 2);
        gameState.autoClickerSpeed = Math.max(100, gameState.autoClickerSpeed -= 100);
        
        // Restart autoClicker if it's active to apply new speed
        if (gameState.autoClickerActive) {
            startAutoClicker();
            console.log(gameState.autoClickerSpeed);
            
        }
        return true;
    } else {
        alert(`You need ${Math.ceil(gameState.autoClickerUpgradeCost - gameState.clicks)} more clicks to upgrade Auto Clicker!`);
        return false;
    }
}