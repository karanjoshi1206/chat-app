// this send a connection to backend and ask for response
let socket = io()


// these are the predefined events of socket
socket.on("connect", () => {
    console.log("connected")


    //to listen our custom events we use .emit function which take our event name and a object which it returns
    // socket.emit('createMessage', {
    //     from: "Karan",
    //     text: "Hello there"
    // })
})
socket.on("disconnect", () => {
    console.log("disconnected")
})

//to send a message from client side to server side we use .on here
socket.on("newMessage", (message) => {
    console.log("newMessage", message)
})