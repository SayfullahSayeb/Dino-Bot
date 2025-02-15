(function() {
    // Delay activation message and error handling
    setTimeout(() => {
        // Display activation message if no errors occurred
        if (!window.errorOccurred) {
            console.log("%cBot Activated!", "font-size: 24px; color: green;");
        }
    }, 3000);

    try {
        const original = Runner.prototype.gameOver;
        Runner.prototype.gameOver = function() {};

        function autoJump() {
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

        requestAnimationFrame(autoJump);
    } catch (error) {
        // Set errorOccurred flag to true and display error message
        window.errorOccurred = true;
        console.error("%cSite not supported or an error occurred: " + error, "font-size: 24px; color: red;");
    }
})();