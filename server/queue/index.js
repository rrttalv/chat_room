export default {
    connect: io => {
        io.on('connection', socket => {
            return socket;
        });
    }
};