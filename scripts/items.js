import { assetManager } from './systems/assetManager.js';

export const items = {
    'iron-ore': {
        name: "Iron Ore",
        type: "resource",
        stackSize: 50,
        getImage: () => assetManager.getAssetPath('iron-ore', 'resource')
    },
    'copper-ore': {
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
    'iron-plate': {
        name: "Iron Plate",
        type: "item",
        stackSize: 100,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'copper-plate': {
        name: "Copper Plate",
        type: "item",
        stackSize: 100,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'stone-brick': {
        name: "Stone Brick",
        type: "item",
        stackSize: 100,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    }
};

export const recipes = {
    'red-science': {
        name: "Red Science Pack",
        type: "craftedItem",
        craftTime: 5000,
        ingredients: {
            'iron-plate': 1,
            'copper-plate': 1
        },
        getImage: () => './assets/images/placeholder.png', // Temporary placeholder
        description: 'Basic science pack used for early research'
    },
    'green-science': {
        name: "Green Science Pack",
        type: "craftedItem",
        craftTime: 8000,
        ingredients: {
            'iron-plate': 5,
            'copper-plate': 5
        },
        getImage: () => './assets/images/placeholder.png', // Temporary placeholder
        description: 'Advanced science pack for intermediate research'
    }
};

export const SMELTING_RECIPES = {
    'iron-plate': {
        input: {
            'iron': 1,
        },
        output: {
            'iron-plate': 1
        },
        smeltTime: 3000, // 3 seconds per smelt
        burnValue: 1,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'copper-plate': {
        input: {
            'copper': 1,
        },
        output: {
            'copper-plate': 1
        },
        smeltTime: 3000,
        burnValue: 1,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    },
    'stone-brick': {
        input: {
            'stone': 1,
        },
        output: {
            'stone-brick': 1
        },
        smeltTime: 3000,
        burnValue: 1,
        getImage: () => './assets/images/placeholder.png' // Temporary placeholder
    }
};