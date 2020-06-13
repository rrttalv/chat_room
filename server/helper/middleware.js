import { findUser } from '../models/User';

export const authenticate = (req, res, next) => {
    try{
        const headerUser = req.header('x-auth-token');
        if(!headerUser){
            res.status(401).json({ message: 'No user!' });
        }else{
            const u = JSON.parse(headerUser);
            findUser(u._id).then(user => {
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
    }catch(err){
        //If error then the user in the header could not be parsed
        next(err);
    }
}