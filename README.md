# chat_room
Full-stack websocket based chat room app using socket.io for seamless data transmission with queued database jobs.

### Requirements

This project was built with the following versions
* NPM 6.11.3
* NodeJS 12.16.2
* Redis 3.2.100
* MongoDB 3.6

### Running in development

The webserver should always run on port 8080 for the websocket connection to work. You should not reconfigure the node server port, otherwise you will have to reconf the websocket connection too.

**Make sure you have a redis server up and running.**

[Get redis for windows](https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/)

[Get redis for linux](https://redis.io/download)

**Make sure you have a mongodb instance up and running.**

This project was developed using a free [mlab](https://mlab.com) mongoDB server.

*Newer mongodb versions may not be compatible.*

Create a .env file in the root of the project. Look at the .example.env file to see specific fields that should be defined.


**Starting the application**

Open two `terminal` or `cmd` instances.

CD into the /frontend directory, run `npm install` and `npm start` to start the frontend of the applicaton. The frontend will be served on port 3000.

CD into the /server directory, run `npm install` and `npm run start` to start the backend server.