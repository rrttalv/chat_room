import { 
    saveConversation,
    saveSeen,
    getConversationByRoom,
} from '../models/Conversation';
import {
    findUser,
    getUnseenConversations,
} from '../models/User';
import { redisConfig } from '../config/index';
import { generateRoomID } from '../helper/util';

const Queue = require('bull');

const saveQueue = new Queue('saveConversation', {
    redis: redisConfig
});

saveQueue.process((job, done) => {
    /**
     * If the queue was huge then the seen job could make it possible that some
     * messages would never get saved. But the backlog would have to be very large for
     * that to happen. It's not a problem at the current scale though.
     */
    if(job.data.seenQueue){
        const { convID, joinee } = job.data;
        saveSeen(convID, joinee).then(() => {
            done(null);
        }).catch(err => {
            console.log(err);
            done(new Error(err));
        });
    }else{
        saveConversation(job.data).then(() => {
            done(null);
        }).catch(err => {
            console.log(err);
            done(new Error(err));
        });
    }
});

const activeUsers = [];

export default io => {
    io.on('connection', socket => {
        socket.on('subscribe', async data => {
            const { id } = socket;
            const { room, user } = data;
            socket.join(room);
            user.socketID = id;
            if(activeUsers.indexOf(user) === -1){
                activeUsers.push(user);
            }
            io.in(room).emit('public_join', {list: activeUsers});
        });
        socket.on('get_unseen', async data => {
            const seenData = await getUnseenConversations(data.userID);
            socket.emit('seen_info', seenData);
        })
        socket.on('disconnect', () => {
            const { id } = socket;
            const userToDisconnect = activeUsers.find(({socketID}) => socketID === id);
            const idx = activeUsers.indexOf(userToDisconnect);
            if(idx !== -1){
                activeUsers.splice(idx, 1);
            }
            io.in('public-room').emit('public_join', {
                list: activeUsers,
            })
        });
        socket.on('join_private', async data => {
            const { receiver,
                sender } = data;
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
            if(convData[0]){
                saveQueue.add({
                    seenQueue: true, 
                    joinee: convData[2]._id,
                    convID: convData[0],
                });
            }
        });
        /**
         * receive a message from the frontend and do stuff with it
         */
        socket.on('send_message', async data => {
            //If the room has more then 1 participants, then the message is instantly seen
            data.seen = io.sockets.adapter.rooms[data.roomID].length > 1;
            const { conversationID } = data;
            /**
             * If the message doesn't exist in our database then we save if and send it back
             * Otherwise we queue the message save
             */
            if(!conversationID){
                const toEmit = await saveConversation(data);
                io.in(data.roomID).emit('new_message', toEmit);
            }else{
                const toEmit = data;
                saveQueue.add(data);
                io.in(data.roomID).emit('new_message', toEmit);
            };
        });
        socket.on('leave_room', data => {
            const { roomID } = data;
            socket.leave(roomID);
        });
    });
}