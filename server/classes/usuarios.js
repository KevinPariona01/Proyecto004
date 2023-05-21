class Usuarios{

    constructor(){
        this.personas = [];//LAS PERSONAS QUE ESTEN CONECTADAS
    }

    agregarPersona(id, nombre, sala){//AGREGA A LAS PERSONAS AGREGADAS

        let persona = {id, nombre, sala}
        this.personas.push(persona);
        return this.personas;

    }

    getPersona(id){
        let persona = this.personas.filter( persona => persona.id===id)[0];//BUSCA POR ID Y OBTENGO LA PRIMERA PARA SIEMPRE OBTENER SOLO UNA
        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter(persona =>{
            return persona.sala === sala;
        });

        return personasEnSala;
    }

    borrarPersona(id){

        let personaBorrada = this.getPersona(id);//OBTENGO A LA PERSONA QUE VOY A ELIMINAR

        this.personas = this.personas.filter(persona => {//RETORNA TODAS LAS PERSONAS MENOS LA QUE ELIMINE
            return persona.id != id
        });

        return personaBorrada;
    }


}

module.exports = Usuarios;