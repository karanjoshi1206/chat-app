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

    // we use the socket object to check if someone disonnected 
    socket.on("disconnect", () => {
        console.log("disconnected")
    })
})

server.listen(port, () => {
    console.log(`listining at ${port}`)
})
