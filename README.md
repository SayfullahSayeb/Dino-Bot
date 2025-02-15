# Infinite-Dino

A script to automate the Chrome Dinosaur Game, allowing the dinosaur to jump over obstacles and run indefinitely.

## Description

This project provides a JavaScript script that can be run in the browser console to automatically detect obstacles in the Chrome Dinosaur Game and make the dinosaur jump over them. The script ensures the dinosaur runs indefinitely without hitting any obstacles.

## Usage

### Step 1: Open the Chrome Dinosaur Game

Open the Chrome browser and go to `chrome://dino` to start the game.

### Step 2: Open the Developer Console

Press `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Option + J` (Mac) to open the developer console.

### Step 3: Fetch and Run the Script

Paste the following code into the console and press Enter:

```javascript
fetch('https://raw.githubusercontent.com/mdsayeb7/Infinite-Dino/main/script.js')
    .then(response => response.text())
    .then(text => {
        const script = document.createElement('script');
        script.textContent = text;
        document.head.appendChild(script);
    })
    .catch(error => console.error('Error fetching script:', error));
