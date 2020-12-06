import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// class Square extends React.Component {
//     render() {
//         return (
//             <button 
//                 className="square"
//                 onClick={() => 
//                     this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

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
        const renderCol = (
            (row) => elems.map(
                (_, col) => this.renderSquare(row*elems.length + col)
            )
        );
        const renderRow = () => elems.map((_, row) => 
            <div className="board-row">{renderCol(row)}</div>
        );

        return (
            <div>{renderRow()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            selectedButton: null,
            winLine: null,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: i%3,
                row: Math.floor(i/3),
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            movesAsc: true,
            selectedButton: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        let history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        history = this.state.movesAsc ? history : history.reverse();
        const winData = calculateWinner(current.squares);
        let winner;
        let winLine;
        if (winData) {
            winner = winData.winner;
            winLine = winData.winLine;
        }
        this.state.winLine = winLine;
        
        const moves = history.map((step, move) => {
            move = this.state.movesAsc ? move : history.length - move - 1;
            const desc = move ?
                `Go to move #${move} (${step.row}, ${step.col})`:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => {
                        this.jumpTo(move);
                        this.setState({
                            selectedButton: move,
                        });
                    }}>
                        {this.state.selectedButton===move ? <b>{desc}</b> : desc }
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

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
                    <ol reversed={!this.state.movesAsc}>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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