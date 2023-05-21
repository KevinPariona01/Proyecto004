//FUNCIONES PARA RENDERIZAS USUARIOS
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

//REFERENCIAS DE JQUERY
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

function renderizarUsuarios(personas){

    var html = '';

    html = `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
            </li>`

    for(var i = 0; i<personas.length; i++){

        html += `<li>
                    <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre}<small class="text-success">online</small></span></a>
                </li>`

    }

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo){
    console.log("Este mensaje: ",mensaje);
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if(mensaje.nombre ==='Administrador'){
        adminClass = 'danger'
    }

    if(yo){
        html += `
            <li class="reverse">
                <div class="chat-content">
                    <h5>${mensaje.nombre}</h5>
                    <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${hora}</div>
            </li>`;
    }else{
        html += '<li class="animated fadeIn" >'
        if(mensaje.nombre !=='Administrador'){
            html += '           <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }
        html += '               <div class="chat-content">'
        html += '                  <h5> '+ mensaje.nombre + ' </h5>'
        html += '                   <div class="box bg-light-'+ adminClass +'"> '+ mensaje.mensaje +' </div>'
        html += '               </div>'
        html += '           <div class="chat-time">'+ hora +'</div>'
        html += '       </li>`'
    }
    

    divChatbox.append(html);
}

function scrollBottom(){//CALCULA SI HACE SCROLL O NO
    //SELECTORS
    var newMessage = divChatbox.children('li:last-child');
    //HEIGHTS
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight()||0;
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        divChatbox.scrollTop(scrollHeight);
    }
}


//LISTENERS

//CUANDO SE HAGA CLICK EN CUALQUIER RECUADRO DE ESTA ETIQUETA a
divUsuarios.on('click', 'a', function(){
    //ESE id ES PORQUE ARRIBA AL CREAR LAS ETIQUERAS a SE PUSO DESPUES DE data id
    var id = $(this).data('id');

    if(id){//SI EXISTE ENTONCES RECIEN MUESTRAS
        console.log(id);
    }
});

formEnviar.on('submit', function(e){

    e.preventDefault();//PREVIENE QUE NO SE RECARGUE LA INFORACION
    if(txtMensaje.val().trim().length===0){//EL TRIM QUITA LOS ESPACIO ADELANTE Y HACIA ATRAS, ASI QUE VALIDA QUE SI ES 0 ENTONCES NO HACE NADA
        return;
    }
    socket.emit('crearMensaje',{
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function (mensaje){//CALLBACK QUE RETORNA EL SERVER Y QUE SE EJECUTA ACA CUANDO YA HIZO LA EMISION DE NUESTRO MENSAJE
        txtMensaje.val('').focus();//DESPUES DE ENVIAR EL MENSAJE LIMPIA LA CAJA DE TEXTO Y PONE EL FOCUS IGUALMENTE AHI
        renderizarMensajes(mensaje, true);//METODO PARA MOSTRAR EL MENSAJE EN LA PANTALLA DEL MISMO CLIENTE Y ENVIO TRUE PARA SABER QUE SOY YO
        scrollBottom();
    } );
    

});