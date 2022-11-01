var socket = io()
var params = new URLSearchParams(window.location.search)
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}
socket.on('connect', () => {
    console.log('Conexión establecida.')
    socket.emit('entrarChat', usuario, (resp) => renderizarUsuarios(resp))
})
socket.on('disconnect', () => console.log('Conexión perdida.'))
socket.on('crearMensaje', (msg) => {
    renderizarMensajes(msg, false)
    scrollBottom()
})
socket.on('listaPersona', (personas) => renderizarUsuarios(personas))
socket.on('mensajePrivado', (msg) => console.log('Mensaje Privado:', msg))