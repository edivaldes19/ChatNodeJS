const { io } = require('../server')
const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utilidades')
const usuarios = new Usuarios()
io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        const { nombre, sala } = data
        if (!nombre || !sala) {
            return callback({
                msg: 'El nombre y la sala son obligatorios.',
                error: true
            })
        }
        client.join(sala)
        usuarios.agregarPersona(client.id, nombre, sala)
        client.broadcast.to(sala).emit('listaPersonas', usuarios.getPersonasPorSala(sala))
        client.broadcast.to(sala).emit('crearMensaje', crearMensaje('Administrador', `${nombre} se ha salido del Chat.`))
        callback(usuarios.getPersonasPorSala(sala))
    })
    client.on('crearMensaje', (data, callback) => {
        const persona = usuarios.getPersona(client.id)
        const { nombre, sala } = persona
        const { mensaje } = data
        const mensajeAEnviar = crearMensaje(nombre, mensaje)
        client.broadcast.to(sala).emit('crearMensaje', mensajeAEnviar)
        callback(mensaje)
    })
    client.on('disconnect', () => {
        const personaEliminada = usuarios.borrarPersona(client.id)
        const { nombre, sala } = personaEliminada
        client.broadcast.to(sala).emit('crearMensaje', crearMensaje('Administrador', `${nombre} se ha salido del Chat.`))
        client.broadcast.to(sala).emit('listaPersonas', usuarios.getPersonasPorSala(sala))
    })
    client.on('mensajePrivado', (data) => {
        const persona = usuarios.getPersona(client.id)
        const { para, mensaje } = data
        client.broadcast.to(para).emit('mensajePrivado', crearMensaje(persona.nombre, mensaje))
    })
})