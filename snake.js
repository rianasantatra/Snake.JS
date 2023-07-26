window.onload = function () {
  /** declaration var */
  var canvasWidth = 1200;
  var canvasHeight = 600;
  var blockSize = 30;
  var delay = 100;
  var canvas;
  var ctx;
  var snakee;
  var pomme;
  var widhtBlock = canvasWidth / blockSize;
  var heightBlock = canvasHeight / blockSize;
  var score;

  /** lancement */
  init();

  /** initialisation canvas */
  function init() {
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "20px solid #333";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ffffc5";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    score = 0;
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    pomme = new Apple([10, 10]);
    refreshCanvas();
  }

  /** refresh canvas */
  function refreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()) {
      gameover();
    } else {
      if (snakee.isEatingPomme(pomme)) {
        score++;
        snakee.eatingApple = true;
        do {
          pomme.setNewPos();
        } while (pomme.isOnSnake(snakee));
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      snakee.draw();
      pomme.draw();
      timeout = setTimeout(refreshCanvas, delay);
    }
  }

  /** context && block position */
  function drawBlock(ctx, position) {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  /** constructeur Snake */
  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.eatingApple = false;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#ff6b6b";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };
    /** déplacement du serpent **/
    this.advance = function () {
      var nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          return;
      }
      this.body.unshift(nextPosition);
      /** snake body ++ */
      if (!this.eatingApple) {
        this.body.pop();
      } else {
        this.eatingApple = false;
      }
    };
    this.setDirection = function (newDirection) {
      var allowedDirection;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirection = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirection = ["left", "right"];
          break;
        default:
          return;
      }
      if (allowedDirection.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };

    /** check Collision **/
    this.checkCollision = function () {
      var wallCollision = false;
      var snakeCollision = false;
      var snakeHead = this.body[0];
      var snakeBody = this.body.slice(1);
      var snakeX = snakeHead[0];
      var snakeY = snakeHead[1];
      var minX = 0;
      var minY = 0;
      var maxX = widhtBlock - 1;
      var maxY = heightBlock - 1;
      var isNotHorizental = snakeX < minX || snakeX > maxX;
      var isNotVertical = snakeY < minY || snakeY > maxY;
      if (isNotHorizental || isNotVertical) {
        wallCollision = true;
      }
      for (var i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingPomme = function (eatPomme) {
      var headSnake = this.body[0];
      if (
        headSnake[0] === eatPomme.position[0] &&
        headSnake[1] === eatPomme.position[1]
      ) {
        return true;
      } else {
        return false;
      }
    };
  }

  /** pomme **/
  function Apple(position) {
    this.position = position;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      var radius = blockSize / 2;
      var x = this.position[0] * blockSize + radius;
      var y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };
    /** position random */
    this.setNewPos = function () {
      var newX = Math.round(Math.random() * (widhtBlock - 1));
      var newY = Math.round(Math.random() * (heightBlock - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function (snakeCheck) {
      var isOnSnake = false;
      for (var i = 0; i < snakeCheck.body.length; i++) {
        if (
          this.position[0] === snakeCheck.body[i][0] &&
          this.position[1] === snakeCheck.body[i][1]
        ) {
          isOnSnake = true;
        } else {
          return isOnSnake;
        }
      }
    };
  }

  /** mouvement serpent **/
  document.onkeydown = function handlekeydown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        replay();
        return;
    }
    snakee.setDirection(newDirection);
  };

  /**
   * Game Over
   * Replay
   * Score
   */
  function gameover() {
    ctx.save();
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#fff";
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    ctx.strokeText("GAME OVER", centerX, centerY - 200);
    ctx.fillText("GAME OVER", centerX, centerY - 200);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText("press Space bar for replay", centerX, centerY - 140);
    ctx.fillText("press Space bar for replay", centerX, centerY - 140);
    ctx.restore();
  }

  function replay() {
    score = 0;
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    pomme = new Apple([10, 10]);
    clearTimeout(timeout);
    refreshCanvas();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 150px sans-serif";
    ctx.fillStyle = "#00000052";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    ctx.fillText(score.toString(), centerX, centerY);
    ctx.restore();
  }
};
