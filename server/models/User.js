import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    fullName: {
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

const model = mongoose.model('User', userSchema);
export default model;

export const authenticateUserByName = async (firstName, lastName) => {
    const user = await model.findOne({'fullName': fName + lName});
    if(!user){
        const fullName = lastName + lastName;
        const user = new model({
            firstName,
            lastName,
            fullName,
        });
        return await user.save();
    }
    return user;
}