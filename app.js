const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

const  memoria = require('./contenedores/memoria.js')
const archivo = require('./contenedores/archivo.js')

const productosApi = new memoria()
const mensajesApi = new archivo('mensajes.json')


//Configuración de Socket.IO
io.on("connection", async socket => {
   socket.emit("productos", productosApi.listarAll());

   socket.on("newProduct", (product) => {
        productosApi.guardar(product);
        io.sockets.emit("productList", productosApi.listarAll())
   })

// carga inicial de mensajes
socket.emit('mensajes', await mensajesApi.listarAll());

// actualizacion de mensajes
socket.on('nuevoMensaje', async mensaje => {
    mensaje.fyh = new Date().toLocaleString()
    await mensajesApi.guardar(mensaje)
    io.sockets.emit('mensajes', await mensajesApi.listarAll());
})


})



const PORT = 8080
http.listen(PORT, () => {
    console.log(`Server in running on port ${PORT}.`)
});