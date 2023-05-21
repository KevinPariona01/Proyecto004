const { io } = require('../server');
const Usuarios  = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');


const usuarios = new Usuarios();

io.on('connection', (client) => {

    //CUANDO UN USUARIO SE CONECTA EL CLIENTE EMITE Y ACA LO RECIBE, VALIDA QUE OBTENGA UN NOMBRE DE USUARIO, SI NO RETORNA EL CALLBACK QUE ENVIA CON EL MENSAJE DE ERROR, Y SI TIENE EL NOMBRE ENTONCES AGREGA A LA PERSONA Y ENVIA LAS PERSONAS QUE ESTAN CONECTADAS
    client.on('entrarChat', (usuario, callback)=> {

        console.log("Usuario: ", usuario, client.id);
        if(!usuario.nombre || !usuario.sala){
            return callback({
                error: true,
                mensaje: 'El nombre y sala es necesario'
            });
        }

        client.join(usuario.sala);

        console.log("SALA: ", usuario.sala);
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuario.nombre} se unio.`));
        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    //RECIBO EL MENSAJE DEL CLIENTE Y LO EMITO A LOS DEMAS
    //ESTO LO USO PARA ENVIAR MENSAJE, COMO LA PERSONA QUE SE AGREGA SE GUARDA EL NOMBRE DE LA PERSONA CON SU ID DEL SOCKET ENTONCES ENTONCES BUSCO A LA PERSONA CON EL METODO QUE TENGO OBTENGO Y YA TENGO EL NOMBRE DE LA PERSONA, Y EL MENSAJE LO OBTENGO DEL CLIENTE QUE ENVIO EL MENSAJE MEDIANTE EL SOCKET DENTRO DEL OBJETO data, Y ESTO LO EMITO A LOS DEMAS CLIENTES
    client.on('crearMensaje', (data, callback)=>{//ACA SE PPONE UN PARAMETRO MÁS YA QUE SE USARÁ PARA EL CHAT, ENTONCES ESE CALLBACK ES PARA CONFIRMAR A LA PERSONA QUE ENVIO EL MENSAJE, QUE SU MENSAJE A SIDO ENVIADO

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        
        //EMITO A LOAS DEMAS EL MENSAJE QUE ME ENVIO EL CLIENTE
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        console.log("MENSAJE QUE SEN ENVIA: ", mensaje);
        callback(mensaje);
    });

    //CUANDO SE DESCONECTA BORRA A LA PERSONA
    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        console.log("PERSONA BORRADOA: ", personaBorrada);
        //EL SERVER EMITE UN MENSAJE PARA AVISAR QUE UNA PERSONA SE A DESCONECTADO
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio.`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    //ESCUCHA LOS MENSAJE PRIVADOS
    client.on('mensajePrivado', (data)=>{
        let persona = usuarios.getPersona(client.id);
        //EMITE PARA EL CLIENTE QUE 
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });


});

