const canvas = document.getElementById('spacebreakout-ui');
const context = canvas.getContext('2d');

const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 25;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
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
   if (leftKey && paddle.x > 10) {
      paddle.x -= paddle.dx;
   } else if (rightKey && paddle.x + paddle.width < canvas.width - 10) {
      paddle.x += paddle.dx;
   }
}

const ball = {
   x: canvas.width / 2,
   y: paddle.y - BALL_RADIUS,
   radius: BALL_RADIUS,
   speed: 4,
   dx: 3,
   dx: -3
}

function drawBall() {
   context.beginPath();
   context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
   context.fillStyle = "silver";
   context.fill();

   
}

function draw() {
   drawPaddle();
   drawBall();
}

function update() {
   movePaddle();
}

function loop() {

   draw();

   update();

   requestAnimationFrame(loop);
}

loop();
