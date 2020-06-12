import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../../.env')});

const options = {
  useNewUrlParser: true,
  useFindAndModify: false
};

const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;
const url = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose.connect(url, options)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Failed to connect to database'));
db.once('open', console.log.bind(console, 'Connected to database'));

const { REDIS_PORT, REDIS_HOST } = process.env;

export const redisConfig = {
  port: REDIS_PORT,
  host: REDIS_HOST
};