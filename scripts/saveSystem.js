import { gameState } from './state.js';
import { SAVE_KEY, INITIAL_STATE } from './config.js';
import { smeltingSystem } from './systems/smelting.js';

export function saveGame() {
    try {
        const gameData = {
            resources: { ...gameState.resources },
            craftedItems: { ...gameState.craftedItems },
            smeltedItems: { ...gameState.smeltedItems },
            systemValues: { ...gameState.systemValues },
            smelting: {
                buffer: { ...smeltingSystem.buffer },
                queues: { ...smeltingSystem.smeltingQueues },
                isProcessing: { ...smeltingSystem.isProcessing },
                paused: { ...smeltingSystem.paused },
                currentProgress: { ...smeltingSystem.currentProgress }
            }
        };

        // Ensure all numeric values are properly converted
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
            
            if (typeof gameData === 'object' && gameData !== null) {
                // Start with initial state
                Object.assign(gameState, INITIAL_STATE);
                
                // Load basic game state
                if (gameData.resources) {
                    gameState.resources = gameData.resources;
                }
                if (gameData.craftedItems) {
                    gameState.craftedItems = gameData.craftedItems;
                }
                if (gameData.smeltedItems) {
                    gameState.smeltedItems = gameData.smeltedItems;
                }
                if (gameData.systemValues) {
                    gameState.systemValues = gameData.systemValues;
                }

                // Load smelting system state
                if (gameData.smelting) {
                    if (gameData.smelting.buffer) {
                        smeltingSystem.buffer = gameData.smelting.buffer;
                    }
                    if (gameData.smelting.queues) {
                        smeltingSystem.smeltingQueues = gameData.smelting.queues;
                    }
                    if (gameData.smelting.isProcessing) {
                        smeltingSystem.isProcessing = gameData.smelting.isProcessing;
                    }
                    if (gameData.smelting.paused) {
                        smeltingSystem.paused = gameData.smelting.paused;
                    }
                    if (gameData.smelting.currentProgress) {
                        smeltingSystem.currentProgress = gameData.smelting.currentProgress;
                    }

                    // Resume any active smelting operations
                    for (const resource in smeltingSystem.smeltingQueues) {
                        if (smeltingSystem.smeltingQueues[resource].length > 0 && !smeltingSystem.isProcessing[resource]) {
                            smeltingSystem.processQueue(resource);
                        }
                    }
                }

                // Update UI
                smeltingSystem.updateActiveSmeltingDisplay();
                console.log('Game loaded successfully');
                return true;
            }
        } else {
            console.log('No save found, using initial state:', INITIAL_STATE);
            Object.assign(gameState, INITIAL_STATE);
            // Initialize empty smelting state
            smeltingSystem.buffer = {};
            smeltingSystem.smeltingQueues = {};
            smeltingSystem.isProcessing = {};
            smeltingSystem.paused = {};
            smeltingSystem.currentProgress = {};
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