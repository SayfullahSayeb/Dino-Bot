(function () {
    let botUI = document.createElement('div');
    Object.assign(botUI.style, {
        position: 'fixed', bottom: '20px', right: '20px', width: '320px', background: '#222',
        color: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        fontSize: '14px', zIndex: '1000'
    });

    botUI.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-weight: bold;">Dino Bot</span>
            <button id="closeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">❌</button>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <input id="scoreInput" type="text" placeholder="Enter score" style="flex: 1; padding: 8px; border: 1px solid #fff; border-radius: 4px;">
            <button id="setScoreBtn" style="flex: 1; background: #0f62fe; color: white; border: none; border-radius: 4px; cursor: pointer;">Set</button>
        </div>

        ${["Walk in Air", "Immortality", "Speed Boost", "Auto Play"].map((feature, index) => `
            <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span>${feature}</span>
                <label style="position: relative; display: inline-block; width: 60px; height: 30px;">
                    <input type="checkbox" id="${feature.replace(/\s+/g, '')}Toggle" style="display: none;">
                    <span class="toggle-switch"></span>
                </label>
            </div>
        `).join('')}

        <style>
            .toggle-switch {
                position: absolute; top: 3px; left: 3px; width: 24px; height: 24px;
                background-color: #fff; border-radius: 50%; transition: transform 0.3s;
            }
            label {
                background-color: #ccc; border-radius: 15px; width: 60px; height: 30px;
                display: flex; align-items: center; cursor: pointer; transition: background-color 0.3s;
            }
            input:checked + .toggle-switch {
                transform: translateX(30px);
                background-color: #4caf50;
            }
            input:checked + label {
                background-color: #4caf50;
            }
        </style>
    `;

    document.body.appendChild(botUI);

    let immortalityBackup;
    let autoPlayInterval;

    document.getElementById("setScoreBtn").addEventListener("click", function () {
        let newScore = document.getElementById("scoreInput").value.trim();
        if (/^\d+$/.test(newScore)) {
            let parsedScore = parseFloat(newScore);
            Runner.instance_.distanceRan = parsedScore / Runner.instance_.distanceMeter.config.COEFFICIENT;
            Runner.instance_.distanceMeter.update(parsedScore);
        }
    });

    document.getElementById("WalkinAirToggle").addEventListener("change", function () {
        Runner.instance_.tRex.groundYPos = this.checked ? 0 : 93;
    });

    document.getElementById("ImmortalityToggle").addEventListener("change", function () {
        if (this.checked) {
            immortalityBackup = Runner.prototype.gameOver;
            Runner.prototype.gameOver = function () {};
        } else {
            Runner.prototype.gameOver = immortalityBackup;
        }
    });

    document.getElementById("SpeedBoostToggle").addEventListener("change", function () {
        Runner.instance_.setSpeed(this.checked ? 100 : 10);
    });

    document.getElementById("AutoPlayToggle").addEventListener("change", function () {
        if (this.checked) {
            function dispatchKey(type, key) {
                document.dispatchEvent(new KeyboardEvent(type, { keyCode: key }));
            }
            autoPlayInterval = setInterval(function () {
                const KEY_CODE_SPACE_BAR = 32;
                const KEY_CODE_ARROW_DOWN = 40;
                const CANVAS_HEIGHT = Runner.instance_.dimensions.HEIGHT;
                const DINO_HEIGHT = Runner.instance_.tRex.config.HEIGHT;

                const obstacle = Runner.instance_.horizon.obstacles[0];
                const speed = Runner.instance_.currentSpeed;

                if (obstacle) {
                    const w = obstacle.width;
                    const x = obstacle.xPos;
                    const y = obstacle.yPos;
                    const yFromBottom = CANVAS_HEIGHT - y - obstacle.typeConfig.height;
                    const isObstacleNearby = x < 25 * speed - w / 2;

                    if (isObstacleNearby) {
                        if (yFromBottom > DINO_HEIGHT) {
                            // Pterodactyl going from above, do nothing
                        } else if (y > CANVAS_HEIGHT / 2) {
                            // Jump
                            dispatchKey("keyup", KEY_CODE_ARROW_DOWN);
                            dispatchKey("keydown", KEY_CODE_SPACE_BAR);
                        } else {
                            // Duck
                            dispatchKey("keydown", KEY_CODE_ARROW_DOWN);
                        }
                    }
                }
            }, Runner.instance_.msPerFrame);
        } else {
            clearInterval(autoPlayInterval);
        }
    });

    document.getElementById("closeBotUI").addEventListener("click", () => botUI.remove());
})();
