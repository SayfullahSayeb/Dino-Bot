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
        console.clear(); // Clear the console after script runs

        let botActive = false;

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
            editScore
        };

        let siteSupported = window.Runner && Runner.instance_ ? "This Site is supported!" : "This Site not supported!";
        let siteSupportedColor = window.Runner && Runner.instance_ ? "green" : "red";

        let botUI = document.createElement('div');
        botUI.style.position = 'fixed';
        botUI.style.bottom = '20px';
        botUI.style.right = '20px';
        botUI.style.width = '300px';
        botUI.style.background = '#222';
        botUI.style.color = '#fff';
        botUI.style.padding = '15px';
        botUI.style.borderRadius = '8px';
        botUI.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        botUI.style.fontSize = '14px';
        botUI.style.zIndex = '1000';

        botUI.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="background: ${siteSupportedColor}; color: white; padding: 5px; border-radius: 4px; font-weight: bold;">${siteSupported}</span>
                <span>
                    <button id="minimizeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">🔽</button>
                    <button id="closeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">❌</button>
                </span>
            </div>
            <p><b>Dino Bot Loaded!</b></p>
            <button id="editScoreBtn" style="width: 100%; padding: 5px; margin-bottom: 10px; background: #0f62fe; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit Current Score</button>
            <button id="toggleBotBtn" style="width: 100%; padding: 5px; background: #ff5733; color: white; border: none; border-radius: 4px; cursor: pointer;">Start/ Stop Bot</button>
        `;
        document.body.appendChild(botUI);

        document.getElementById("editScoreBtn").addEventListener("click", editScore);
        document.getElementById("toggleBotBtn").addEventListener("click", toggleBot);
        document.getElementById("closeBotUI").addEventListener("click", function() {
            botUI.remove();
        });
        document.getElementById("minimizeBotUI").addEventListener("click", function() {
            if (botUI.style.height === "30px") {
                botUI.style.height = "auto";
                this.textContent = "🔽";
            } else {
                botUI.style.height = "30px";
                this.textContent = "🔼";
            }
        });
    };
    document.body.appendChild(script);
})();