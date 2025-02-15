(function() {
    const addStylesheet = (href) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };

    ['https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css', 
     'https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css'].forEach(addStylesheet);

    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js';
    script.onload = function() {
        console.clear();
        alertify.set('notifier', 'position', 'top-right');

        let botActive = false;
        let toggleBtn;

        // Working auto-jump logic (from your provided code)
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

        // Toggle Bot activation
        function toggleBot() {
            botActive = !botActive;
            alertify[botActive ? "success" : "error"](botActive ? "Bot Activated!" : "Bot Deactivated!");
            toggleBtn.textContent = botActive ? "Stop Bot" : "Start Bot";
            if (botActive) {
                requestAnimationFrame(autoJump);  // Start auto-jumping when bot is active
            }
        }

        // Edit the current score manually
        function editScore() {
            let newScore;
            while (true) {
                newScore = prompt("Enter new score (numbers only):", newScore);
                if (newScore === null) return;
                if (/^\d+$/.test(newScore)) {
                    let parsedScore = parseFloat(newScore);
                    Runner.instance_.distanceRan = parsedScore / Runner.instance_.distanceMeter.config.COEFFICIENT;
                    Runner.instance_.distanceMeter.update(parsedScore);
                    alertify.success(`Score updated to ${parsedScore}`);
                    return;
                }
                alertify.error("Invalid input! Please enter numbers only.");
            }
        }

        window.dinoBot = { toggleBot, editScore };

        let siteSupported = !!(window.Runner && Runner.instance_);
        let botUI = document.createElement('div');
        Object.assign(botUI.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '300px', background: '#222',
            color: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            fontSize: '14px', zIndex: '1000'
        });

        botUI.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="background: ${siteSupported ? "green" : "red"}; color: white; padding: 5px; border-radius: 4px; font-weight: bold;">
                    ${siteSupported ? "This Site is supported!" : "This Site is not supported!"}
                </span>
                <span>
                    ${siteSupported ? `<button id="minimizeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">🔽</button>` : ""}
                    <button id="closeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">❌</button>
                </span>
            </div>
            ${siteSupported ? `
                <p><b>Dino Bot Loaded!</b></p>
                <button id="editScoreBtn" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #0f62fe; color: white; border: none; border-radius: 4px; cursor: pointer;">Edit Current Score</button>
                <button id="toggleBotBtn" style="width: 100%; padding: 10px; background: #ff5733; color: white; border: none; border-radius: 4px; cursor: pointer;">Start Bot</button>
            ` : ""}
        `;

        document.body.appendChild(botUI);

        if (siteSupported) {
            document.getElementById("editScoreBtn").addEventListener("click", editScore);
            toggleBtn = document.getElementById("toggleBotBtn");
            toggleBtn.addEventListener("click", toggleBot);
            document.getElementById("minimizeBotUI").addEventListener("click", function() {
                botUI.style.height = botUI.style.height === "30px" ? "auto" : "30px";
                this.textContent = botUI.style.height === "30px" ? "🔼" : "🔽";
            });
        }
        document.getElementById("closeBotUI").addEventListener("click", () => botUI.remove());
    };
    document.body.appendChild(script);
})();
