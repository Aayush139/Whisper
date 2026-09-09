import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import Connection from './database/db.js';
import Routes from './routes/Routes.js';

dotenv.config();

const app = express();

const httpServer = createServer(app);

const PORT = process.env.PORT || 8000;

Connection();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', Routes);

const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://whisper-five-theta.vercel.app'
        ],
        methods: ['GET', 'POST']
    }
});

let users = [];

const addUser = (userData, socketId) => {
    if (!users.some(user => user.sub === userData.sub)) {
        users.push({
            ...userData,
            socketId
        });
    }
};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('addUser', (userData) => {
        addUser(userData, socket.id);

        console.log('Active users:', users.length);

        io.emit('getUsers', users);
    });

    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);

        if (user) {
            io.to(user.socketId).emit('getMessage', data);
        }
    });

    socket.on('typing', (data) => {

        const user = getUser(data.receiverId);

        if (user) {
            io.to(user.socketId).emit('typing', {
                senderId: data.senderId
            });
        }

    });


    socket.on('stopTyping', (data) => {

        const user = getUser(data.receiverId);

        if (user) {
            io.to(user.socketId).emit('stopTyping', {
                senderId: data.senderId
            });
        }

    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        removeUser(socket.id);

        io.emit('getUsers', users);
    });
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Whisper server running on PORT ${PORT}`);
});