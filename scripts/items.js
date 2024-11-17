export const recipes = {
    ironIngot: {
        inputs: [{ item: 'iron', amount: 2 },
        ],
        output: { item: 'ironIngot', amount: 1 }
    },
    copperPlate: {
        inputs: [{ item: 'copper', amount: 2 },
        ],
        output: { item: 'copperPlate', amount: 1 }
    },
    redScience: {
        inputs: [{ item: 'copperPlate', amount: 1 },
                { item: 'ironIngot', amount: 1 }, 
        ],
        output: { item: 'redScience', amount: 1 }
    },

};
