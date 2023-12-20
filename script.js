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

        return { getBoard, setMark, removeMark, printBoard, clearBoard };
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

        return { name, id };
    }

    function GameController(player1name = 'Player 1', player2name = 'Player 2') {
        const board = Gameboard();
        const boardRef = board.getBoard();
        const players = [
            Player(player1name, 1),
            Player(player2name, 2)
        ];
        let activePlayer = players[0];

        let gameEnded = false;
        let winnerPlayer = null;
        
        function playRound(row, col) {
            if (!gameEnded) {
                if (_isValidMove(row, col)) {
                    board.setMark(row, col, activePlayer);
                    _switchActivePlayer();
                    _checkWinCondition();
                    board.printBoard();
                    if (gameEnded)
                        _printWinner();
                    else
                        _printActivePlayer();
                }
            } else {
                console.log('The game is over.');
            }
        }
    
        function resetGame() {
            board.clearBoard();
            _clearWinner();
            activePlayer = players[0];
            gameEnded = false;
            _printActivePlayer()
            console.log('Game reseted.');
        }

        function getWinner() {
            return winnerPlayer;
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
            console.log(`${activePlayer.name}'s turn.`);
        }

        function _clearWinner() {
            winnerPlayer = null;
        }

        function _printWinner() {
            console.log(`${winnerPlayer.name} is the winner!`);
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

        return { playRound, getWinner, resetGame };
    }

    return {...GameController()};
})();

game.playRound(0,0);