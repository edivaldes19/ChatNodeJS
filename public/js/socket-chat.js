var socket = io()
var params = new URLSearchParams(window.location.search)
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre y la sala son obligatorios.')
}
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}
socket.on('connect', () => {
    console.log('Conexión establecida.')
    socket.emit('entrarChat', usuario, (resp) => {
        console.log('Usuarios conectados', resp)
    })
})
socket.on('disconnect', () => console.log('Conexión perdida.'))
socket.on('crearMensaje', (mensaje) => console.log('Servidor:', mensaje))
socket.on('listaPersonas', (personas) => console.log(personas))
socket.on('mensajePrivado', (mensaje) => console.log(mensaje))