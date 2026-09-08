import { Server } from 'socket.io';

const PORT = process.env.PORT || 9000;

const io = new Server(PORT, {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://whisper-five-theta.vercel.app'
        ]
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
        io.emit('getUsers', users);
    });

    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);

        if (user) {
            io.to(user.socketId).emit('getMessage', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        removeUser(socket.id);
        io.emit('getUsers', users);
    });
});