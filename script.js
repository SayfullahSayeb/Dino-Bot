(async function() {
    let botRunning = false;
    let autoJumpInterval;

    // Function to display the menu
    function displayMenu() {
        console.clear();
        console.log("%cChoose an option:\n1. Activate/Stop Bot\n2. Edit Current Running Score\n3. Check if Site is Supported", "font-size: 16px; color: blue;");
        console.log("%cType your choice below and press Enter:", "font-size: 16px; color: blue;");
    }

    // Function to handle user input
    function handleInput(input) {
        switch (input.trim()) {
            case '1':
                botRunning ? stopBot() : activateBot();
                break;
            case '2':
                let newCurrentScore = prompt("Enter the new current score:");
                if (newCurrentScore) {
                    Runner.instance_.distanceRan = parseFloat(newCurrentScore);
                    Runner.instance_.distanceMeter.update(Runner.instance_.distanceRan);
                    console.log("%cCurrent score updated to " + newCurrentScore, "font-size: 16px; color: green;");
                }
                break;
            case '3':
                checkSiteSupport();
                break;
            default:
                console.log("%cInvalid option. Please enter 1, 2, or 3.", "font-size: 16px; color: red;");
        }
        displayMenu();
    }

    // Function to activate the bot
    function activateBot() {
        if (!botRunning) {
            botRunning = true;
            console.log("%cBot Activated!", "font-size: 24px; color: green;");
            try {
                const originalGameOver = Runner.prototype.gameOver;
                Runner.prototype.gameOver = function() {};

                function autoJump() {
                    if (!botRunning) return;
                    const obstacles = Runner.instance_.horizon.obstacles;
                    if (obstacles.length > 0) {
                        const obstacle = obstacles[0];
                        const distance = obstacle.xPos - Runner.instance_.tRex.xPos;
                        const height = obstacle.yPos;

                        if (distance < 100 && height > 75 && Runner.instance_.tRex.jumping === false) {
                            Runner.instance_.tRex.startJump(0.5);
                        }
                    }
                    requestAnimationFrame(autoJump);
                }
                autoJump();

                // Store original gameOver function to restore later
                Runner.prototype.gameOver.original = originalGameOver;
            } catch (error) {
                // Set errorOccurred flag to true and display error message
                window.errorOccurred = true;
                console.error("%cSite not supported or an error occurred: " + error, "font-size: 24px; color: red;");
            }
        } else {
            console.log("%cBot is already running.", "font-size: 16px; color: orange;");
        }
    }

    // Function to stop the bot
    function stopBot() {
        if (botRunning) {
            botRunning = false;
            // Restore the original gameOver function to allow normal game behavior
            if (Runner.prototype.gameOver.original) {
                Runner.prototype.gameOver = Runner.prototype.gameOver.original;
            }
            console.log("%cBot Stopped!", "font-size: 24px; color: red;");
        } else {
            console.log("%cBot is not running.", "font-size: 16px; color: orange;");
        }
    }

    // Function to check if the site is supported
    function checkSiteSupport() {
        try {
            if (typeof Runner !== 'undefined' && Runner.instance_) {
                console.log("%cThis site is supported!", "font-size: 16px; color: green;");
            } else {
                throw new Error("Runner object not found");
            }
        } catch (error) {
            console.error("%cSite not supported or an error occurred: " + error, "font-size: 16px; color: red;");
        }
    }

    // Display the menu initially
    displayMenu();

    // Wait for user input
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.position = 'absolute';
    inputField.style.top = '10px';
    inputField.style.left = '10px';
    inputField.style.width = '200px';
    document.body.appendChild(inputField);

    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleInput(inputField.value);
            inputField.value = '';
        }
    });
})();
