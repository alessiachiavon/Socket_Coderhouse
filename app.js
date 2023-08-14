const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require("path");

const PORT = 8080

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("index", {title: "Aplicacion Socket IO"})
});

http.listen(PORT, () => {
    console.log(`Server in running on port ${PORT}.`)
});


io.on("connection", (socket) => {
    console.log("Un cliente se ha conectado");

    socket.on("mensaje", (data)=> {
        console.log("Mensaje recibido: ", data);
        io.emit("mensaje", data);
    })

    socket.on("disconnect", () => {
        console.log("Un cliente se ha desconectado");
    })
})
