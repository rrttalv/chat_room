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


export const attachConversation = async (userIDs, conversationID) => {
    return await model.updateMany(
        {_id: {'$in': userIDs}}, {'$push': {'conversations': conversationID}}
    )
};

const getUnseenLen = (messages, userID) => {
    let msgLen = messages.length;
    const unseenMessages = [];
    if(msgLen){
        //Loop the messages from front to back. Throw error once we get to the seen messages.
        let loop = true;
        msgLen--;
        for(let i = msgLen; loop && i >= 0; i--){
            const msg = messages[msgLen];
            const { receiver, seen } = msg;
            if(receiver === userID && !seen){
                unseenMessages.push(msg);
            }else{
                loop = !loop;
            }
        }
    };
    return unseenMessages.length;
};

export const getUnseenConversations = async userID => {
    const userData = await model.findOne({_id: userID}).populate(popQuery);
    const user = userData.toObject();
    const convos = user.conversations;
    return convos.map(cnv => (
        //Only send back the last message to avoid sending data to the user that is not needed.
        {
            receiver: (cnv.participants.find(({_id}) => _id !== userID))._id,
            unseen: getUnseenLen(cnv.messages, userID),
        }
    ));
};

export const findUser = async id => {
    return await model.findOne({_id: id});
}

export const getSingleConversation = async conversationID => {
    return await Conv.findOne({_id: conversationID});
}

export default model;