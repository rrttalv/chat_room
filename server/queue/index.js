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

export default io => {
    io.on('connection', client => {
        console.log('Socket connection established')
        client.on('subscribe', roomID => {
            socket.join(roomID);
        })
        client.on('message', data => {
            saveQueue.add(data);
        })
    });
}