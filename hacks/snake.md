---
layout: base
title: Snake Game
permalink: /snake
---

<style>

    body{
    }
    .wrap{
        margin-left: auto;
        margin-right: auto;
    }

    canvas{
        display: none;
        border-style: solid;
        border-width: 10px;
        border-color: #FFFFFF;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    }
    canvas:focus{
        outline: none;
    }

    /* All screens style */
    #gameover p, #setting p, #menu p{
        font-size: 20px;
    }

    #gameover a, #setting a, #menu a{
        font-size: 30px;
        display: block;
        transition: all 0.3s ease;
        padding: 10px;
        margin: 5px;
        border-radius: 8px;
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
        color: white;
        text-decoration: none;
    }

    #gameover a:hover, #setting a:hover, #menu a:hover{
        cursor: pointer;
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    #gameover a:hover::before, #setting a:hover::before, #menu a:hover::before{
        content: ">";
        margin-right: 10px;
    }

    #menu{
        display: block;
    }

    #gameover{
        display: none;
    }

    #setting{
        display: none;
    }

    #setting input{
        display:none;
    }

    #setting label{
        cursor: pointer;
        padding: 8px 16px;
        margin: 4px;
        border-radius: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        transition: all 0.3s ease;
    }

    #setting input:checked + label{
        background: linear-gradient(45deg, #FFF, #f0f0f0);
        color: #000;
        transform: scale(1.1);
    }

    .lives-display {
        font-size: 24px;
        color: #FF6B6B;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    }
</style>

<h2>Snake</h2>
<div class="container">
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
        <p class="fs-4" style="color: white;">Score: <span id="score_value">0</span></p>
        <p class="lives-display">Lives: <span id="lives_value">3</span></p>
    </div>
    <div class="container bg-secondary" style="text-align:center;">
        <!-- Main Menu -->
        <div id="menu" class="py-4 text-light">
            <p>Welcome to Enhanced Snake! Press <span style="background-color: #FFFFFF; color: #000000; padding: 4px 8px; border-radius: 4px;">space</span> to begin</p>
            <a id="new_game" class="link-alert">🎮 New Game</a>
            <a id="setting_menu" class="link-alert">⚙️ Settings</a>
        </div>
        <!-- Game Over -->
        <div id="gameover" class="py-4 text-light">
            <p>Game Over! Press <span style="background-color: #FFFFFF; color: #000000; padding: 4px 8px; border-radius: 4px;">space</span> to try again</p>
            <a id="new_game1" class="link-alert">🔄 Try Again</a>
            <a id="setting_menu1" class="link-alert">⚙️ Settings</a>
        </div>
        <!-- Play Screen -->
        <canvas id="snake" class="wrap" width="320" height="320" tabindex="1"></canvas>
        <!-- Settings Screen -->
        <div id="setting" class="py-4 text-light">
            <p>Settings Screen - Press <span style="background-color: #FFFFFF; color: #000000; padding: 4px 8px; border-radius: 4px;">space</span> to return</p>
            <a id="new_game2" class="link-alert">🎮 New Game</a>
            <br>
            <p>Speed:
                <input id="speed1" type="radio" name="speed" value="150" checked/>
                <label for="speed1">🐌 Slow</label>
                <input id="speed2" type="radio" name="speed" value="100"/>
                <label for="speed2">🚶 Normal</label>
                <input id="speed3" type="radio" name="speed" value="60"/>
                <label for="speed3">🏃 Fast</label>
                <input id="speed4" type="radio" name="speed" value="30"/>
                <label for="speed4">⚡ Lightning</label>
            </p>
            <p>Wall:
                <input id="wallon" type="radio" name="wall" value="1" checked/>
                <label for="wallon">🧱 On</label>
                <input id="walloff" type="radio" name="wall" value="0"/>
                <label for="walloff">🌀 Off</label>
            </p>
            <p>Growth Rate:
                <input id="growth1" type="radio" name="growth" value="1" checked/>
                <label for="growth1">🐍 Normal</label>
                <input id="growth2" type="radio" name="growth" value="2"/>
                <label for="growth2">🐲 Double</label>
                <input id="growth3" type="radio" name="growth" value="3"/>
                <label for="growth3">🐉 Triple</label>
            </p>
        </div>
    </div>
</div>

<script>
    (function(){
        /* Attributes of Game */
        /////////////////////////////////////////////////////////////
        // Canvas & Context
        const canvas = document.getElementById("snake");
        const ctx = canvas.getContext("2d");
        // HTML Game IDs
        const SCREEN_SNAKE = 0;
        const screen_snake = document.getElementById("snake");
        const ele_score = document.getElementById("score_value");
        const ele_lives = document.getElementById("lives_value");
        const speed_setting = document.getElementsByName("speed");
        const wall_setting = document.getElementsByName("wall");
        const growth_setting = document.getElementsByName("growth");
        // HTML Screen IDs (div)
        const SCREEN_MENU = -1, SCREEN_GAME_OVER=1, SCREEN_SETTING=2;
        const screen_menu = document.getElementById("menu");
        const screen_game_over = document.getElementById("gameover");
        const screen_setting = document.getElementById("setting");
        // HTML Event IDs (a tags)
        const button_new_game = document.getElementById("new_game");
        const button_new_game1 = document.getElementById("new_game1");
        const button_new_game2 = document.getElementById("new_game2");
        const button_setting_menu = document.getElementById("setting_menu");
        const button_setting_menu1 = document.getElementById("setting_menu1");
        // Game Control
        const BLOCK = 10;   // size of block rendering
        let SCREEN = SCREEN_MENU;
        let snake;
        let snake_dir;
        let snake_next_dir;
        let snake_speed;
        let food = {x: 0, y: 0};
        let obstacles = [];
        let score;
        let lives;
        let wall;
        let growthRate;
        let foods = []; // Multiple foods
        
        /* Display Control */
        /////////////////////////////////////////////////////////////
        let showScreen = function(screen_opt){
            SCREEN = screen_opt;
            switch(screen_opt){
                case SCREEN_SNAKE:
                    screen_snake.style.display = "block";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "none";
                    screen_game_over.style.display = "none";
                    break;
                case SCREEN_GAME_OVER:
                    screen_snake.style.display = "block";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "none";
                    screen_game_over.style.display = "block";
                    break;
                case SCREEN_SETTING:
                    screen_snake.style.display = "none";
                    screen_menu.style.display = "none";
                    screen_setting.style.display = "block";
                    screen_game_over.style.display = "none";
                    break;
            }
        }
        
        /* Actions and Events  */
        /////////////////////////////////////////////////////////////
        window.onload = function(){
            // HTML Events to Functions
            button_new_game.onclick = function(){newGame();};
            button_new_game1.onclick = function(){newGame();};
            button_new_game2.onclick = function(){newGame();};
            button_setting_menu.onclick = function(){showScreen(SCREEN_SETTING);};
            button_setting_menu1.onclick = function(){showScreen(SCREEN_SETTING);};
            
            // speed
            setSnakeSpeed(150);
            for(let i = 0; i < speed_setting.length; i++){
                speed_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < speed_setting.length; i++){
                        if(speed_setting[i].checked){
                            setSnakeSpeed(speed_setting[i].value);
                        }
                    }
                });
            }
            
            // wall setting
            setWall(1);
            for(let i = 0; i < wall_setting.length; i++){
                wall_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < wall_setting.length; i++){
                        if(wall_setting[i].checked){
                            setWall(wall_setting[i].value);
                        }
                    }
                });
            }
            
            // growth rate setting
            setGrowthRate(1);
            for(let i = 0; i < growth_setting.length; i++){
                growth_setting[i].addEventListener("click", function(){
                    for(let i = 0; i < growth_setting.length; i++){
                        if(growth_setting[i].checked){
                            setGrowthRate(growth_setting[i].value);
                        }
                    }
                });
            }
            
            // activate window events
            window.addEventListener("keydown", function(evt) {
                // spacebar detected
                if(evt.code === "Space" && SCREEN !== SCREEN_SNAKE)
                    newGame();
            }, true);
        }
        
        /* Snake is on the Go (Driver Function)  */
        /////////////////////////////////////////////////////////////
        let mainLoop = function(){
            let _x = snake[0].x;
            let _y = snake[0].y;
            snake_dir = snake_next_dir;   // read async event key
            // Direction 0 - Up, 1 - Right, 2 - Down, 3 - Left
            switch(snake_dir){
                case 0: _y--; break;
                case 1: _x++; break;
                case 2: _y++; break;
                case 3: _x--; break;
            }
            snake.pop(); // tail is removed
            snake.unshift({x: _x, y: _y}); // head is new in new position/orientation
            
            // Wall Checker
            if(wall === 1){
                // Wall on, Game over test
                if (snake[0].x < 0 || snake[0].x === canvas.width / BLOCK || snake[0].y < 0 || snake[0].y === canvas.height / BLOCK){
                    loseLife();
                    return;
                }
            }else{
                // Wall Off, Circle around
                for(let i = 0, x = snake.length; i < x; i++){
                    if(snake[i].x < 0){
                        snake[i].x = snake[i].x + (canvas.width / BLOCK);
                    }
                    if(snake[i].x === canvas.width / BLOCK){
                        snake[i].x = snake[i].x - (canvas.width / BLOCK);
                    }
                    if(snake[i].y < 0){
                        snake[i].y = snake[i].y + (canvas.height / BLOCK);
                    }
                    if(snake[i].y === canvas.height / BLOCK){
                        snake[i].y = snake[i].y - (canvas.height / BLOCK);
                    }
                }
            }
            
            // Snake vs Snake checker
            for(let i = 1; i < snake.length; i++){
                // Game over test
                if (snake[0].x === snake[i].x && snake[0].y === snake[i].y){
                    loseLife();
                    return;
                }
            }
            
            // Obstacle collision checker
            for(let i = 0; i < obstacles.length; i++){
                if(checkBlock(snake[0].x, snake[0].y, obstacles[i].x, obstacles[i].y)){
                    loseLife();
                    return;
                }
            }
            
            // Snake eats food checker (multiple foods)
            for(let i = foods.length - 1; i >= 0; i--){
                if(checkBlock(snake[0].x, snake[0].y, foods[i].x, foods[i].y)){
                    // Add segments based on growth rate
                    for(let j = 0; j < growthRate; j++){
                        snake[snake.length] = {x: snake[0].x, y: snake[0].y};
                    }
                    altScore(score += 10);
                    foods.splice(i, 1); // Remove eaten food
                    addFood(); // Add new food
                }
            }
            
            // Repaint canvas with gradient background
            let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#2C3E50');
            gradient.addColorStop(1, '#4A6741');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Paint obstacles
            ctx.fillStyle = "#8B4513";
            for(let i = 0; i < obstacles.length; i++){
                ctx.fillRect(obstacles[i].x * BLOCK, obstacles[i].y * BLOCK, BLOCK, BLOCK);
                // Add glow effect to obstacles
                ctx.shadowColor = "#FF4500";
                ctx.shadowBlur = 10;
                ctx.fillRect(obstacles[i].x * BLOCK, obstacles[i].y * BLOCK, BLOCK, BLOCK);
                ctx.shadowBlur = 0;
            }
            
            // Paint snake with glow effect
            for(let i = 0; i < snake.length; i++){
                if(i === 0){
                    // Snake head - different color and glow
                    ctx.fillStyle = "#00FF00";
                    ctx.shadowColor = "#00FF00";
                    ctx.shadowBlur = 15;
                } else {
                    // Snake body - gradient effect
                    ctx.fillStyle = "#32CD32";
                    ctx.shadowColor = "#32CD32";
                    ctx.shadowBlur = 5;
                }
                ctx.fillRect(snake[i].x * BLOCK, snake[i].y * BLOCK, BLOCK, BLOCK);
            }
            ctx.shadowBlur = 0;
            
            // Paint foods with different colors and glow
            for(let i = 0; i < foods.length; i++){
                ctx.fillStyle = "#FF1493";
                ctx.shadowColor = "#FF1493";
                ctx.shadowBlur = 20;
                ctx.fillRect(foods[i].x * BLOCK, foods[i].y * BLOCK, BLOCK, BLOCK);
            }
            ctx.shadowBlur = 0;
            
            // Recursive call after speed delay
            setTimeout(mainLoop, snake_speed);
        }
        
        /* New Game setup */
        /////////////////////////////////////////////////////////////
        let newGame = function(){
            // snake game screen
            showScreen(SCREEN_SNAKE);
            screen_snake.focus();
            // game score to zero
            score = 0;
            lives = 3;
            altScore(score);
            altLives(lives);
            // initial snake
            snake = [];
            snake.push({x: 0, y: 15});
            snake_next_dir = 1;
            // multiple foods on canvas
            foods = [];
            addFood();
            addFood();
            // add obstacles
            addObstacles();
            // activate canvas event
            canvas.onkeydown = function(evt) {
                changeDir(evt.keyCode);
            }
            mainLoop();
        }
        
        /* Life Management */
        /////////////////////////////////////////////////////////////
        let loseLife = function(){
            lives--;
            altLives(lives);
            if(lives <= 0){
                showScreen(SCREEN_GAME_OVER);
            } else {
                // Reset snake position but keep score
                snake = [];
                snake.push({x: 0, y: 15});
                snake_next_dir = 1;
                // Clear existing foods and add new ones
                foods = [];
                addFood();
                addFood();
                // Restart the game loop
                setTimeout(mainLoop, snake_speed);
            }
        }
        
        /* Key Inputs and Actions */
        /////////////////////////////////////////////////////////////
        let changeDir = function(key){
            // test key and switch direction (arrow keys and WASD)
            switch(key) {
                case 37:    // left arrow
                case 65:    // A key
                    if (snake_dir !== 1)    // not right
                        snake_next_dir = 3; // then switch left
                    break;
                case 38:    // up arrow
                case 87:    // W key
                    if (snake_dir !== 2)    // not down
                        snake_next_dir = 0; // then switch up
                    break;
                case 39:    // right arrow
                case 68:    // D key
                    if (snake_dir !== 3)    // not left
                        snake_next_dir = 1; // then switch right
                    break;
                case 40:    // down arrow
                case 83:    // S key
                    if (snake_dir !== 0)    // not up
                        snake_next_dir = 2; // then switch down
                    break;
            }
        }
        
        /* Random food placement */
        /////////////////////////////////////////////////////////////
        let addFood = function(){
            let newFood = {
                x: Math.floor(Math.random() * ((canvas.width / BLOCK) - 1)),
                y: Math.floor(Math.random() * ((canvas.height / BLOCK) - 1))
            };
            
            // Check collision with snake
            for(let i = 0; i < snake.length; i++){
                if(checkBlock(newFood.x, newFood.y, snake[i].x, snake[i].y)){
                    addFood();
                    return;
                }
            }
            
            // Check collision with obstacles
            for(let i = 0; i < obstacles.length; i++){
                if(checkBlock(newFood.x, newFood.y, obstacles[i].x, obstacles[i].y)){
                    addFood();
                    return;
                }
            }
            
            foods.push(newFood);
        }
        
        /* Add Obstacles */
        /////////////////////////////////////////////////////////////
        let addObstacles = function(){
            obstacles = [];
            let numObstacles = 5;
            for(let i = 0; i < numObstacles; i++){
                let obstacle = {
                    x: Math.floor(Math.random() * ((canvas.width / BLOCK) - 1)),
                    y: Math.floor(Math.random() * ((canvas.height / BLOCK) - 1))
                };
                
                // Make sure obstacles don't spawn on snake or food
                let valid = true;
                for(let j = 0; j < snake.length; j++){
                    if(checkBlock(obstacle.x, obstacle.y, snake[j].x, snake[j].y)){
                        valid = false;
                        break;
                    }
                }
                
                if(valid){
                    obstacles.push(obstacle);
                } else {
                    i--; // Try again
                }
            }
        }
        
        /* Collision Detection */
        /////////////////////////////////////////////////////////////
        let checkBlock = function(x, y, _x, _y){
            return (x === _x && y === _y);
        }
        
        /* Update Score */
        /////////////////////////////////////////////////////////////
        let altScore = function(score_val){
            ele_score.innerHTML = String(score_val);
        }
        
        /* Update Lives */
        /////////////////////////////////////////////////////////////
        let altLives = function(lives_val){
            ele_lives.innerHTML = String(lives_val);
        }
        
        /////////////////////////////////////////////////////////////
        // Change the snake speed...
        let setSnakeSpeed = function(speed_value){
            snake_speed = parseInt(speed_value);
        }
        
        /////////////////////////////////////////////////////////////
        let setWall = function(wall_value){
            wall = parseInt(wall_value);
            if(wall === 0){screen_snake.style.borderColor = "#606060";}
            if(wall === 1){screen_snake.style.borderColor = "#FFFFFF";}
        }
        
        /////////////////////////////////////////////////////////////
        let setGrowthRate = function(growth_value){
            growthRate = parseInt(growth_value);
        }
    })();
</script>