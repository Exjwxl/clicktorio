export function getMechanic1() { 
    return `
    <div class="titleCard">
            <p>Mine!</p>
        </div>
        <section id="mines">
            <div class="baseinfo">
                <div id="ironMine">
                    <button id="mineIron" onclick="mineIron()">
                    <img src="./assets/images/resources/iron-ore.png">
                    <p> Iron </p>
                    </button>
                  
                </div>

                <div id="stoneMine">
                    <button id="mineStone" onclick="mineStone()">
                    <img src="./assets/images/resources/stone.png">
                    <p> Stone </p>
                    </button>
                  
                </div>
                
                <div id="copperMine">
                    <button id="mineCopper" onclick="mineCopper()">
                    <img src="./assets/images/resources/copper-ore.png">
                    <p> Copper </p>
                    </button>
                   
                </div>

                <div id="coalMine">
                    <button id="mineCoal" onclick="mineCoal()">
                    <img src="./assets/images/resources/coal.png">
                    <p> Coal </p>
                    </button>
               
                </div>

                </div>
                
                <div class="crafting-page">
                   <h2>Crafting</h2>

                <button onclick="window.craftItem('redScience')">
                    <img src="./assets/images/craftedItems/red-science.png">
                    <p> 1 iron & Copper Plate </p>
                </button>
                <button onclick="window.craftItem('greenScience')">
                    Craft Green Science (5 copper and Iron Plate)
                </button>
               
                
                
               </div>
    </div>
`;
}