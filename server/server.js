import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import auth from './routes/auth';
import socket from 'socket.io';
import queue from './queue';
require('./config');

dotenv.config({path: path.resolve(__dirname, '../.env')});
const indexPath = path.join(__dirname, '../frontend/public/index.html');

const app = express();

const io = socket(http.createServer(app));

queue.connect(io);

app.use(express.json());
app.use(cors());

app.use('/auth', auth)

app.get("*", (req, res) => {
    res.sendFile(path.join(indexPath, 'index.html'));
});

global.messageSocket = queue.connect(io);

app.use((err, req, res, next) => {
    console.log(err);
    if(typeof err === 'object'){
        res.status(400).json(err);
        return
    }
    res.status(400).json({message: err});
});

const { SERVER_PORT: sp } = process.env;

app.listen(sp || 8080, console.log.bind(console, 'Server started on port: ' + sp))