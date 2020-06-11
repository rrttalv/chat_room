import mongoose, { Schema, mongo } from 'mongoose';

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
    }
});

export default mongoose.Model('Conversation', convoSchema);