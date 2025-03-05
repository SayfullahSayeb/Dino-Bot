(function () {
    console.clear(); // Clear the console immediately when the script is executed

    // Check if the site supports the Dino game (i.e., the Runner object is available)
    if (!(window.Runner && Runner.instance_)) {
        console.log(
            "%c This site is not supported! ",
            "font-size: 24px; font-weight: bold; color: red; background: yellow; padding: 10px;"
        );
        return; // Stop execution if the site is not supported
    }

    // Create the UI for the Dino Bot and append it to the body
    let botUI = document.createElement('div');
    Object.assign(botUI.style, {
        position: 'fixed', bottom: '20px', right: '20px', width: '320px', background: '#222',
        color: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        fontSize: '14px', zIndex: '1000'
    });

    // Set the inner HTML for the Dino Bot UI
    botUI.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-weight: bold;">Dino Bot</span>
            <button id="closeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">❌</button>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <input id="scoreInput" type="text" placeholder="Enter score" style="flex: 1; padding: 8px; border: 1px solid #fff; border-radius: 4px;">
            <button id="setScoreBtn" style="flex: 1; background: #0f62fe; color: white; border: none; border-radius: 4px; cursor: pointer;">Set</button>
        </div>

        ${["Walk in Air", "Immortality", "Speed Boost", "Auto Play"].map((feature) => `
            <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span>${feature}</span>
                <label style="position: relative; display: inline-block; width: 60px; height: 30px;">
                    <input type="checkbox" id="${feature.replace(/\s+/g, '')}Toggle" style="display: none;">
                    <span class="toggle-switch"></span>
                </label>
            </div>
        `).join('')}

        <style>
            /* Styles for the toggle switch */
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

    document.body.appendChild(botUI); // Append the UI to the body of the document

    let immortalityBackup; // Backup for the immortality feature
    let autoPlayInterval; // Variable to hold the interval for auto-play functionality

    // Event listener for the "Set" button to change the score
    document.getElementById("setScoreBtn").addEventListener("click", function () {
        let newScore = document.getElementById("scoreInput").value.trim();
        if (/^\d+$/.test(newScore)) {
            // Only accept numeric input for the score
            let parsedScore = parseFloat(newScore);
            // Update the score based on the user input
            Runner.instance_.distanceRan = parsedScore / Runner.instance_.distanceMeter.config.COEFFICIENT;
            Runner.instance_.distanceMeter.update(parsedScore);
        }
    });

    // Toggle the "Walk in Air" feature
    document.getElementById("WalkinAirToggle").addEventListener("change", function () {
        // If checked, set the groundYPos to 0 (walk in air), else set it to the default height (93)
        Runner.instance_.tRex.groundYPos = this.checked ? 0 : 93;
    });

    // Toggle the "Immortality" feature
    document.getElementById("ImmortalityToggle").addEventListener("change", function () {
        if (this.checked) {
            // Backup the original gameOver function before overwriting
            immortalityBackup = Runner.prototype.gameOver;
            Runner.prototype.gameOver = function () {}; // Disable the game over function to make the dino immortal
        } else {
            // Restore the original gameOver function
            Runner.prototype.gameOver = immortalityBackup;
        }
    });

    // Toggle the "Speed Boost" feature
    document.getElementById("SpeedBoostToggle").addEventListener("change", function () {
        // Set speed to 15 if checked, else set it to 10
        Runner.instance_.setSpeed(this.checked ? 15 : 10);
    });

    // Toggle the "Auto Play" feature
    document.getElementById("AutoPlayToggle").addEventListener("change", function () {
        if (this.checked) {
            // If Auto Play is turned on, start auto-play interval
            autoPlayInterval = setInterval(function () {
                const KEY_CODE_SPACE_BAR = 32;
                const KEY_CODE_ARROW_DOWN = 40;
                const CANVAS_HEIGHT = Runner.instance_.dimensions.HEIGHT;
                const DINO_HEIGHT = Runner.instance_.tRex.config.HEIGHT;

                const obstacle = Runner.instance_.horizon.obstacles[0];
                const speed = Runner.instance_.currentSpeed;

                if (obstacle) {
                    const w = obstacle.width;
                    const x = obstacle.xPos; // measured from left of canvas
                    const y = obstacle.yPos; // measured from top of canvas
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
            }, Runner.instance_.msPerFrame); // Run the auto-play every frame
        } else {
            // Stop auto-play if the toggle is unchecked
            clearInterval(autoPlayInterval);
        }
    });

    // Function to simulate keypress events
    function dispatchKey(type, key) {
        document.dispatchEvent(new KeyboardEvent(type, { keyCode: key }));
    }

    // Event listener to close the bot UI
    document.getElementById("closeBotUI").addEventListener("click", () => botUI.remove());
})();
