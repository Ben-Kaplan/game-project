
$( document ).ready(function() {
$("#score-board").hide();
const blink = () => {
    $("#start-game").fadeTo(100,0.1).fadeTo(200,1.0);
};
const blinking =setInterval(() => {
    blink()
}, 500);
const bounceUp = () => {
    $(".bounce").animate({
        bottom: "+=100"
    }, 100, () => {
        bounceDown();
    })
}; 
const bounceDown = () => {
    $(".bounce").animate({
        bottom: "-=100"
    }, 100, () => {
        setTimeout(() => {
        smallBounceUp();
        },100)
    })
};
const smallBounceUp = () => {
    $(".bounce").animate({
        bottom: "+=15"
    }, 50, () => {
        smallBounceDown();
    })
}; 
const smallBounceDown = () => {
    $(".bounce").animate({
        bottom: "-=15"
    }, 50)
}; 
bounceUp();
const bounceInterval = setInterval(() => {
    bounceUp();
    console.log("Im bouncing");
}, 2000);
const game = {
    running: true,
    level: 1,
    blockSpeed: 1000,
    moleSpawn: Math.floor((Math.random() * (40000 - 20000) + 20000)),
};
const blocks = [];
let blockNumber = 1;
class Block {
    constructor(type, x) {
        this.xCoordinate = x;
        this.yCoordinate = 12;
        this.type = type;
        this.blockNumber = blockNumber;
        this.removed = false;
        blockNumber++
        blocks.push(this)
    }

    renderBlock() {
        if ($(`.game-square-${this.xCoordinate}-12`).hasClass("stone") || $(`.game-square-${this.xCoordinate}-12`).hasClass("gold")) {
            console.log("cannot make block")
        } else {
        $(`.game-square-${this.xCoordinate}-12`).addClass(this.type);
        $(`.game-square-${this.xCoordinate}-12`).attr("block", this.blockNumber);
        this.dropBlock();
            
        }
    }
    dropBlock() {
        
        if (this.yCoordinate === 0 || this.removed) {
            setTimeout(() => {
                $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass(this.type);
            }, 100)
        } else if (game.running) {
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass(this.type);
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeAttr("block");
            this.yCoordinate --;
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass(this.type);
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).attr("block", this.blockNumber);
            setTimeout(()=>{
                this.dropBlock(this.type);
            }, game.blockSpeed)

        }
    }

};


class KillObject {
    constructor() {
    this.xCoordinate = 12;
    this.yCoordinate = 0;

    }
    renderMole() {
        if ($(`.game-square-${this.xCoordinate}-0`).hasClass("guy")) {
            console.log("cannot make mole")
        } else {
            $(`.game-square-${this.xCoordinate}-0`).addClass("mole");

            console.log("making mole")
            this.moveMole();
        }
    }
    moveMole() {
        if (this.xCoordinate <= 0 || this.moleKilled) {
           $(`.game-square-${this.xCoordinate}-0`).removeClass("mole");
           console.log("mole removed")
        } else {
            game.moleSpeed = setInterval(() => {
                console.log("moving mole")
                $(`.game-square-${this.xCoordinate}-0`).removeClass("mole");
                this.xCoordinate --;
                $(`.game-square-${this.xCoordinate}-0`).addClass("mole");

            }, 500);
           
        }
    }
}; 
let collision = false
const guy = {
    points: 0,
    xCoordinate: 6,
    yCoordinate: 0,
    jump: false,
    lives: 3,
    jumpUp() {
        if(this.yCoordinate == 1){
            console.log("no room to jump")
            
        } else {
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass("flipped");
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass("guy");
            this.yCoordinate ++;
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass("guy");
            this.jump = true;
            setTimeout(() => {this.jumpDown()}, 800)
           
        }
    },
    jumpDown() {
         if(this.yCoordinate == 0){
            console.log("no room to jump")
        } else {
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass("flipped");
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).removeClass("guy");
            this.yCoordinate --;
            $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`).addClass("guy");
            this.jump = false;
            
        }

    },
    moveLeft() {
        if (this.xCoordinate > 0 && this.jump === false) {
            console.log("room to move left");
            $(`.game-square-${this.xCoordinate}-0`).removeClass("guy");
            $(`.game-square-${this.xCoordinate}-0`).removeClass("flipped");
            this.xCoordinate --;
            $(`.game-square-${this.xCoordinate}-0`).addClass("guy");
            $(`.game-square-${this.xCoordinate}-0`).addClass("flipped");
        }
    },
    moveRight() {
        if (this.xCoordinate < 12 && this.jump === false) {
            console.log("move Right");
             $(`.game-square-${this.xCoordinate}-0`).removeClass("flipped");
            $(`.game-square-${this.xCoordinate}-0`).removeClass("guy");
            this.xCoordinate ++;
            $(`.game-square-${this.xCoordinate}-0`).addClass("guy");
        }
    },
    detectCollision(){
        const collisionPoint = $(`.game-square-${this.xCoordinate}-${this.yCoordinate}`)
        if(collisionPoint.hasClass("gold")){
            if (this.points < 11) {
                this.points++;
                collision = true;
                $("#player-score").text(`Player Score: ${this.points}`);
                console.log(this.points);
            }
            collisionPoint.removeClass("gold");
            collisionPoint.addClass("pointEarned");
            setTimeout(() => {
                collisionPoint.removeClass("pointEarned");
            }, 300)
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].blockNumber == collisionPoint.attr("block") ) {
                    console.log(`hit block number ${blocks[i].blockNumber}`)
                    blocks[i].removed = true; 
                }
            }
        } else if (collisionPoint.hasClass("stone")) {
            if (this.points > 0) {
                this.points--
                $("#player-score").text(`Player Score: ${this.points}`);
                console.log(this.points);
            }
            collisionPoint.removeClass("stone");
            collisionPoint.addClass("ouch");
            collisionPoint.removeClass("flipped")
            setTimeout(() => {
                collisionPoint.removeClass("ouch");
                collisionPoint.addClass("flipped");

            }, 300);
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].blockNumber == collisionPoint.attr("block") ) {
                    console.log(`hit block number ${blocks[i].blockNumber}`)
                    blocks[i].removed = true; 
                }
            }
        } else if (collisionPoint.hasClass("mole")) {
            if (this.lives > 0) {
                this.lives--;
                $("#player-lives").text(`Lives: ${this.lives}`);
            }
            collisionPoint.removeClass("mole");
            collisionPoint.addClass("mole-contact");
            collisionPoint.removeClass("flipped")
            setTimeout(() => {
                collisionPoint.removeClass("mole-contact");
                collisionPoint.addClass("flipped");

            }, 300);
       

        }
    }, levelUp() {
        if (this.points === 10) {
            game.level++;
            $("#game-level").text(`Level: ${game.level}`);
            game.blockSpeed -= 100;
            game.moleSpawn /= 2;
             this.points = 0;
            $("#player-score").text(`Player Score: ${this.points}`);
        }
    },
};


const gameBoard = [ [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,]
                    
]

for (let i = gameBoard.length - 1; i >= 0; i--) {
    let row = gameBoard[i];
    $(".game-board").append(`<div class="game-row-${i} game-row"></div>`)
    for (let x = 0; x < row.length; x++) {
        $(`.game-row-${i}`).append(`<div class="game-square game-square-${x}-${i}"></div>`)
    }
};
$('.game-square-6-0').addClass("guy");

$(document).on("keydown", (e) => {
    let pressedKey = e.which;
    if (pressedKey === 37) {
        guy.moveLeft();
    } else if (pressedKey === 39) {
        guy.moveRight();
    } else if (pressedKey === 32) {
        guy.jumpUp();
    }
});

const blockInterval = () => {
    
    game.blocksMove = setInterval(() => {
        guy.levelUp();
        let randNums = [];
        while (randNums.length < 2) {
        let randomNumber = Math.floor(Math.random() * 12);
            if(randNums.includes(randomNumber) == false) {
            randNums.push(randomNumber);
            console.log(randNums);
        }
    }
        const gold = new Block("gold", randNums[0]);
        const stone = new Block("stone", randNums[1]);
        gold.renderBlock();
        stone.renderBlock();
    },4000)
};
const detectInterval = () => {
    setInterval(() => {
        guy.detectCollision();
    },100)
};
const moleInterval = () => {
   game.moleMoves = setInterval(() => {
        const mole = new KillObject();
        mole.renderMole();
    },game.moleSpawn)
};

const stopGame = () => {
  
    console.log("stopping game");
    alert("game over");
    clearInterval(game.moleMoves);
    clearInterval(game.blocksMove);
    clearInterval(detectInterval);
    clearInterval(game.moleSpeed);  
    game.running = false;
};


$("#start-game").on("click", () => {
    $("#start-game").remove();
    $("#score-board").show()
    $(".bounce").stop();
    clearInterval(bounceInterval);
    detectInterval();
    blockInterval();
    moleInterval(); 
    

});
const checkForStop = setInterval (() => {
if (guy.lives === 0) {
    stopGame();
    location.reload();
    }
},100)



 

});
