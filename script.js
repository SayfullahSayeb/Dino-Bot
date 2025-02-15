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
            if (!window.errorOccurred) {
                alertify.success("Bot Activated!");
                console.log("%cBot Activated!", "font-size: 24px; color: green;");
            }
        }, 3000);

        let botActive = false;
        let autoJumpInterval;

        function autoJump() {
            if (!botActive) return;
            const obstacles = Runner.instance_.horizon.obstacles;
            if (obstacles.length > 0) {
                const obstacle = obstacles[0];
                const distance = obstacle.xPos - Runner.instance_.tRex.xPos;
                const height = obstacle.yPos;
                if (distance < 100 && height > 75 && !Runner.instance_.tRex.jumping) {
                    Runner.instance_.tRex.startJump(0.5);
                }
            }
            requestAnimationFrame(autoJump);
        }

        function toggleBot() {
            botActive = !botActive;
            if (botActive) {
                alertify.success("Bot Activated!");
                autoJump();
            } else {
                alertify.error("Bot Deactivated!");
            }
        }

        function checkSite() {
            if (window.Runner && Runner.instance_) {
                alertify.success("Site is supported!");
            } else {
                alertify.error("Site not supported!");
            }
        }

        function editScore() {
            let newScore = prompt("Enter new score:");
            if (newScore && !isNaN(newScore)) {
                Runner.instance_.distanceRan = parseFloat(newScore) / Runner.instance_.distanceMeter.config.COEFFICIENT;
                Runner.instance_.distanceMeter.update(parseFloat(newScore));
                alertify.success("Score updated to " + newScore);
            } else {
                alertify.error("Invalid score input!");
            }
        }

        window.dinoBot = {
            toggleBot,
            checkSite,
            editScore
        };

        alertify.alert("Dino Bot Loaded!", `Use the console to control the bot:<br><br>
        <b>dinoBot.toggleBot()</b> - Activate/Stop the bot<br>
        <b>dinoBot.checkSite()</b> - Check if the site is supported<br>
        <b>dinoBot.editScore()</b> - Edit the current running score`);
    };
    document.body.appendChild(script);
})();
