var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};



//ESCUCHA CUANDO SE CONECTA, ACA RECIBE LO QUE EL SERVER LE ENVIA CUANDO SE CONECTA
socket.on('connect', function() {
    console.log('Conectado al servidor');
    //EMITO QUE ESTOY ENTRANDO AL CHAT PARA AVISAR Y VER LOS USUARIOS CONECTADOS
    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
        //console.log('Usuarios conectados', resp);
    });

});

//ESCUCHA CUANDO NOS DESCONECTAMOS DEL SERVER
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });


// ESCUCHA LA INFORMACIÓN DEL SERVIDOR Y EL MENSAJE QUE EMITE
socket.on('crearMensaje', function(mensaje) {
    renderizarMensajes(mensaje, false);//METODO PARA MOSTRAR EL MENSAJE EN LA PANTALLA EN LOS DEMAS CLIENTES
    console.log('Servidor:', mensaje,);
    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    renderizarUsuarios(personas);
    //console.log(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);

});