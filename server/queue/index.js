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
const socketIDs = [];

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
        })
        socket.on('message', data => {
            saveQueue.add(data);
        });
    });
}