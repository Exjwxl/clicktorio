export const recipes = {
    redScience: {
        inputs: [{ item: 'copperPlate', amount: 1 },
                { item: 'ironPlate', amount: 1 }, 
        ],
        output: { item: 'redScience', amount: 1 }
    },
    greenScience: {
        inputs: [{ item: 'copperPlate', amount: 5 },
                { item: 'ironPlate', amount: 5 }, 
        ],
        output: { item: 'greenScience', amount: 1 }
    },

};

export const SMELTING_RECIPES = {
    ironPlate: {
        input: {
            iron: 1,
        },
        output: {
            ironPlate: 1
        },
        smeltTime: 3000, // 3 seconds per smelt
        burnValue: 1, 
    },
    copperPlate: {
        input: {
            copper: 1,
        },
        output: {
            copperPlate: 1
        },
        smeltTime: 3000,
        burnValue: 1, 

    }
};