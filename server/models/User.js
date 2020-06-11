import mongoose, { Schema } from 'mongoose';
import Conv from './Conversation';
const userSchema = new Schema({
    userName: {
        type: String,
    },
    conversations: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Conversation',
            }
        ]
    }
});

const model = mongoose.model('User', userSchema);

export const authenticateUserByName = async userName => {
    const user = await model.findOne({'userName': userName});
    if(!user){
        const user = new model({
            userName,
        });
        return await user.save();
    }
    return user;
};

const popQuery = {path: 'conversations', populate: {
    path: 'participants',
}};

export const getUserConversations = async userID => {
    const userData = await model.findOne({_id: userID}).populate(popQuery);
    const user = userData.toObject();
    const convos = userData.toObject().conversations;
    user.conversations = convos.map(cnv => (
        //Only send back the last message to avoid sending data to the user that is not needed.
        {
            ...cnv,
            messages: cnv.messages[cnv.messages.length - 1]
        }
    ));
    return user;
};

export const getSingleConversation = async conversationID => {
    return await Conv.findOne({_id: conversationID});
}

export default model;