import mongoose, { Schema } from 'mongoose';

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

export const saveMessage = async data => {
    const { userID, message, seen, conversationID } = data;
    const newMessage = {
        userID,
        message,
        seen,
    };
    if(conversationID){
        return await model.updateOne({_id: conversationID}, {'$push': {'messages': newMessage}});
    }else{
        return await saveNewConversation(data, newMessage);
    }
}

export const getConversationByRoom = async roomID => {
    return await model.findOne({roomID: roomID});
};

export const saveNewConversation = async (data, message) => {
    const { sender, receiver, roomID } = data;
    const conv = new model({
        participants: [
            {...sender}, 
            {...receiver}
        ],
        messages: [message],
        roomID,
    });
    return await conv.save();
}

export default model;