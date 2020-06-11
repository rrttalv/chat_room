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

export default mongoose.model('Conversation', convoSchema);