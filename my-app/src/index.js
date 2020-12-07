import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'


/**
 * Square of the tic-tac-toe board
 */
function Square(props) {
    return (
        <button 
            className={props.won ? "square hightlight" : "square"}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

/**
 * Board of the tic-tac-toe game
 */
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                won={this.props.winLine?.includes(i)}
            />
        );
    }

    render() {
        let elems = new Array(3).fill(null);
        // columns of the board
        const renderCols = (row) => elems.map(
            (_, col) => this.renderSquare(row*elems.length + col)
        );

        // rows of the board
        const renderRows = () => elems.map(
            (_, row) => <div className="board-row">
                {renderCols(row)}
            </div>
        );
        
        return (
            <div>{renderRows()}</div>
        );
    }
}

/**
 * Tic-tac-toe engine
 */
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // history of game states
            history: [{
                squares: Array(9).fill(null),
            }],
            // the current step number
            stepNumber: 0,
            // the next player is X
            xIsNext: true,
            // the selected history state
            selectedHistory: null,
            winner: null,
            // the winning triplet
            winLine: null,
            // shown direction of game states
            movesAsc: true,
        }
    }

    /**
     * Handle click on the i-th square
     * @param {*} i the index of the clicked square
     */
    handleClick(i) {
        // clone history and forget newer board states
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // current game state
        const current = history[history.length - 1];
        // current board state
        const squares = current.squares.slice();

        // the game is over or the clicked square is already filled
        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        // fill the square
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        // update game state
        this.setState({
            // append new game state
            history: history.concat([{
                squares: squares,
                col: i%3,
                row: Math.floor(i/3),
            }]),
            // toggle next player
            xIsNext: !this.state.xIsNext,
            // upd history step and selected history
            stepNumber: history.length,
            selectedHistory: history.length,
        });

        this.detWinner(squares);
    }

    /**
     * Update winner info
     * @param {Array} squares The tic-tac-toe board
     */
    detWinner(squares) {
        const winData = calculateWinner(squares);
        this.setState({
            winner: winData?.winner,
            winLine: winData?.winLine,
        });
    }

    /**
     * Load board state from step
     * @param {*} step the number of step since the begining of the game
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
        this.detWinner(this.state.history[step].squares);
    }

    /**
     * Draw the list of moves (game states)
     * @param {Array} history array of game states
     */
    renderMoves(history) {
        return history.map((step, move) => {
            move = this.state.movesAsc ? move : history.length - move - 1;
            const desc = move ?
                `Go to move #${move} (${step.row}, ${step.col})`:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => {
                        this.jumpTo(move);
                        this.setState({
                            selectedHistory: move,
                        });
                    }}>
                        {this.state.selectedHistory===move ? <b>{desc}</b> : desc }
                    </button>
                </li>
            );
        });
    }

    render() {
        let history = this.state.history.slice();
        // current game state
        const current = history[this.state.stepNumber];
        // reverse history if moovesAsc is set true
        history = this.state.movesAsc ? history : history.reverse();

        // game status
        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // render history list, status and game board
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={this.state.winLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => {
                        this.setState({
                            movesAsc: !this.state.movesAsc,
                        })
                    }}>
                        {this.state.movesAsc ? "^^^" : "vvv"}
                    </button>
                    <ol reversed={!this.state.movesAsc}>
                        {this.renderMoves(history)}
                    </ol>
                </div>
            </div>
        );
    }
}

/**
 * Calculate the winner of a tic-tac-toe game
 * @param {Array} squares an array representation of a tic-tac-toe board
 * @return {Array|null} an array of the winner tag and the won triplet or null
 */
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
            winner: squares[a], 
            winLine: lines[i],
        };
      }
    }
    if(squares.every(Boolean)) {
        return {
            winner: 'draw',
            winLine: null,
        }
    }
    return null;
  }


/**
 * React entry point
 */
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);