import { saveMessage } from '../models/Conversation';
import { redisConfig } from '../config/index';

const Queue = require('bull');

const saveQueue = new Queue('saveConversation', {
    redis: redisConfig
});

saveQueue.process((job, done) => {
    saveMessage(job.data).then(() => {
        done(null);
    }).catch(err => {
        done(new Error(err));
    })
});

const activeUsers = [];

export default io => {
    io.on('connection', socket => {
        socket.on('subscribe', data => {
            const { room, user } = data;
            socket.join(room);
            if(activeUsers.indexOf(user) === -1){
                activeUsers.push(user);
            }
            console.log(activeUsers)
            io.in(room).emit('public_join', {list: activeUsers});
        });
        socket.on('message', data => {
            saveQueue.add(data);
        });
    });
}