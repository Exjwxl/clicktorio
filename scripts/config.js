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
    craftedItems:{
        ironPlate:0,
        copperPlate:0,
        redScience:0,
    },
    systemValues:{
        efficiency: 10,

    }
};