const path = require("path")
const express = require("express")
const http = require("http")
const port = process.env.PORT || 3000
const socketIO = require("socket.io")
const { Socket } = require("dgram")

const publicPath = path.join(__dirname, "/../public")

let app = express();

// we are creating our own server because socket doesnot work with express server 
let server = http.createServer(app)

// now our socket is integrated with our server 
let io = socketIO(server)  // this also allows us to use socket io library which we used in our public folder
app.use(express.static(publicPath))


//this makes a connection from the frontend {socket=io()}
io.on("connection", (socket) => {
    console.log("someone new is connected")

    // to listen a new message from client side we use emit here

    //initial message to everone
    socket.emit("newMessage", {
        from: "admin",
        text: "Welcome to the chat app !!",
        createdAt: new Date().getTime()
    })

    // when someone join everone except the joining person will get the message
    socket.broadcast.emit("newMessage", {
        from: "admin",
        text: "Someone new is join",
        createdAt: new Date().getTime()
    })




    // now we will create our custom event other than connection and disconnection

    socket.on("createMessage", (message) => {
        console.log("createMessage", message)

        // io.emit will brodcast this to each channel or member connected to the server (socket.emit will send only to that member from which the request is comming)
        io.emit("newMessage", {
            from: message.from,
            message: message.text,
            createdAt: new Date().getTime()
        })


        // this will broadcast the message to everyobe except the user who created the event 
        // socket.broadcast.emit("newMessage", {
        //     from: message.from,
        //     message: message.text,
        //     createdAt: new Date().getTime()
        // })
    })





    // we use the socket object to check if someone disonnected 
    socket.on("disconnect", () => {
        console.log("disconnected")
    })
})

server.listen(port, () => {
    console.log(`listining at ${port}`)
})
