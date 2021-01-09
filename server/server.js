const path = require("path")
const express = require("express")
const http = require("http")
const port = process.env.PORT || 3000
const socketIO = require("socket.io")
const { Socket } = require("dgram")
const { generateMessage, generateLoctionMessage } = require("./utils/message")
const { isreal } = require("./utils/checking")
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, "/../public")
let app = express();
// we are creating our own server because socket doesnot work with express server 
let server = http.createServer(app)

// now our socket is integrated with our server 
let io = socketIO(server)  // this also allows us to use socket io library which we used in our public folder
let users = new Users();

app.use(express.static(publicPath))


//this makes a connection from the frontend {socket=io()}
io.on("connection", (socket) => {
    console.log("someone new is connected")

    // to listen a new message from client side we use emit here
    socket.on("join", (params, callback) => {

        if (!isreal(params.name) || !isreal(params.room)) {
            return callback("Name and Room are required")
        }
        let user = users.getUser(socket.id);

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', `Welocome to ${params.room}!`));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} Joined`));

        callback();
    })

    // now we will create our custom event other than connection and disconnection

    socket.on("createMessage", (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isreal(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback('This is the server:');

    })



    socket.on("createLocationMessage", (coords) => {
        let user = users.getUser(socket.id)
        if (user) {
            io.to(user.room).emit("newLocationMessage", generateLoctionMessage(user.name, coords.lat, coords.long))

        }
    })

    // we use the socket object to check if someone disonnected 
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
        }
    });
});

server.listen(port, () => {
    console.log(`listining at ${port}`)
})
