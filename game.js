const canvas = document.getElementById('spacebreakout-ui');
const context = canvas.getContext('2d');

const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 25;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
let LIFE = 3;
let leftKey = false;
let rightKey = false;

const paddle = {
   //position(center) of paddle relative to canvas
   x: (canvas.width / 2) - (PADDLE_WIDTH / 2),
   y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
   width: PADDLE_WIDTH,
   height: PADDLE_HEIGHT,
   dx: 5
};

function drawPaddle() {
   context.fillStyle = 'silver';
   context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

   context.strokeStyle = 'grey';
   context.lineWidth = 2;
   context.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

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
   }
})

function movePaddle() {
   if (leftKey && paddle.x > 0) {
      paddle.x -= paddle.dx;
   } else if (rightKey && paddle.x + paddle.width < canvas.width) {
      paddle.x += paddle.dx;
   }
}

const ball = {
   x: canvas.width / 2,
   y: paddle.y - BALL_RADIUS,
   radius: BALL_RADIUS,
   speed: 4,
   dx: 3 * (Math.random() * 2 - 1), //random ball direction,
   dy: -3
}

function drawBall() {
   context.beginPath();
   context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
   context.fillStyle = "silver";
   context.fill();

   context.strokeStyle = "grey";
   context.lineWidth = 1;
   context.stroke();

   context.closePath();
}

function moveBall() {
   ball.x += ball.dx;
   ball.y += ball.dy;
}

function ballWallCollision() {
   if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
   }

   if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
   }

   if (ball.y + ball.radius > canvas.height) {
      LIFE--;
      resetBall();
   }
}

function resetBall() {
   ball.x = canvas.width / 2;
   ball.y = paddle.y - BALL_RADIUS;
   ball.dx = 3 * (Math.random() * 2 - 1); //random ball direction
   ball.dy = -3
}

function ballPaddleCollision() {
   if (ball.x < paddle.x + paddle.width && 
      ball.x > paddle.x && 
      paddle.y < paddle.y + paddle.height &&
      ball.y > paddle.y) {

         //different direction when ball hits paddle
         let collidePoint = ball.x - (paddle.x + paddle.width / 2);
         collidePoint = collidePoint / (paddle.width / 2);
         let angle = collidePoint * Math.PI / 3;

         ball.dx = ball.speed * Math.sin(angle);
         ball.dy = - ball.speed * Math.cos(angle);
      }
}

function draw() {
   context.clearRect(0, 0, canvas.width, canvas.height);
   drawPaddle();
   drawBall();
}

function update() {
   movePaddle();
   moveBall();
   ballWallCollision();
   ballPaddleCollision();
}

function loop() {

   draw();

   update();

   requestAnimationFrame(loop);
}

loop();
