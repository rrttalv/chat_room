import {
    authenticateUserByName
} from '../models/User';
import express from 'express';

const router = express.Router();

router.post('/login', (req, res, next) => {
    const { userName } = req.body;
    if(userName && userName.length > 0){
        authenticateUserByName(userName).then(user => {
            res.json({user: user, success: true});
        }).catch(next);
    }else{
        next(new Error("Username cannot be empty!"))
    }
});

export default router;