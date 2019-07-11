const mongoose = require('mongoose');

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
  date:{
      type:Date,
      default:Date.now()
  }
}));

function validateGroup(group) {
    const schema = {
        creator: Joi.string().max(15).required(),
        name: Joi.string().minlength(3).maxlength(15).required(),
        date: Joi.Date()
    };
    return Joi.validate(group, schema);
}

module.exports.Group = Group;
module.exports.validateGroup = validateGroup;
