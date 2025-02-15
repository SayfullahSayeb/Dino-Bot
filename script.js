(function() {
    // Display activation message
    console.log("Bot Activated!");

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
})();
