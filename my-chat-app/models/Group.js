const mongoose = require('mongoose');
const Joi = require('joi')

const Group = new mongoose.model('Group', new mongoose.Schema({
  creator: {
    type: String,
    maxlength: 15,
    required: true
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
    unique:true
  },
  description:{
    type:String,
    maxlength:25
  },
  date:{
      type:Date,
      default:Date.now()
  }
}));

function validateGroup(group) {
    const schema = {
        creator: Joi.string().max(15).required(),
        description: Joi.string().max(25).allow('').optional(),
        name: Joi.string().min(3).max(15).required()
    };
    return Joi.validate(group, schema);
}

module.exports.Group = Group;
module.exports.validateGroup = validateGroup;
