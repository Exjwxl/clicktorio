export function getMechanic2() {
    return `
        <div class="smelting-page">
            <h2>Smelting Station</h2>
            
            <div class="smelter-container">
                <div class="fuel-section">
                    <h3>Fuel</h3>
                    <p>Coal in Smelter: <span id="smelterFuel">0</span></p>
                    <button onclick="window.loadCoal()">
                        Load Coal (Costs 10 Coal)
                    </button>
                </div>

                <div class="smelting-section">
                    <h3>Smelting</h3>
                    <button onclick="window.smelt('ironIngot')">
                        Smelt Iron Ingot (2 Iron Ore)
                    </button>
                    <button onclick="window.smelt('copperPlate')">
                        Smelt Copper Plate (2 Copper Ore)
                    </button>
                </div>
            </div>
        </div>
    `;
}