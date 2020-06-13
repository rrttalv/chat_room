import { findUser } from '../models/User';

export const authenticate = (req, res, next) => {
    const user = req.header('x-auth-token');
    if(!user){
        res.status(401).json({ message: 'No user!' });
    }else{
        findUser(user._id).then(user => {
            if(user){
                req.user = user;
            }else{
                res.status(401).json({ message: 'No user!' });
            }
            next();
        }).catch(err => {
            console.log(err);
            next(err);
        })
    }
}