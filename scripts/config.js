export const MAX_CLICKS = 1_000_000_000_000; // 1 trillion
export const AUTOSAVE_INTERVAL = 30000; // 30 seconds
export const SAVE_KEY = 'clickerGameSave';

export const INITIAL_STATE = {
    resources:{
        iron: 0,
        stone: 0,
        copper:0,
        coal:0,
    },
    efficiency: 1,
    upgradeCost: 10,
    autoClickerActive: false,
    autoClickerSpeed: 1000,
    autoClickerUpgradeCost: 100
};