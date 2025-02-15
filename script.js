(function() {
    // Function to add external stylesheets
    const addLink = (href) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };
    addLink('https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css');
    addLink('https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css');

    // Function to add script dynamically
    const addScript = (src, onload) => {
        let script = document.createElement('script');
        script.src = src;
        script.onload = onload;
        document.body.appendChild(script);
    };

    addScript('https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/alertify.min.js', function() {
        console.clear(); // Clear console after script runs

        // Check if the site is supported
        const isSupported = window.Runner && window.Runner.instance_;
        const botActive = { status: false };

        // Auto-jump logic
        const autoJump = () => {
            if (!botActive.status || !isSupported) return;
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
        };

        // Toggle bot functionality
        const toggleBot = () => {
            botActive.status = !botActive.status;
            alertify[botActive.status ? 'success' : 'error'](`Bot ${botActive.status ? 'Activated' : 'Deactivated'}!`);
            if (botActive.status) autoJump();
        };

        // Edit score function with validation
        const editScore = () => {
            let newScore = prompt("Enter new score (numbers only):");
            if (!newScore || isNaN(newScore.trim()) || newScore.trim() === "") {
                alertify.error("Invalid score! Please enter a number.");
                return;
            }
            let parsedScore = parseFloat(newScore);
            Runner.instance_.distanceRan = parsedScore / Runner.instance_.distanceMeter.config.COEFFICIENT;
            Runner.instance_.distanceMeter.update(parsedScore);
            alertify.success(`Score updated to ${parsedScore}`);
        };

        window.dinoBot = isSupported ? { toggleBot, editScore } : {};

        // UI Setup
        let botUI = document.createElement('div');
        botUI.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background: #222;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            font-size: 14px;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        // Header UI (with or without minimize button)
        botUI.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="background: ${isSupported ? '#28a745' : '#dc3545'}; color: white; padding: 5px; border-radius: 4px; font-weight: bold;">
                    ${isSupported ? 'This Site is Supported!' : 'This Site is Not Supported!'}
                </span>
                <span>
                    ${isSupported ? '<button id="minimizeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">🔽</button>' : ''}
                    <button id="closeBotUI" style="background: none; border: none; color: #fff; font-size: 16px; cursor: pointer;">❌</button>
                </span>
            </div>
        `;

        // Only show controls if the site is supported
        if (isSupported) {
            botUI.innerHTML += `
                <p><b>Dino Bot Loaded!</b></p>
                <button id="editScoreBtn" style="width: 100%; padding: 10px; margin: 5px 0; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Edit Score
                </button>
                <button id="toggleBotBtn" style="width: 100%; padding: 10px; background: #fd7e14; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Start/Stop Bot
                </button>
            `;
        }

        document.body.appendChild(botUI);

        // Event Listeners
        if (isSupported) {
            document.getElementById("editScoreBtn").addEventListener("click", editScore);
            document.getElementById("toggleBotBtn").addEventListener("click", toggleBot);

            // Minimize button functionality
            document.getElementById("minimizeBotUI").addEventListener("click", function() {
                botUI.style.height = botUI.style.height === '30px' ? 'auto' : '30px';
                this.textContent = botUI.style.height === '30px' ? '🔼' : '🔽';
            });
        }

        document.getElementById("closeBotUI").addEventListener("click", () => botUI.remove());
    });
})();
