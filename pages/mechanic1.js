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
                <p id="efficiency"></p>        
                </div>
            </section>   
                <div class="smelting-container">
                <!-- Smelting buttons -->
                <h2>Smelting</h2>
                <span>Smelt Iron </span>
                <button onclick="addOre('iron',1)">x1</button>
                <button onclick="addOre('iron',5)">x5</button>
                <span>Smelt Copper </span>
                
                <button onclick="addOre('copper',1)">x1</button>
                <button onclick="addOre('copper',5)">x5</button>
                <button onclick="addFuel(10)">Add 10 Coal</button>
                <p id="smelterFuel"></p>
                
                <!-- Active smelting operations will appear here -->
                <div id="active-smelting" class="active-smelting"></div>
                </div>

                <!-- Progress bar outside smelting container -->
                <div id="progress-bar-container" style="display: none;">
                    <div id="progress-bar" class="progress-bar" style="width: 0%;"></div>
                </div>

               </div>
    </div>
`;
}