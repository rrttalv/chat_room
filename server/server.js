import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import auth from './routes/auth';
import dashboard from './routes/dashboard';
import socket from 'socket.io';
import queue from './queue';
require('./config');

dotenv.config({path: path.resolve(__dirname, '../.env')});
const indexPath = path.join(__dirname, '../frontend/public/index.html');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', auth);
app.use('/dash', dashboard);
const { SERVER_PORT: sp } = process.env;

const server = app.listen(sp, console.log.bind(console, 'Server started on port: ' + sp));

const io = socket(server, {
    path: '/socket',
    serverClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie:false,
});

queue(io);

app.get("*", (req, res, next) => {
    res.sendFile(path.join(indexPath, 'index.html'));
});

app.use((err, req, res, next) => {
    //console.log(err);
    if(typeof err === 'object'){
        res.status(400).json(err);
        return
    }
    res.status(400).json({message: err});
});