import ReactDOM from 'react-dom'
import React from 'react'
import './index.css'

// (+) add task
// (+) edit task
// (+) delete task
// (+) mark task as complete
// (+) show only completed tasks
// (+) show only active tasks

class ToDo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            newTask: '',
            editTaskInx: -1,
            editTaskValue: '',
            filterLvl: 0,
        };
    }

    updNewTask = (event) => {
        this.setState({
            newTask: event.target.value,
        })
    }

    addTask = (event) => {
        let tasks = this.state.tasks.slice();
        tasks.push([this.state.newTask, false]);
        this.setState({
            tasks: tasks,
        });
    }

    removeTask = (event, inx) => {
        let tasks = this.state.tasks.slice();
        tasks.splice(inx, 1);
        this.setState({
            tasks: tasks,
        })
    }

    render() {
        let tasks_rend = this.state.tasks.map((val, inx) => {
            if(this.state.filterLvl === 1 && val[1]
                || this.state.filterLvl === 2 && !val[1]) return <></>;

            return (
                <li>
                    <input
                        type="checkbox" 
                        checked={val[1]}
                        onChange={(event) => {
                            let tasks = this.state.tasks.slice();
                            tasks[inx] = [tasks[inx][0], !tasks[inx][1]];
                            this.setState({
                                tasks: tasks,
                            })
                        }}
                    />
                    <input
                        className={this.state.tasks[inx][1]?"completed":""}
                        type={inx==this.state.editTaskInx?"text":"button"}
                        value={val[0]} 
                        onClick={(event) => {
                            this.setState({
                                editTaskInx: inx,
                            });
                        }}
                        onChange={(event) => {
                                let tasks = this.state.tasks.slice();
                                tasks[inx] = [event.target.value, tasks[inx][1]];
                                this.setState({
                                    tasks: tasks,
                                })
                            }
                        }
                        onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                                this.setState({
                                    editTaskInx: -1,
                                });
                            }
                        }}
                    />
                    <button onClick={(event) => this.removeTask(event, inx)}>X</button>
                </li>
            );
        });
        return (
            <div>
                <span>
                    <input 
                        type="text" 
                        value={this.state.newTask}
                        onChange={this.updNewTask}
                    />
                    <button onClick={this.addTask}>Add</button>
                </span>
                <br/>
                <span>
                    <button onClick={() => {
                        this.setState({
                            filterLvl: 0
                        });
                    }}>
                        All
                    </button>
                    <button onClick={() => {
                        this.setState({
                            filterLvl: 1
                        });
                    }}>In progress</button>
                    <button onClick={() => {
                        this.setState({
                            filterLvl: 2
                        });
                    }}>Completed</button>
                </span>
                <ul>
                    {tasks_rend}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <ToDo />,
    document.getElementById('root')
)