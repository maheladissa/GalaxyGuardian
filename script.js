const laser = new Audio('./assets/laser.mp3');

window.addEventListener('load', function(){
    //canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 768;

    function setCookie(name, value, daysToExpire) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);

        const cookieValue = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/; SameSite=Lax';
        document.cookie = cookieValue;
    }

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (decodeURIComponent(cookieName) === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    class InputHandler{
        constructor(game){
            this.game =game;
            window.addEventListener('keydown', (event)=>{
                if (event.key === ' '){
                    if (!this.game.player.shootOnCooldown) {
                        this.game.player.shoot();
                        this.game.player.shootOnCooldown = true;
                        setTimeout(() => {
                            this.game.player.shootOnCooldown = false;
                        }, 100); // pause duration
                    }
                }
                else if (((event.key == 'ArrowUp') ||
                     (event.key == 'ArrowDown')
                ) && this.game.keys.indexOf(event.key) == -1){
                    this.game.keys.push(event.key);
                }
                else if (event.key === 'd'){
                    this.game.debug = !this.game.debug;
                }

            });

            window.addEventListener('keyup', (event)=>{
                if (this.game.keys.indexOf(event.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(event.key), 1);
                }
            });
        }
    }

    class Projectiles{
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 28;
            this.height = 10;
            this.speed = 3;
            this.markedForDeletion = false;
            this.image = document.getElementById('laser');
        }

        update(){
            this.x += this.speed;
            if (this.x > this.game.width * 0.9 + this.width){
                this.markedForDeletion = true;
            }
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

    }

    class Player{
        constructor(game) {
            this.game = game;
            this.width = 153;
            this.height = 230;
            this.x = 20;
            this.y=100;
            this.speedY = 0.2;
            this.maxSpeed =2;
            this.projectiles = [];
            this.image = document.getElementById('player');
        }
        update(){
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;

            if (this.y > this.game.height * 0.9 - this.height*0.5) this.y = this.game.height * 0.9 - this.height*0.5;
              else if (this.y < -this.height*0.5) this.y = -this.height*0.5;
            this.projectiles.forEach(projectile => projectile.update());
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

        }
        draw(context){
            if (game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => projectile.draw(context));
            context.drawImage(this.image, this.x, this.y, this.width, this.height);

        }

        shoot(){
            if(this.game.ammo > 0) {
                const projectile = new Projectiles(this.game, this.x + this.width*0.8, this.y+160);
                this.projectiles.push(projectile);
                laser.volume = 0.1;
                laser.play();
                this.game.ammo--;
            }
        }
    }

    class Enemy{
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.markedForDeletion = false;
        }

        update(){
            this.x += this.speedX - this.game.speed;
            if (this.x < -this.width){
                this.markedForDeletion = true;
            }
        }

        draw(context){
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (this.game.debug) {
                context.font = '20px Arial';
                context.fillText(this.lives, this.x + this.width / 2, this.y + this.height / 2);
            }
        }
    }

    class Fighter1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 150;
            this.height = 67;
            this.lives = 1;
            this.speedX = (Math.random() * -1.5 - 0.5)*1;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height *0.9 - this.height);
            this.image = document.getElementById('enemy1');
        }
    }

    class Fighter2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 175;
            this.height = 131;
            this.lives = 3;
            this.speedX = (Math.random() * -1.5 - 0.5)*1.1;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height *0.9 - this.height);
            this.image = document.getElementById('enemy2');
        }
    }

    class Fighter3 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 200;
            this.height = 132;
            this.lives = 5;
            this.speedX = -0.5;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height *0.9 - this.height);
            this.image = document.getElementById('enemy3');
        }
    }

    class Fighter4 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 230;
            this.height = 103;
            this.lives = 7;
            this.speedX = -0.7;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height *0.9 - this.height);
            this.image = document.getElementById('enemy4');
        }
    }

    class Fighter5 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 230;
            this.height = 123;
            this.lives = 9;
            this.speedX = -0.9;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height *0.9 - this.height);
            this.image = document.getElementById('enemy5');
        }
    }

    class Boss extends Enemy {
        constructor(game) {
            super(game);
            this.width = 300;
            this.height = 90;
            this.lives = 15;
            this.speedX = -3;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height *0.9 - this.height);
            this.image = document.getElementById('boss');
        }
    }

    class Layer{
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.width = 1920;
            this.height = 768;
            this.x = 0;
            this.y = 0;
            this.speedModifier = speedModifier;
        }

        update(){
            if (this.x <= -this.width){
                this.x = 0;
            }
            this.x -= this.game.speed * this.speedModifier;
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }

    class Background{
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.5);
            this.layers = [this.layer1, this.layer2, this.layer3];

        }

        update(){
            this.layers.forEach(layer => layer.update());
        }

        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }

    }

    class Explosion{
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0;
            this.spriteHeight = 200;
            this.spriteWidth = 200;
            this.timer= 0;
            this.interval = 1000/30;
            this.width = 100;
            this.height = 100;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width/2;
            this.y = y - this.height/2;
            this.maxFrame = 8;
            this.markedForDeletion = false;

        }

        update(deltaTime){
            this.x -= this.game.speed*2;
            if (this.timer > this.interval){
                this.frameX++;
                this.timer = 0;
            }
            else this.timer += deltaTime;
            if (this.frameX > this.maxFrame) this.markedForDeletion = true;
        }

        draw(context){
            context.drawImage(this.image, this.frameX*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class smokeExplosion extends Explosion{
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('smokeExplosion');
        }
    }

    class fireExplosion extends Explosion{
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById('fireExplosion');
        }
    }

    class UI{
        constructor(game) {
            this.game = game;
            this.fontSize = 20;
            this.font = 'Bangers';
            this.color = 'white';
        }

        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.font;
            //level
            context.fillText('Level: ' + this.game.level, 20, 40);
            //score
            context.fillText('Score: ' + this.game.score, 20, 70);
            //ammo
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20 + 7 * i,85,4,20);
            }

            //timer
            const formattedTime = ((this.game.timeLimit - this.game.gameTime) * 0.001).toFixed(1);
            context.textAlign = 'right';
            context.fillText('Time: ' + formattedTime, this.game.width - 50, 40);

            //highScore
            context.textAlign = 'right';
            context.fillText('High Score: ' + this.game.highScore, this.game.width - 50, 80);

            //game over
            if (this.game.gameOver){
                context.textAlign = 'center';
                let message1 = 'Congratulations!';
                let message2 = 'You Have Scored ' + this.game.score + ' Points!';
                let message3 = 'Press F5 to restart';
                let message4 = '';
                if (this.game.score > this.game.highScore){
                    message4 = 'You have beaten the high score!';
                }

                context.font = '100px ' + this.font;
                context.fillText(message1, this.game.width / 2, this.game.height / 2 -40);
                context.font = '20px ' + this.font;
                context.fillText(message2, this.game.width / 2, this.game.height / 2 +40);
                context.fillText(message3, this.game.width / 2, this.game.height / 2 +80);
                context.fillText(message4, this.game.width / 2, this.game.height / 2 +120);

            }
            context.restore();
        }
    }

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.level=1;
            this.keys =[];
            this.enemies = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.ammo = 50;
            this.maxAmmo = 50 + (this.level * 5);
            this.ammoTimer = 0;
            this.ammoInterval = 300 - (this.level * 50);
            this.gameOver = false;
            this.score = 0;
            this.gameTime = 0;
            this.timeLimit = 60000;
            this.speed = 1 + (this.level * 0.5);
            this.debug = false;
            this.highScore = parseInt(getCookie('highScore')) || 0;


        }
        update(deltaTime){
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
            this.player.update();
            this.background.layer4.update();
            if (this.ammoTimer > this.ammoInterval && this.ammo < this.maxAmmo){
                this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }

            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(enemy, this.player)){
                    enemy.markedForDeletion = true;
                    this.addExplosion(enemy);
                    if(!game.gameOver && game.score>(enemy.score-1)/2) game.score -= (enemy.score-1)/2;
                }
                this.player.projectiles.forEach(projectile => {
                    if(this.checkCollision(enemy, projectile)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            this.addExplosion(enemy);
                            if (!this.gameOver) this.score += enemy.score;
                            if (!this.gameOver) this.timeLimit += 2000;
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            if(this.score > 15 && this.level<2) this.level = 2;
            if(this.score > 30 && this.level<3) this.level = 3;
            if(this.score > 45 && this.level<4) this.level = 4;
            if(this.score > 60 && this.level<5) this.level = 5;
            if(this.score > 75 && this.level<6) this.level = 6;
            if(this.score > 90 && this.level<7) this.level = 7;
            if(this.score > 105 && this.level<8) this.level = 8;
            if(this.score > 120 && this.level<9) this.level = 9;
            if(this.score > 135 && this.level<10) this.level = 10;

            if (this.gameOver) {
                game.enemies.forEach(enemy => {
                    enemy.markedForDeletion = true, game.addExplosion(enemy);
                });
                if (this.score > this.highScore) setCookie('highScore', this.score, 365);

            }
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.explosions.forEach(explosion => explosion.draw(context));
            this.background.layer4.draw(context);
            this.ui.draw(context);

        }

        addEnemy(){
            const random = Math.random();
            if (this.level<2){
                if (random < 0.5) this.enemies.push(new Fighter1(this));
                else if (random < 0.8) this.enemies.push(new Fighter2(this));
                else this.enemies.push(new Fighter3(this));
            }
            else if (this.level<3){
                if (random < 0.4) this.enemies.push(new Fighter1(this));
                else if (random < 0.6) this.enemies.push(new Fighter2(this));
                else if (random < 0.8) this.enemies.push(new Fighter3(this));
                else this.enemies.push(new Fighter4(this));
            }
            else if (this.level<4){
                if (random < 0.3) this.enemies.push(new Fighter1(this));
                else if (random < 0.5) this.enemies.push(new Fighter2(this));
                else if (random < 0.7) this.enemies.push(new Fighter3(this));
                else if (random < 0.8) this.enemies.push(new Fighter4(this));
                else this.enemies.push(new Fighter5(this));
            }
            else {
                if (random < 0.1) this.enemies.push(new Fighter1(this));
                else if (random < 0.2) this.enemies.push(new Fighter2(this));
                else if (random < 0.3) this.enemies.push(new Fighter3(this));
                else if (random < 0.5) this.enemies.push(new Fighter4(this));
                else if (random < 0.8) this.enemies.push(new Fighter5(this));
                else this.enemies.push(new Boss(this));
            }


        }

        addExplosion(enemy){
            const random = Math.random();
            if (random < 0.5) this.explosions.push(new smokeExplosion(this, enemy.x + enemy.width/2, enemy.y+enemy.height/2));
            else this.explosions.push(new fireExplosion(this, enemy.x + enemy.width/2, enemy.y+enemy.height/2));
        }

        checkCollision(rect1, rect2){
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            )
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    //animation
    function animate(timeStamp){
        const deltaTime = (timeStamp - lastTime);
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);

    }
    animate(0);
});