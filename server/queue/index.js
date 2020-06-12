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

export default {
    connect: io => {
        io.on('connection', socket => {
            socket.on('subscribe', roomID => {
                socket.join(roomID);
            })
            socket.on('message', data => {
                saveQueue.add(data);
            })
        });
    }
};