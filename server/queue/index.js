import { 
    saveMessage, 
    getConversationByRoom,
} from '../models/Conversation';
import {
    findUser
} from '../models/User';
import { redisConfig } from '../config/index';
import { generateRoomID } from '../helper/util';

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
        socket.on('join_private', async data => {
            const { receiver,
                sender } = data;
            //list[0] is always the receiver's ID and list[1] the current user's ID
            const roomID = generateRoomID(receiver, sender);
            const convData = await Promise.all(
                [
                    getConversationByRoom(roomID),
                    findUser(receiver),
                    findUser(sender),
                ]
            );
            socket.join(roomID);
            io.in(roomID).emit('existing_data', {
                selected: {
                    data: convData[0],
                    roomID
                },
                participants: [convData[1], convData[2]],
            });
        })
        /**
         * receive a message from the frontend and do stuff with it
         */
        socket.on('send_message', data => {
            data.seen = io.sockets.adapter.rooms[data.roomID].length > 1;
            console.log(data);
            //saveQueue.add(data);
        });
        socket.on('seen_message', data => {})
    });
}