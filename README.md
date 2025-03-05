# Dino-Bot

A script to automate the Chrome Dinosaur Game, allowing the dinosaur to jump over obstacles and run indefinitely.

## Description

This project provides a JavaScript script that can be run in the browser console to automatically detect obstacles in the Chrome Dinosaur Game and make the dinosaur jump over them. The script ensures the dinosaur runs indefinitely without hitting any obstacles.

## Usage

### Step 1: Open the Chrome Dinosaur Game

Open the Chrome browser and go to `chrome://dino` to start the game. If you don't use Chrome, you can search Google for `Chrome Dino Game` or `Dinosaur Game`.

### Step 2: Open the Developer Console

Press `F12` / `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Option + J` (Mac) to open the developer console.


### Step 3: Paste the following code into the console and press Enter

```javascript
fetch('https://raw.githubusercontent.com/SayfullahSayeb/Dino-Bot/main/script.js')
    .then(res => res.text()).then(script => new Function(script)());
```

| Feature           | On                                                                                  | Off                                                                                   |
|-------------------|--------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| **Immortality**   | `var Immortality = Runner.prototype.gameOver; Runner.prototype.gameOver = function() {};` | `Runner.prototype.gameOver = Immortality;`                                            |
| **Speed Boost**   | `Runner.instance_.setSpeed(100);`                                                    | `Runner.instance_.setSpeed(10);`                                                      |
| **Set Score**     | `Runner.instance_.distanceRan = 12345 / Runner.instance_.distanceMeter.config.COEFFICIENT;` |                                                                                       |
| **Walk in Air**   | `Runner.instance_.tRex.groundYPos = 0;`                                              | `Runner.instance_.tRex.groundYPos = 93;`                                              |

### After every command, press enter. All the commands are case-sensitive.
If you see `undefined` after entering a command correctly, don’t worry that is expected (for those who want to know more, it is the return type of the function we called).
