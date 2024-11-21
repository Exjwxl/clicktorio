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
    research: {
        completed: [],
        inProgress: null,
        progress: 0,
        unlocked: ['basicScience'] 
    }
};

export const RESEARCH_CONFIG = {
    basicScience: {
        name: 'Basic Science',
        description: 'Learn the fundamentals of scientific research',
        cost: {
            ironPlate: 5,
            copperPlate: 5
        },
        timeRequired: 5000, // 5 seconds
        unlocks: ['automationScience', 'basicSmelting']
    },
    automationScience: {
        name: 'Automation Science',
        description: 'Basic research that unlocks automation possibilities',
        cost: {
            redScience: 10
        },
        timeRequired: 10000,
        unlocks: ['basicAutomation', 'improvedSmelting'],
        requires: ['basicScience']
    },
    basicSmelting: {
        name: 'Basic Smelting',
        description: 'Improve your smelting efficiency by 20%',
        cost: {
            ironPlate: 10,
            coal: 5
        },
        timeRequired: 8000,
        unlocks: ['improvedSmelting'],
        requires: ['basicScience']
    },
    improvedSmelting: {
        name: 'Improved Smelting',
        description: 'More efficient smelting operations (+50% speed)',
        cost: {
            redScience: 20,
            greenScience: 10
        },
        timeRequired: 15000,
        unlocks: ['advancedSmelting'],
        requires: ['automationScience', 'basicSmelting']
    },
    advancedSmelting: {
        name: 'Advanced Smelting',
        description: 'Advanced smelting techniques (double output)',
        cost: {
            redScience: 30,
            greenScience: 20
        },
        timeRequired: 20000,
        unlocks: ['superSmelting'],
        requires: ['improvedSmelting']
    }
};
