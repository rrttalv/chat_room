import { 
    saveConversation, 
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
    saveConversation(job.data).then(() => {
        done(null);
    }).catch(err => {
        console.log(err);
        done(new Error(err));
    });
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
        });
        /**
         * receive a message from the frontend and do stuff with it
         */
        socket.on('send_message', async data => {
            //If the room has more then 1 participants, then the message is instantly seen
            data.seen = io.sockets.adapter.rooms[data.roomID].length > 1;
            const { conversationID } = data;
            let toEmit;
            /**
             * If the message doesn't exist in our database then we save if and send it back
             * Otherwise we queue the message save
             */
            if(!conversationID){
                toEmit = await saveConversation(data);
            }else{
                toEmit = data;
                saveQueue.add(data);
            };
            io.in(data.roomID).emit('new_message', toEmit);
        });
        socket.on('leave_room', data => {
            const { roomID } = data;
            socket.leave(roomID);
        })
        socket.on('seen_message', data => {})
    });
}