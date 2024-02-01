import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('ws://localhost:8000', { transports: ['websocket'] });
        setSocket(newSocket);

        newSocket.on('updateData', (tasks) => {
            setTasks(tasks);
        });

        newSocket.on('addTask', (newTask) => {
            setTasks(prevTasks => [...prevTasks, newTask]);
        });

        newSocket.on('removeTask', (taskId) => {
            setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
        });

        return () => newSocket.disconnect();
    }, []);

    const handleAddTask = (e) => {
        e.preventDefault();
        const newTask = { id: Date.now().toString(), name: taskName };
        setTasks(prevTasks => [...prevTasks, newTask]);
        socket.emit('addTask', newTask);
        setTaskName('');
    };


    const handleRemoveTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        socket.emit('removeTask', taskId);
    };

    return (
        <div className="App">
            <header>
                <h1>ToDoList.app</h1>
            </header>

            <section className="tasks-section" id="tasks-section">
                <h2>Tasks</h2>

                <ul className="tasks-section__list" id="tasks-list">
                    {tasks.map(task => (
                        <li className="task" key={task.id}>
                            {task.name} <button className="btn btn--red" onClick={() => handleRemoveTask(task.id)}>Remove</button>
                        </li>
                    ))}
                </ul>

                <form id="add-task-form" onSubmit={handleAddTask}>
                    <input
                        className="text-input"
                        autoComplete="off"
                        type="text"
                        placeholder="Type your description"
                        id="task-name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <button className="btn" type="submit">Add</button>
                </form>
            </section>
        </div>
    );
};

export default App;

