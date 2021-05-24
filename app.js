const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messageFormat = require('./utils/message');
const { userJoin, findUser, userLeave, getUsers } = require('./utils/user');

//Creating app
const app = express();

//Creating common server
const server = http.createServer(app);

// Intilizing socket.io
const io = socketio(server);

//creating socket connection
io.on('connection', socket => {

    const BotName = "ChatBot";

    // For particular room 
    socket.on('joinroom', ({ username, room }) => {

        //Creating new user object
        const user = userJoin(socket.id, username, room);

        //Joining user to a given room
        socket.join(user.room);

        //Run when client connects
        socket.emit('message', messageFormat(BotName, `Welcome to the ${user.room}`))

        //Run When new User joins the chat
        socket.broadcast.to(user.room).emit('message', messageFormat(BotName, `${username} joined the chat`))

        //Send the list of users in a room to client
        io.to(user.room).emit('roomusers', ({
            room: user.room,
            users: getUsers(user.room)
        }))
    })

    //Listen the message from the client
    socket.on('chatMessage', (msg) => {
        const user = findUser(socket.id);

        //send the message to all the users connected to same room
        io.to(user.room).emit('message', messageFormat(user.username, msg))
    })

    //Run when someone disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);


        if (user) {
            //Send the list of users in a room
            io.to(user.room).emit('roomusers', ({
                room: user.room,
                users: getUsers(user.room)
            }))
            io.to(user.room).emit('message', messageFormat(BotName, `${user.username} left the Chat`))
        }
    })

})

//Creating static files/directory
app.use(express.static(path.join(__dirname, 'public')))

//listning to server port 4000
server.listen(4000, console.log("running"));