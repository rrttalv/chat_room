import mongoose, { Schema } from 'mongoose';
import {
    attachConversation
} from './User';
const convoSchema = new Schema({
    participants: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
            }
        ]
    },
    /**
     * An individual message looks like this:
     * userID: ID of the sender
     * message: message content
     * seen: true or false
    */
    messages: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    roomID: {
        type: String
    }
});

const model = mongoose.model('Conversation', convoSchema);

export const saveConversation = async data => {
    const { sender, receiver, message, seen, conversationID } = data;
    const newMessage = {
        sender,
        receiver,
        message,
        seen,
    };
    if(conversationID){
        return await model.updateOne({_id: conversationID}, {'$push': {'messages': newMessage}});
    }else{
        return await saveNewConversation(data, newMessage);
    }
};

export const getConversationByRoom = async roomID => {
    return await model.findOne({roomID: roomID});
};

export const saveNewConversation = async (data, message) => {
    const { sender, receiver, roomID } = data;
    const conv = new model({
        participants: [
            sender,
            receiver
        ],
        messages: [message],
        roomID,
    });
    const conversation = await conv.save();
    await attachConversation([sender, receiver], conversation._id);
    return conversation;
};

/**
 * @param {*} id 
 * @param {*} participantID 
 * Takes in a conversation ID and a participant's ID.
 * Updates to conversation message seen status.
 */
export const saveSeen = async (_id, participantID) => {
    const conv = await model.findOne({_id});
    const { messages } = conv.toObject();
    let msgLen = messages.length;
    if(msgLen){
        let replaceStart = msgLen;
        msgLen--;
        //Return nothing since the participant who joined is not the receiver of the last message
        if(messages[msgLen].receiver !== participantID){
            return;
        };
        const unseenMessages = [];
        let hasUnseen = true;
        /**
         * Start from the end of the array and loop until the receiver id changes or
         * the messages are already seen
         */
        while (hasUnseen && msgLen >= 0) {
            const msg = messages[msgLen];
            const { receiver, seen } = msg;
            if(receiver === participantID && !seen){
                msg.seen = true;
                unseenMessages.push(msg);
                replaceStart--;
            }else{
                hasUnseen = false;
            }
            msgLen--;
        };
        if(unseenMessages.length){
            unseenMessages.reverse();
            messages.splice(replaceStart, unseenMessages.length, ...unseenMessages);
        };
        return await model.updateOne({_id: _id}, {"$set": {"messages": messages}});
    };
};

export default model;