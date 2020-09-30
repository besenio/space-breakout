const canvas = document.getElementById('spacebreakout-ui');
const context = canvas.getContext('2d');

//PADDLE
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_BOTTOM_MARGIN = 5; //dont touch bottom border

const paddle = {
   x: (canvas.width / 2) - (PADDLE_WIDTH / 2),
   y: canvas.height - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT,
   width: PADDLE_WIDTH,
   height: PADDLE_HEIGHT,
   dx: 5 //delta-x - movement left and right
};

function drawPaddle() {
   context.fillStyle = 'violet';
   context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
   context.lineWidth = 1;
   context.strokeStyle = 'white';
   context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

let leftKey = false;
let rightKey = false;

document.addEventListener('keydown', function(event) {
   if (event.keyCode === 37) {
      leftKey = true;
   } else if (event.keyCode === 39) {
      rightKey = true;
   }
})

document.addEventListener('keyup', function(event) {
   if (event.keyCode === 37) {
      leftKey = false;
   } else if (event.keyCode === 39) {
      rightKey = false;
   } else if (event.keyCode === 32) { //spacebar
      pause = !pause;
   } else if (event.keyCode === 13) { //enter
      start = true;
   } else if ((pause && event.keyCode === 89) || (GAME_OVER && event.keyCode === 89)) { //y
      restart = true;
   }
})

function movePaddle() {
   if (leftKey && paddle.x > 5) { //>5 wont touch left border
      paddle.x -= paddle.dx;
   } else if (rightKey && paddle.x + paddle.width < canvas.width - 5) { //-5 wont touch right border
      paddle.x += paddle.dx;
   }
}

//BALL
const BALL_RADIUS = 8;
let ballSpeed = 1;

const ball = {
   x: canvas.width / 2,
   y: paddle.y - BALL_RADIUS,
   radius: BALL_RADIUS,
   speed: 5,
   dx: (3 + ballSpeed) * (Math.random() * 2 - 1), //random direction when the ball starts
   dy: -3 - ballSpeed
}

function drawBall() {
   context.beginPath();
   context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); //draw circle
   context.fillStyle = "white";
   context.fill();
   context.lineWidth = 1;
   context.strokeStyle = "white";
   context.stroke();
   context.closePath();
}

function moveBall() {
   ball.x += 1.25 * ball.dx;
   ball.y += 1.25 * ball.dy;
}

//BRICKS
const brick = {
   row: 3,
   column: 10,
   width: canvas.width / 10,
   height: 20,
   offSetLeft: 0,
   offSetTop: 25,
   marginTop: 50,
   strokeStyle: "white"
}

let bricks = [];

function createBricks() {
   for (let i = 0; i < brick.row; i++) {
      bricks[i] = [];
      for (let j = 0; j < brick.column; j++) {
         bricks[i][j] = {
            x: j * (brick.offSetLeft + brick.width) + brick.offSetLeft,
            y: i * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
            status: true
         }
      }
   }
}

createBricks();

function drawBricks() {
   let color = ["teal", "chartreuse", "magenta", "orange"];

   for (let i = 0; i < brick.row; i++) {
      for (let j = 0; j < brick.column; j++) {
         let b = bricks[i][j];

         if (b.status) {
            context.fillStyle = color[Math.floor(Math.random() * color.length)];
            context.fillRect(b.x, b.y, brick.width, brick.height);

            context.strokeStyle = brick.strokeStyle;
            context.strokeRect(b.x, b.y, brick.width, brick.height);
         }
      }
   }
}

//COLLISION DETECTION
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
   //when the ball hits the left or right border
   if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = - ball.dx;
   }

   //when the ball hits the top border
   if (ball.y - ball.radius < 0) {
      ball.dy = - ball.dy;
   }

   //when the ball hits the bottom border
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

function ballReset() {
   ball.x = canvas.width / 2;
   ball.y = paddle.y - BALL_RADIUS;
   ball.dx = (3 + ballSpeed) * (Math.random() * 2 - 1); //random direction when the ball resets
   ball.dy = -3 - ballSpeed;
}

//GAME
let LIVES = 3;
let SCORE = 0;
let POINTS = 100;
let LEVEL = 1;
const MAX_LEVEL = 3;

//HIGHSCORES
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

renderScores();

function renderStats(stat, statXPos, statYPos, image, imageXPos, imageYPos) {
   context.fillStyle = 'violet';
   context.font = '35px Righteous';
   context.fillText(stat, statXPos, statYPos);
   context.drawImage(image, imageXPos, imageYPos, imageWidth = 30, imageHeight = 30);
}

function levelUp() {
   let levelComplete = true;

   for (let i = 0; i < brick.row; i++) {
      for (let j = 0; j < brick.column; j++) {
         levelComplete = levelComplete && !bricks[i][j].status;
      }
   }

   if (levelComplete) {
      if (LEVEL >= MAX_LEVEL) {
         GAME_OVER = true;
         context.fillText('YOU WIN!', canvas.width / 2 - 80, canvas.height / 2);
         newGame();
         saveScores();
         renderScores();
         return;
      }
      brick.row = brick.row + 1;
      createBricks();
      ball.speed = ball.speed + 3;
      ballSpeed = ballSpeed + 2;
      ballReset();
      LEVEL = LEVEL + 1;
      POINTS = POINTS + 200
   }
}

let GAME_OVER;

function gameOver() {
   if (LIVES <= 0) {
      GAME_OVER = true;
      context.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
      newGame();
      saveScores();
      renderScores();
   }
}

function draw() {
   drawPaddle();
   drawBall();
   drawBricks();
   renderStats(SCORE, 50, 35, points_svg, 15, 10);
   renderStats(LEVEL, canvas.width / 2, 35, level_svg, canvas.width / 2 - 30, 5);
   renderStats(LIVES, canvas.width - 35, 35, lives_svg, canvas.width - 70, 5);
}

let start = "start";

function startGame() {
   context.fillText('START GAME', canvas.width / 2 - 110, canvas.height / 2);
}

let pause = false;

function pauseGame() {
   context.fillText('GAME PAUSED', canvas.width / 2 - 121, canvas.height / 2);
   newGame();
}

let restart = false;

function newGame() {
   context.fillText('NEW GAME (Y)', canvas.width / 2 - 118, canvas.height / 2 + 35);
}

function update() {
   if (start === "start") {
      startGame();
      return;
   }

   if (pause) {
      pauseGame();
      return;
   }

   movePaddle();
   moveBall();
   paddleCollision();
   wallCollision();
   brickCollision();
   levelUp();
   gameOver();
}

function loop() {
   context.clearRect(0, 0, canvas.width, canvas.height);
   draw();
   update();

   if (pause && restart) {
      location.reload();
   }

   if (!GAME_OVER) {
      requestAnimationFrame(loop);
   } 
}

loop();
