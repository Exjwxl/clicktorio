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
                    <h4 id="ironOre"></h4>
                </div>

                <div id="stoneMine"></div>
                    <button id="mineStone" onclick="mineStone()">
                        Stone
                    </button>
                    <h4 id="stone"></h4>
                </div>
                
                <div id="copperMine">
                    <button id="mineCopper" onclick="mineCopper()">
                        Copper
                    </button>
                    <h4 id="copperOre"></h4>
                </div>

                <div id="coalMine">
                    <button id="mineCoal" onclick="mineCoal()">
                        Coal
                    </button>
                    <h4 id="coal"></h4>
                </div>
            </div>
`;
}