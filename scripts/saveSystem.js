import { gameState } from './state.js';
import { SAVE_KEY, INITIAL_STATE } from './config.js';

export function saveGame() {
    try {
        const gameData = {
            resources: { ...gameState.resources },  // Create a clean copy
            craftedItems: { ...gameState.craftedItems },
            systemValues: { ...gameState.systemValues },
        };

        for (const key in gameData.resources) {
            gameData.resources[key] = Number(gameData.resources[key]) || 0;
        }
        
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
            console.log('Loading Saved data:', gameData);
            
            // Validate and load saved data
            if (typeof gameData === 'object' && gameData !== null) {
                // Start with initial state
                Object.assign(gameState, INITIAL_STATE);
                
                // Then apply the saved data
                if (gameData.resources) {
                    gameState.resources = gameData.resources;
                }
                if (gameData.craftedItems) {
                    gameState.craftedItems = gameData.craftedItems;
                }
                if (gameData.systemValues) {
                    gameState.systemValues = gameData.systemValues;
                }

                console.log('Game loaded successfully');
                return true;
            }
        } else {
            console.log('No save found, using initial state:', INITIAL_STATE);
            Object.assign(gameState, INITIAL_STATE);
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

