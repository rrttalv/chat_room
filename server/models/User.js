import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
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

export default mongoose.model('User', userSchema);