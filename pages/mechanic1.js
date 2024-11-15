export function getMechanic1() { 
    return `
    <div class="titleCard">
            <p>Mine!</p>
        </div>
        <section id="mines">
            <div class="baseinfo">
                <div id="ironMine">
                    <button id="mineIron" onclick="mineIron()">
                        Iron
                    </button>
                  
                </div>

                <div id="stoneMine">
                    <button id="mineStone" onclick="mineStone()">
                        Stone
                    </button>
                  
                </div>
                
                <div id="copperMine">
                    <button id="mineCopper" onclick="mineCopper()">
                        Copper
                    </button>
                   
                </div>

                <div id="coalMine">
                    <button id="mineCoal" onclick="mineCoal()">
                        Coal
                    </button>
               
                </div>
            </div>
`;
}