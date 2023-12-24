const game = (function () {
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

        function clearBoard() {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    board[i][j].setValue(0);
                }
            }
        }

        function isFull() {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (!board[i][j].getValue())
                        return false;
                }
            }
            return true;
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

        return { getBoard, setMark, removeMark, printBoard, clearBoard, isFull };
    }

    function Cell() {
        let value = 0; //Empty = 0; Player1 = 1; Player2 = 2

        function getValue() {
            return value;
        }

        function setValue(newValue) {
            value = newValue;
        }

        function isEmpty() {
            return value === 0;
        }

        return { getValue, setValue, isEmpty };
    }

    function Player(userName, userId) {
        const name = userName;
        const id = userId;

        const getName = () => name;
        const setName = (newName) => {
            name = newName;
        }

        return { getName, setName, id };
    }

    function GameController(player1name = 'Player 1', player2name = 'Player 2') {
        const board = Gameboard();
        const boardRef = board.getBoard();
        let players = [
            Player(player1name, 1),
            Player(player2name, 2)
        ];
        let activePlayer = players[0];

        let gameEnded = false;
        let gameStarted = false;
        let winnerPlayer = null;

        const isGameStarted = () => gameStarted;

        const isGameOver = () => gameEnded;

        function setPlayersNames(player1name, player2name = 'Player 2') {
            player1name = (player1name) ? player1name : 'Player 1';
            player2name = (player2name) ? player2name : 'Player 2';

            players = [
                Player(player1name, 1),
                Player(player2name, 2)
            ];
        }

        function startGame() {
            gameStarted = true;
        }

        function resetGame() {
            board.clearBoard();
            _clearWinner();
            activePlayer = players[0];
            gameStarted = false;
            gameEnded = false;
        }

        function getWinner() {
            return winnerPlayer;
        }

        function getActivePlayer() {
            return activePlayer;
        }

        function playRound(row, col) {
            if (!gameEnded && gameStarted) {
                if (_isValidMove(row, col)) {
                    board.setMark(row, col, activePlayer);
                    _switchActivePlayer();
                    _checkWinCondition();
                    _checkTieCondition();
                }
            }
        }

        function _switchActivePlayer() {
            (activePlayer === players[0]) ?
                activePlayer = players[1] :
                activePlayer = players[0];
        }

        function _setWinner(mark) {
            players.forEach(player => {
                if (player.id === mark) {
                    winnerPlayer = player;
                }
            });
        }

        function _printActivePlayer() {
            console.log(`${activePlayer.getName()}'s turn.`);
        }

        function _clearWinner() {
            winnerPlayer = null;
        }

        function _printWinOrDraw() {
            if (winnerPlayer)
                console.log(`${winnerPlayer.getName()} is the winner!`);
            else
                console.log(`It's a draw! No one wins.`);
        }

        function _isValidMove(row, col) {
            return _posInRange(row, col)
                && boardRef[row][col].isEmpty();
        }

        function _posInRange(row, col) {
            return row >= 0
                && row < boardRef.length
                && col >= 0
                && col < boardRef.length
                ;
        }

        function _checkTieCondition() {
            if (board.isFull())
                gameEnded = true;
        }

        function _checkWinCondition() {
            gameEnded = _checkDiagonals() || _checkRows() || _checkColumns();

            function _checkDiagonals() {
                return _checkTopLeftBottomRight()
                    || _checkBottomLeftTopRight();

                function _checkTopLeftBottomRight() {
                    let winnerMark = 0;
                    for (let i = 0; i < boardRef.length; i++) {
                        if (!i) {
                            winnerMark = boardRef[i][i].getValue();
                            if (!winnerMark) //If is an empty cell
                                return false;
                        } else {
                            if (boardRef[i][i].getValue() !== winnerMark)
                                return false;
                        }
                    }
                    _setWinner(winnerMark);
                    return true;
                }

                function _checkBottomLeftTopRight() {
                    const n = boardRef.length;
                    let winnerMark = 0;

                    for (let i = 0; i < n; i++) {
                        if (!i) {
                            winnerMark = boardRef[n - 1 - i][i].getValue();
                            if (!winnerMark) //If is an empty cell
                                return false;
                        } else {
                            if (boardRef[n - 1 - i][i].getValue() !== winnerMark)
                                return false;
                        }
                    }
                    _setWinner(winnerMark);
                    return true;
                }
            }

            function _checkRows() {
                for (let i = 0; i < boardRef.length; i++) {
                    if (_checkRow(i))
                        return true;
                }
                return false;

                function _checkRow(row) {
                    let winnerMark = 0;
                    for (let i = 0; i < boardRef.length; i++) {
                        if (!i) {
                            winnerMark = boardRef[row][i].getValue();
                            if (!winnerMark) //If is an empty cell
                                return false;
                        } else {
                            if (boardRef[row][i].getValue() !== winnerMark)
                                return false;
                        }
                    }
                    _setWinner(winnerMark);
                    return true;
                }
            }

            function _checkColumns() {
                for (let i = 0; i < boardRef.length; i++) {
                    if (_checkCol(i))
                        return true;
                }
                return false;

                function _checkCol(col) {
                    let winnerMark = 0;
                    for (let i = 0; i < boardRef.length; i++) {
                        if (!i) {
                            winnerMark = boardRef[i][col].getValue();
                            if (!winnerMark) //If is an empty cell
                                return false;
                        } else {
                            if (boardRef[i][col].getValue() !== winnerMark)
                                return false;
                        }
                    }
                    _setWinner(winnerMark);
                    return true;
                }
            }
        }

        return {
            isGameStarted,
            isGameOver,
            setPlayersNames,
            startGame,
            resetGame,
            getWinner,
            getActivePlayer,
            playRound,
            getBoard: board.getBoard
        };
    }

    function DisplayController() {
        const game = GameController();
        const boardDiv = document.querySelector('.board');
        const turnDiv = document.querySelector('.turn');

        const ID_OF_X = 1;
        const ID_OF_O = 2;
        const X_URL = "url(img/icons8-close.svg)";
        const O_URL = "url(img/circle-svgrepo-com.svg)";

        const formNames = document.querySelector('#namesForm');
        const player1Div = formNames.querySelector('input#player1');
        const player2Div = formNames.querySelector('input#player2');
        const resetBtn = document.querySelector('#resetBtn');
        const startBtn = document.querySelector('#startBtn');

        function render() {
            renderTurnDiv();
            renderBoard();

            function renderTurnDiv() {
                if (game.isGameStarted()) {
                    if (game.isGameOver()) {
                        if (game.getWinner()) {
                            turnDiv.textContent = `${game.getWinner().getName()} wins!`;
                        } else {
                            turnDiv.textContent = `It's a draw! No one wins.`;
                        }
                    }
                    else
                        turnDiv.textContent = `${game.getActivePlayer().getName()}'s turn`;
                } else {
                    turnDiv.textContent = '';
                }
            }

            function renderBoard() {
                //clear old board display
                boardDiv.textContent = '';
                const boardArr = game.getBoard();

                boardArr.forEach((row, indexRow) => {
                    row.forEach((cell, indexCol) => {
                        const cellBtn = document.createElement('button');
                        cellBtn.type = 'button'; //"Anything clickable should be a button or a link"
                        cellBtn.classList.add('cell');
                        //We add the correspondent index for row and column
                        cellBtn.dataset.row = indexRow;
                        cellBtn.dataset.column = indexCol;
                        //We fill the content with the value (Temporal, replace with X and O's)
                        cellBtn.addEventListener('click', handlerCellClick);
                        setImgOfXorO(cellBtn, cell.getValue());

                        boardDiv.append(cellBtn);
                    });
                });

                function setImgOfXorO(cellBtn, cellValue) {
                    switch (cellValue) {
                        case ID_OF_X:
                            cellBtn.style.backgroundImage = X_URL;
                            break;
                        case ID_OF_O:
                            cellBtn.style.backgroundImage = O_URL;
                            break;
                        default:
                            cellBtn.style.backgroundImage = "none";
                            break;
                    }
                }
            }
        }

        function handlerCellClick(e) {
            const row = e.target.dataset.row;
            const col = e.target.dataset.column;
            //Check whether row or col is undefined to avoid errors
            if (!(row || col)) return;
            
            if (!game.isGameStarted() || game.isGameOver()) return;

            game.playRound(row, col);
            render();
        }

        function handlerStartGame(e) {
            e.preventDefault();

            const newPlayer1 = player1Div.value;
            const newPlayer2 = player2Div.value;
            
            toggleDisabledInputs();
            game.setPlayersNames(newPlayer1, newPlayer2);
            game.resetGame();
            game.startGame();
            render();
        }

        function handlerResetGame(e) {
            toggleDisabledInputs();
            game.resetGame();
            render();
        }

        function toggleDisabledInputs(){
            player1Div.disabled = !player1Div.disabled;
            player2Div.disabled = !player2Div.disabled;
            startBtn.disabled = !startBtn.disabled;
            resetBtn.disabled = !resetBtn.disabled;
        }

        formNames.addEventListener('submit', handlerStartGame);
        resetBtn.addEventListener('click', handlerResetGame);
        resetBtn.disabled = true;

        render();
    }

    DisplayController();
})();
