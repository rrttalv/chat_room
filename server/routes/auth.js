import {
    authenticateUserByName
} from '../models/User';
import { 
    authenticate
} from '../helper/middleware';
import express from 'express';

const router = express.Router();

router.post('/login', (req, res, next) => {
    const { username } = req.body;
    if(username && username.length > 0){
        authenticateUserByName(username).then(user => {
            res.json({user: user, success: true});
        }).catch(next);
    }else{
        next(new Error("Username cannot be empty!"))
    }
});

router.get('/state', authenticate, (req, res, next) => {
    const { user } = req;
    if(user){
        res.json({user})
    }
})

export default router;