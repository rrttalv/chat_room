import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';


require('./config');

dotenv.config({path: path.resolve(__dirname, '../.env')});
const indexPath = path.join(__dirname, "../frontend/public/index.html");

const app = express();

app.use(express.json());
app.use(cors());

app.get("*", (res, res) => {
    res.sendFile(path.join(indexPath, "index.html"));
});


app.use((err, req, res, next) => {
    if(typeof err === 'object'){
        res.status(400).json(err);
        return
    }
    res.status(400).json({message: err});
});

