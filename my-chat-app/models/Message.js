const mongoose = require('mongoose');
const Joi = require('joi')

const Message = new mongoose.model('Message', new mongoose.Schema({
  sender: {
    type: String,
    maxlength: 15,
    required: true
  },
  Gname: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
  },
  content:{
    type:String,
    maxlength:70,
    required:true
  },
  date:{
      type:Date,
      default:Date.now()
  }
}));

function validateMessage(message) {
    const schema = {
        sender: Joi.string().max(15).required(),
        content: Joi.string().max(70).required(),
        Gname: Joi.string().min(3).max(15).required()
    };
    return Joi.validate(message, schema);
}

module.exports.Message = Message;
module.exports.validateMessage = validateMessage;
