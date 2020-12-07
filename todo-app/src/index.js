import ReactDOM from 'react-dom'
import React from 'react'
import './index.css'

// (+) add task
// (+) edit task
// (+) delete task
// (+) mark task as complete
// (+) show only completed tasks
// (+) show only active tasks

class ToDoList extends React.Component {
    render() {
        let tasks_render = this.props.tasks.map((val, inx) => {
            if(this.props.filterLvl === 1 && val[1]
                || this.props.filterLvl === 2 && !val[1]) return <></>;

            return (
                <li>
                    <input
                        type="checkbox" 
                        checked={val[1]}
                        onChange={this.props.handleToggleCheck(inx)}
                    />
                    <input
                        className={val[1]?"completed":""}
                        type={inx==this.props.editTaskInx?"text":"button"}
                        value={val[0]} 
                        onClick={this.props.handleEditClick(inx)}
                        onChange={this.props.handleTaskChange(inx)}
                        onKeyUp={this.props.handleFinishEdit(inx)}
                    />
                    <button onClick={this.props.handleDeleteTask(inx)}>X</button>
                </li>
            );
        });
        return (
            <ul>{tasks_render}</ul>
        );
    }
}

class ToDoApp extends React.Component {
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

    handleToggleCheck = (inx) => (event) => {
        let tasks = this.state.tasks.slice();
        tasks[inx] = [tasks[inx][0], !tasks[inx][1]];
        this.setState({
            tasks: tasks,
        })
    }

    handleEditClick = (inx) => (event) => {
        this.setState({
            editTaskInx: inx,
        });
    }

    handleTaskChange = (inx) => (event) => {
        let tasks = this.state.tasks.slice();
        tasks[inx] = [event.target.value, tasks[inx][1]];
        this.setState({
            tasks: tasks,
        });
    }

    handleFinishEdit = (inx) => (event) => {
        if (event.key === 'Enter') {
            this.setState({
                editTaskInx: -1,
            });
        }
    }

    handleDeleteTask = (inx) => (event) => {
        let tasks = this.state.tasks.slice();
        tasks.splice(inx, 1);
        this.setState({
            tasks: tasks,
        });
    }

    setFilter = (lvl) => () => {
        this.setState({filterLvl: lvl});
    }

    render() {
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
                    <button onClick={this.setFilter(0)}>
                        All
                    </button>
                    <button onClick={this.setFilter(1)}>
                        In progress
                    </button>
                    <button onClick={this.setFilter(2)}>
                        Completed
                    </button>
                </span>
                <ToDoList
                    tasks={this.state.tasks}
                    filterLvl={this.state.filterLvl}
                    editTaskInx={this.state.editTaskInx}
                    handleToggleCheck={this.handleToggleCheck}
                    handleEditClick={this.handleEditClick}
                    handleTaskChange={this.handleTaskChange}
                    handleFinishEdit={this.handleFinishEdit}
                    handleDeleteTask={this.handleDeleteTask}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <ToDoApp />,
    document.getElementById('root')
)