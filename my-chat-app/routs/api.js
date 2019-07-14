const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/db');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const {User,validateUser} = require("../models/user");
const {Group,validateGroup} = require("../models/group");
const getToken = require('../helpers/getToken');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express api');
});

router.post('/signup' ,async (req,res) => {
  if (!req.body.username || !req.body.password) {
    console.log("post if no vars")
      res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    
        let user = await User.findOne({username:req.body.username});

        console.log("post else  vars",user)

        if (user) {
          console.log(" users exist",user)

          return res.json({success: false, msg: 'Username already exists.'});
        } else {
            user = new User ({
            username:req.body.username,
            password:req.body.password
            });
            console.log("here----",user)

            // let {error} = validateUser(user);
            // if(error) return res.status(404).json({success: false, msg: error.details[0].message});
            console.log("before saving",user)

            await user.save();
            res.json({success: true, msg: 'Successful created new user.'});
        }
      }
});



router.post('/signin' , async (req,res) => {
  console.log("in sign in",req.body);
  let user = await User.findOne({username:req.body.username});
        if (!user) {
          return res.status(401).send({success: false, msg: 'Username isn\'t exists.'});
        } else {
          let isMatch = await user.comparePassword(req.body.password);
          if (isMatch){
            var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
          }else{
            res.status(401).send({success: false, msg: 'Authentication failed -Wrong password.'});
          }  
        }
      });
      
  //----------group routs---------------- need to be moved to other file for making cleaner code
  router.get('/group', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
    var token = getToken(req.headers);
    if (token) {
      let groups = await Group.find().select('-_id -v');
      console.log("in getgroup rout",groups);
      res.send(groups);
    }else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }   
  });


router.post('/group', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body);
    let group = new Group({
      creator : req.user,
      name : req.body.name
    });
    let {error} = validateGroup(group);
    if(error) return res.status(404).json({success: false, msg: error.details[0].message});
    await group.save();
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }   
});

router.delete('/group/:id', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
      console.log(req.user.username);
      console.log(req.params.id);
      let group = await Group.findOne({name : req.params.id});
      console.log(group);

      if (group.creator === req.user.username) {
        let deleteObj = await group.deleteOne();
        var mesg =deleteObj==null?"Error occured ,group wasn\'t deleted":'Group was deleted sucessesfully';
        console.log('deletesatus',deleteObj)
        if (mesg.match(/Error*/)) {
          res.status(500).send({msg:mesg})
        }else{
          console.log('in else remove - 200')
          res.send({msg:mesg})
        }
      }else{
        res.status(401)
        .send({'msg':"Unauthorized to remove a group that you didn\'t create"} )
      }
  }else {
    return res.status(403).send( {'msg':'Unauthorized.'});
  }   
});





module.exports = router;