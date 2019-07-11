const mongoose = require('mongoose');
const Joi = require('Joi');
const bcrypt = require('bcryptjs');

const UserSchema =  new mongoose.Schema({
    username: {
        type: String,
        maxlength: 15,
        required: true,
        unique:true
    },
    password : {
        type:String,
        minlength:4,
        maxlength:1024,
        required:true
    }
})


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


UserSchema.methods.comparePassword = async function (passw) {
   let isMatch = await bcrypt.compare(passw, this.password);
    return isMatch;
};

const User = mongoose.model('User',Userschema);

function validateUser(user) {
    const schema = {
        username: Joi.string().maxlength(15).required(),
        password: Joi.string().maxlength(1024).required(),
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
