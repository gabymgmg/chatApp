const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const app = express();
const server = createServer(app);
const io = new Server(server);
const { userModel, messageModel } = require('./message.js')
require('dotenv').config();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post('/login',(req,res) =>{
  
})

// DB config
mongoose.connect(process.env.MONGODB_URI)

io.on('connection', (socket) => {
  socket.on('add user', async (username) => {
    try {
      const existingUser = await userModel.findOne({ username })
      if (existingUser) {
        const existingMessages = await messageModel.find({ createdAt: { $gte: existingUser.createdAt }})
        .sort({ createdAt: -1 }) // Sort by createdAt descending 
        .limit(10) 
        .select({ _id: 0, content: 1, username: 1, createdAt: 1 });
        socket.emit('add user response', { success: true, existingMessages })
      }
      else {
        const newUser = new userModel({ username })
        await newUser.save() // Save the new user
        socket.username = username
        socket.emit('add user response',{ success: true })
      }
    } catch (error) {
      console.error('Error handling user join:', error);
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnecteed')
    socket.emit('user left', socket.username)
  })

  socket.on('chat message', async (data) => {
    console.log('calling chat in server', data)
    try {
      const newMessage = new messageModel({ content: data.content, username: data.username })  // Create message using model
      await newMessage.save() // Save the message to DB
      // Broadcast the message to all clients
      io.emit('chat message', data)
    } catch (error) {
      console.error(error)
    }
  })
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

