(function() {
    // Add Alertify.js to the page
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css';
    document.head.appendChild(link);

    let linkTheme = document.createElement('link');
    linkTheme.rel = 'stylesheet';
    linkTheme.href = 'https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css';
    document.head.appendChild(linkTheme);

    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js';
    script.onload = function() {
        setTimeout(() => {
            // Display activation message if no errors occurred
            if (!window.errorOccurred) {
                alertify.success("Bot Activated!");
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
            alertify.error("Site not supported or an error occurred: " + error);
            console.error("%cSite not supported or an error occurred: " + error, "font-size: 24px; color: red;");
        }
    };
    document.body.appendChild(script);
})();
