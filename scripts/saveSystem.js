import { gameState } from './state.js';
import { startAutoClicker } from './autoclicker.js';
import { SAVE_KEY } from './config.js';

export function saveGame() {
    try {
        const gameData = {
            clicks: gameState.clicks,
            upgrade: gameState.upgrade,
            upgradeCost: gameState.upgradeCost,
            autoClickerActive: gameState.autoClickerActive,
            autoClickerSpeed: gameState.autoClickerSpeed,
            autoClickerUpgradeCost: gameState.autoClickerUpgradeCost
        };
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
        console.log('Game saved successfully');
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

export function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const gameData = JSON.parse(savedData);
            
            // Validate and load saved data
            if (typeof gameData === 'object' && gameData !== null) {
                Object.assign(gameState, gameData);
                
                // Restart autoClicker if it was active
                if (gameState.autoClickerActive) {
                    startAutoClicker();
                }
                console.log('Game loaded successfully');
                return true;
            }
        }
    } catch (error) {
        console.error('Failed to load game:', error);
    }
    return false;
}

export function clearSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear save:', error);
        return false;
    }
}

export function showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.textContent = 'Game Saved!';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.padding = '10px';
    indicator.style.backgroundColor = 'rgba(53, 31, 31, 0.5)';
    indicator.style.borderRadius = '5px';
    document.body.appendChild(indicator);
    
    setTimeout(() => indicator.remove(), 2000);
}