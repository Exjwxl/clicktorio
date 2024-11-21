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
        redScience:0,
        greenScience:0,
    },
    systemValues:{
        efficiency: 10,
        smelterFuel:0,
    },
    smeltedItems:{
        ironPlate:0,
        copperPlate:0,
    },
    smeltingBuffer: {
        iron: 0,
        copper: 0,
        stone: 0,
    },
};
