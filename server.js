const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let tasks = [];

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        //console.log('Added task:', task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (taskId) => {
        tasks = tasks.filter(task => task.id !== taskId);
        socket.broadcast.emit('removeTask', taskId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
