import {
    getUserConversations,
    getSingleConversation,
} from '../models/User';
import express from 'express';

const router = express();

router.get('/conversation/:conversationID', (req, res, next) => {
    const { conversationID } = req.params;
    getSingleConversation(conversationID).then(conversation => {
        res.json({conversation});
    }).catch(next);
});

router.get('/', (req, res, next) => {
    const userID = req.header('userID')
    getUserConversations(userID).then(userData => {
        res.json({userData})
    }).catch(next);
});

export default router;