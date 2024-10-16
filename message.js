const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
      type: Date,
      default: Date.now 
    }
  });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now 
    }
})

const userModel = mongoose.model('User', userSchema);
const messageModel = mongoose.model('Message', messageSchema);
module.exports = {userModel, messageModel}
