import {
    authenticateUserByName
} from '../models/User';
import express from 'express';

const router = express.Router();

router.post('/login', (req, res, next) => {
    const { firstName, lastName } = req.body;
    authenticateUserByName(firstName, lastName).then(user => {
        res.json({user: user, success: true});
    }).catch(next);
});

export default router;