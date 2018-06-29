const gameBoard = [ [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,],
                    [0,0,0,0,0,0,0,0,0,0,0,]
]

for (let i = gameBoard.length - 1; i >= 0; i--) {
    let row = gameBoard[i];
    $(".game-board").append(`<div class="game-row-${i} game-row"></div>`)
    for (let x = 0; x < row.length; x++) {
        $(`.game-row-${i}`).append(`<div class="game-square game-square-${x}-${i}"></div>`)
    }
};    