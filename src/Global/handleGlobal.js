'use strict';

require('dotenv').config();
const io = require('socket.io');
const PORT = process.env.PORT || 3002;
const eventPool = require('../eventPool.js');


const server = io(PORT);
const global = server.of('/caps');

global.on('connection', (socket) => {
  socket.on('join', (payload) => {
    console.log(payload);
    socket.join(payload.orderID);
    console.log(`Welcome to room : ${payload.orderID}`);
    global.to(payload.orderID).emit('Welcome');



  });

  console.log('User connected!');

  // logs every event in the event pool
  eventPool.forEach(event => {
    socket.on(event, (payload) => {
      console.log('EVENT', payload);
    });
  });

  socket.on('pick-up', (payload) => socket.broadcast.emit('pick-up', payload));
  socket.on('in-transit', (payload) => socket.broadcast.emit('in-transit', payload));
  socket.on('delivered', (payload) => socket.broadcast.emit('delivered', payload));
  socket.on('ready', (payload) => socket.broadcast.emit('ready', payload));
  socket.on('ready2', (payload) => socket.broadcast.emit('ready2', payload));
  socket.on('join', (payload) => socket.broadcast.emit('join', payload));
});

module.exports = global;
