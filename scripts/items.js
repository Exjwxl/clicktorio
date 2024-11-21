import { assetManager } from './systems/assetManager.js';

export const items = {
    'ironOre': {
        name: "Iron Ore",
        type: "resource",
        stackSize: 50,
        getImage: () => assetManager.getAssetPath('iron-ore', 'resource')
    },
    'copperOre': {
        name: "Copper Ore",
        type: "resource",
        stackSize: 50,
        getImage: () => assetManager.getAssetPath('copper-ore', 'resource')
    },
    'iron': {
        name: "Iron",
        type: "resource",
        stackSize: 50,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'copper': {
        name: "Copper",
        type: "resource",
        stackSize: 50,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'stone': {
        name: "Stone",
        type: "resource",
        stackSize: 50,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'ironPlate': {
        name: "Iron Plate",
        type: "item",
        stackSize: 100,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'copperPlate': {
        name: "Copper Plate",
        type: "item",
        stackSize: 100,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'stoneBrick': {
        name: "Stone Brick",
        type: "item",
        stackSize: 100,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    }
};

export const recipes = {
    'redScience': {
        name: "Red Science Pack",
        type: "craftedItem",
        craftTime: 5000,
        ingredients: {
            'ironPlate': 1,
            'copperPlate': 1
        },
        getImage: () => './assets/images/placeholder.png', // Temporary placeholder
        description: 'Basic science pack used for early research'
    },
    'greenScience': {
        name: "Green Science Pack",
        type: "craftedItem",
        craftTime: 8000,
        ingredients: {
            'ironPlate': 5,
            'copperPlate': 5
        },
        getImage: () => './assets/images/placeholder.png', // Temporary placeholder
        description: 'Advanced science pack for intermediate research'
    }
};

export const SMELTING_RECIPES = {
    'ironPlate': {
        input: {
            'iron': 1,
        },
        output: {
            'ironPlate': 1
        },
        smeltTime: 3000, // 3 seconds per smelt
        burnValue: 1,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'copperPlate': {
        input: {
            'copper': 1,
        },
        output: {
            'copperPlate': 1
        },
        smeltTime: 3000,
        burnValue: 1,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'stoneBrick': {
        input: {
            'stone': 1,
        },
        output: {
            'stoneBrick': 1
        },
        smeltTime: 3000,
        burnValue: 1,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    }
};