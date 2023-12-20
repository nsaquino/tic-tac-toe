function Gameboard() {
    const board = [];
    const n = 3;

    //Initialize game board
    for (let i = 0; i < n; i++) {
        board[i] = [];
        for (let j = 0; j < n; j++) {
            board[i].push(Cell());
        }
    }

    function getBoard() {
        return board;
    }

    function setMark(row, col, player) {
        board[row][col].setValue(player.id);
    }

    function removeMark(row, col) {
        board[row][col].setValue(0);
    }

    function printBoard() {
        const emptyValue = 0;
        const xValue = 1;
        const oValue = 2;

        function printMark(value) {
            return (value === emptyValue) ? ' ' :
                ((value === xValue) ? 'X' : 'O');
        }

        const boardWithValues = board.map(row => row.map(cell => printMark(cell.getValue())));
        console.log(boardWithValues);
    }

    return { getBoard, setMark, removeMark, printBoard };
}

function Cell() {
    let value = 0; //Empty = 0; Player1 = 1; Player2 = 2

    function getValue() {
        return value;
    }

    function setValue(newValue) {
        value = newValue;
    }

    return { getValue, setValue };
}

function Player(name, id) {
    const userName = name;
    const userId = id;

    return { name, id };
}

function GameController(
    player1name = 'Player 1',
    player2name = 'Player 2'
) {
    const board = Gameboard();
    const boardRef = board.getBoard();
    const players = [
        Player(player1name, 1),
        Player(player2name, 2)
    ];

    let activePlayer = players[0];

    function _switchActivePlayer() {
        (activePlayer === players[0]) ? 
            activePlayer = players[1] : 
            activePlayer = players[0];
    }

    function _posInRange(row, col) {
        return row >= 0 
            && row < boardRef.length 
            && col >= 0 
            && col < boardRef.length
        ;
    }

    function playRound(row, col) {
        if(!_posInRange(row, col)) return;

        if (!boardRef[row][col].getValue()) {
            board.setMark(row, col, activePlayer);
            _switchActivePlayer();
            board.printBoard();
        }
    }

    return {playRound};
}

const game = GameController();