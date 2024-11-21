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
            research: {
                completed: [...gameState.research.completed],
                unlocked: [...gameState.research.unlocked],
                inProgress: gameState.research.inProgress,
                progress: gameState.research.progress
            },
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

                // Load research state
                if (gameData.research) {
                    gameState.research = {
                        completed: gameData.research.completed || [],
                        unlocked: gameData.research.unlocked || [],
                        inProgress: gameData.research.inProgress || null,
                        progress: gameData.research.progress || 0
                    };
                }

                // Load smelting state
                if (gameData.smelting) {
                    smeltingSystem.buffer = gameData.smelting.buffer || {};
                    smeltingSystem.smeltingQueues = gameData.smelting.queues || {};
                    smeltingSystem.isProcessing = gameData.smelting.isProcessing || {};
                    smeltingSystem.paused = gameData.smelting.paused || {};
                    smeltingSystem.currentProgress = gameData.smelting.currentProgress || {};
                }

                console.log('Game loaded successfully');
                return true;
            }
        }
        
        console.log('No saved game found, starting new game');
        Object.assign(gameState, INITIAL_STATE);
        return false;
    } catch (error) {
        console.error('Failed to load game:', error);
        Object.assign(gameState, INITIAL_STATE);
        return false;
    }
}

export function clearSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        Object.assign(gameState, INITIAL_STATE);
        console.log('Save cleared successfully');
        return true;
    } catch (error) {
        console.error('Failed to clear save:', error);
        return false;
    }
}