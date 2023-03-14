module.exports = {
    start: function(io) {
        io.on('connection', (socket) => {
            console.log('Client connected', socket.id);


            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })
        });
    }
}