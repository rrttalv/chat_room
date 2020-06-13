import { saveMessage } from '../models/Conversation';
import { redisConfig } from '../config/index';

const Queue = require('bull');

const saveQueue = new Queue('saveConversation', {
    redis: redisConfig
});

saveQueue.process((job, done) => {
    console.log(job.data);
    done(null);
    /*saveMessage(job.data).then(() => {
        done(null);
    }).catch(err => {
        done(new Error(err));
    })*/
});

const activeUsers = [];

export default io => {
    io.on('connection', socket => {
        socket.on('subscribe', data => {
            const { id } = socket;
            const { room, user } = data;
            socket.join(room);
            user.socketID = id;
            if(activeUsers.indexOf(user) === -1){
                activeUsers.push(user);
            }
            io.in(room).emit('public_join', {list: activeUsers});
        });
        socket.on('disconnect', () => {
            const { id } = socket;
            const userToDisconnect = activeUsers.find(({socketID}) => socketID === id);
            const idx = activeUsers.indexOf(userToDisconnect);
            if(idx !== -1){
                activeUsers.splice(idx, 1);
            }
            io.in('public-room').emit('public_join', {list: activeUsers})
        });
        socket.on('join_private', data => {
            const { room } = data;
            console.log(data);
            //socket.join(room);
        })
        socket.on('send_message', data => {
            console.log(data);
            //saveQueue.add(data);
        });
        socket.on('seen_message', data => {})
    });
}