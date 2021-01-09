// this send a connection to backend and ask for response
let socket = io()

function scrolltobottom() {
    let messages = document.querySelector("#messages").lastElementChild;
    messages.scrollIntoView()

}


// these are the predefined events of socket
socket.on("connect", () => {

    let searchterm = window.location.search.substring(1);
    let params = JSON.parse(('{"' + decodeURI(searchterm).replace(/&/g, '","').replace(/\+/g, '').replace(/=/g, '":"') + '"}'));
    socket.emit("join", params, function (err) {
        if (err) {
            alert(err);
            window.location.href = "/"
        }
        else {
            console.log("Everything went fine")
        }
    });


    //to listen our custom events we use .emit function which take our event name and a object which it returns
    // socket.emit('createMessage', {
    //     from: "Karan",
    //     text: "Hello there"
    // })
})
socket.on("disconnect", () => {
    console.log("disconnected")
})

socket.on("updateUsersList", function (users) {
    let ol = document.createElement("ol")
    users.forEach(function (user) {
        let li = document.createElement("li")
        li.innerHTML = user;
        ol.appendChild(li)
    })
    let userslist = document.querySelector("#users")
    userslist.innerHTML = "";
    userslist.appendChild(ol);
})

//to send a message from client side to server side we use .on here
socket.on("newMessage", (message) => {
    const formatted = moment(message.createdAt).format('LT')
    const template = document.querySelector("#message-template").innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formatted
    })
    const div = document.createElement('div')
    div.innerHTML = html

    document.querySelector("#messages").appendChild(div)
    scrolltobottom()

})
socket.on("newLocationMessage", (message) => {
    console.log("newLocationMessage", message)
    const formatted = moment(message.createdAt).format('LT')
    const template = document.querySelector("#location-message-template").innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formatted
    })
    const div = document.createElement('div')
    div.innerHTML = html

    document.querySelector("#messages").appendChild(div)

    scrolltobottom()
})

// socket.emit("createMessage", {
//     from: "John",
//     text: "hey there"
// }, function (message) {
//     console.log(message, "server got it")
// })


document.querySelector("#submit").addEventListener("click", (e) => {
    e.preventDefault()
    socket.emit("createMessage", {
        text: document.querySelector("#message").value
    }, function () {

    }
    )
    document.querySelector("#messageForm").reset();
})


document.querySelector("#sendlocation").addEventListener("click", (e) => {
    if (!navigator.geolocation) {
        return alert("Geo location not supported by your browser .")
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit("createLocationMessage", {
            lat: position.coords.latitude,
            long: position.coords.longitude
        })
    }, function () {
        alert("Can't get the position")
    })
})

