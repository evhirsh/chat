const mongoose = require('mongoose');
const Joi = require('Joi');
const bcrypt = require('bcryptjs');

const userSchema =  new mongoose.Schema({
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


// userSchema.pre('save', function (next) {
//     let user = this;
//     console.log('presave')
//     if (this.isModified('password') || this.isNew) {
//         console.log("before hash ",user)

//         bcrypt.genSalt(10, function (err, salt) {
//             if (err) {
//                 return next(err);
//             }
//             console.log(`salt and pass",${user.password} salt ${salt}`)

//             bcrypt.hash(user.password, salt, null, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//                 user.password = hash;
//                 console.log("after hash",user)

//                 next();
//             });
//         });
//     } else {
//         return next();
//     }
// });
userSchema.pre('save', async function () {
    var user=this;
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password,salt);
    console.log("before save after hash")
    this.password = hash;
});


userSchema.methods.comparePassword = async function (passw) {
   let isMatch = await bcrypt.compare(passw, this.password);
    return isMatch;
};

const User = mongoose.model('User',userSchema);

function validateUser(user) {
    const schema = {
        username: Joi.string().max(15).required(),
        password: Joi.string().max(1024).required(),
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
