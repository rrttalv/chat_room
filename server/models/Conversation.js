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
    const { messages, _id } = data;
    if(_id){
        return await model.updateOne({_id: _id}, {'$set': {'messages': messages}});
    }else{
        return await saveNewConversation(data);
    }
}

export const saveNewConversation = async data => {
    const { sender, receiver, messages, roomID } = data;
    const conv = new model({
        participants: [
            {...sender}, 
            {...receiver}
        ],
        messages: [...messages],
        roomID,
    });
    return await conv.save();
}

export default model;