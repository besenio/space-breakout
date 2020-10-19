<h1 align="center">Space Breakout</h1>

<div align="center">
   <a href="https://besenio.github.io/SpaceBreakout/">
      <img src="./images/space-breakout-splash-page.PNG">
   </a>
</div>

# Table of Contents
* <a href="#introduction">Introduction</a>
* <a href="#technologies">Technologies and Languages</a>
* <a href="#features">Features and Highlights</a>
* <a href="#futurefeatures">Future Features and Considerations</a>

<div id="introduction"></div>

# Introduction
[Space Breakout](https://besenio.github.io/SpaceBreakout/) is a spin-off of the classic Atari arcade game "Breakout". In it's current state, the player will begin the game with three lives and will have to break each brick on the screen to pass the level. There's only three levels but beware, the ball speed may get out of control. 

<div id="technologies"></div>

# Technologies and Languages
-	JavaScript
-	HTML
-	CSS
-  HTML canvas element
-  Local storage

<div id="features"></div>

# Features and Highlights
-  Animation loop
-	Collision detection
-	Local storage high scores

<h3>Collion detection</h3>

```javascript
function paddleCollision() {
   if (ball.x < paddle.x + paddle.width &&
      ball.x > paddle.x &&
      paddle.y < paddle.y + paddle.height &&
      ball.y > paddle.y) {

      let collision = ball.x - (paddle.x + paddle.width / 2);
      collision = collision / (paddle.width / 2);
      let angle = collision * Math.PI / 3;

      ball.dx = ball.speed * Math.sin(angle);
      ball.dy = - ball.speed * Math.cos(angle);
   }
}

function wallCollision() {
   if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = - ball.dx;
   }

   if (ball.y - ball.radius < 0) {
      ball.dy = - ball.dy;
   }

   if (ball.y + ball.radius > canvas.height) {
      LIVES = LIVES - 1;
      ballReset();
   }
}

function brickCollision() {
   for (let i = 0; i < brick.row; i++) {
      for (let j = 0; j < brick.column; j++) {
         let b = bricks[i][j];

         if (b.status) {
            if (ball.x + ball.radius > b.x &&
               ball.x - ball.radius < b.x + brick.width &&
               ball.y + ball.radius > b.y &&
               ball.y - ball.radius < b.y + brick.height) {

               ball.dy = - ball.dy;
               b.status = false;
               SCORE += POINTS;
            }
         }
      }
   }
}
```

<h3>Local storage</h3>

```javascript
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

function saveScores() {
   localStorage.setItem('mostRecentScore', SCORE);
   const mostRecentScore = JSON.parse(localStorage.getItem('mostRecentScore'));

   highScores.push(mostRecentScore);
   localStorage.setItem('highScores', JSON.stringify(highScores.sort((a, b) => b - a).splice(0, 5)));
}

function renderScores() {
   const topFiveList = document.getElementById('top-five-scores');
   const topFive = JSON.parse(localStorage.getItem('highScores')) || [];

   topFiveList.innerHTML =
      topFive.map((score, idx) => {
         return `<div class="top-five">${idx + 1}. ${score}</div>`
      }).join("");
}
```

<div id="futurefeatures"></div>

# Future Features and Considerations
-  Paddle health bar in addition to the current number of lives
-	Whenever a brick breaks, the brick will break into smaller pieces, potentially damaging the paddle if it comes into contact