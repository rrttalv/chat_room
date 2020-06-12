import { saveMessage } from '../models/Conversation';
import { redisConfig } from '../config/index';

const Queue = require('bull');

const saveQueue = new Queue('saveConversation', {
    redis: redisConfig
});

saveQueue.process(async job => {
    return await saveMessage(job.data);
});

export default {
    connect: io => {
        io.on('connection', socket => {
            socket.on('subscribe', roomID => {
                socket.join(roomID);
            })
            socket.on('message', data => {
                saveQueue(data);
            })
        });
    }
};