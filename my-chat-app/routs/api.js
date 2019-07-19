const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/db');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const {User,validateUser} = require("../models/user");
const {Group,validateGroup} = require("../models/group");
const {Message,validateMessage} = require("../models/message");
const getToken = require('../helpers/getToken');


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
  console.log('user',user)
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
      let groups = await Group.find().select(' -v');
      console.log("in getgroup rout",groups);
      res.send(groups);
    }else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }   
  });

  router.get('/group/:id', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
    var token = getToken(req.headers);
    if (token) {
      let group = await Group.findById(req.params.id).select(' -v');
      console.log("in ftftftft rout",group);
      res.send(group);
    }else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }   
  });


router.post('/group', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
    let group = await Group.findOne({name:req.body.name});
    if (group) return res.status(400).send({msg:'Group name is already taken,try a different name'})
    console.log(req.body);
      group = new Group({
      creator : req.user.username,
      name : req.body.name,
      description:req.body.description
    });
    let {error} = validateGroup(group);
    console.log('eeror Joi post group',error.details[0].message)
     if(error && error.details[0].message!='"$__" is not allowed') return res.status(400).json({success: false, msg: error.details[0].message});
    group = await group.save();
    var mesg =group==null?"Error occured ,group wasn\'t added":'Group was added sucessesfully';
    console.log('addGroupStatus',group)
    if (mesg.match(/Error*/)) {
      res.status(500).send({msg:mesg})
      }else{
        console.log('in else add - 200')
        res.send({msg:mesg})
      }
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }   
});

router.put('/group/:id', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
      console.log(req.user.username);
      console.log(req.params.id);

      let group = await Group.findById(req.params.id);
      if (!group) return res.status(404).send({msg:'Group was not found'})
      console.log(group);
      console.log("before find NOTHER");
      //check if name alredy taken 
      let otherGroup = await Group.find().and([
          {name:req.body.name},
          {_id:{ $ne: req.params.id }}
        ])
        console.log('other group ',otherGroup)
      if (otherGroup.length > 0) return res.status(400).send({msg:'Group name is already taken'})
    //check that has premmisions to edit
    console.log( group.creator === req.user.username)
   
      if (group.creator === req.user.username) {
          console.log('in if creator')

          group.creator = req.user.username;
          group.name = req.body.name;
          group.description=req.body.description;
          let {error} = validateGroup(group);
          console.log('eeror Joi post group',error.details[0].message)
           if(error && error.details[0].message!='"$__" is not allowed') return res.status(400).json({success: false, msg: error.details[0].message});
            group = await group.save();
          var mesg =group==null?"Error occured ,group wasn\'t updated":'Group was updated sucessesfully';
          console.log('addGroupStatus',group)
          if (mesg.match(/Error*/)) {
            res.status(500).send({msg:mesg})
          }else{
            console.log('in else add - 200')
            res.send({msg:mesg})
          }
      }else{
        return res.status(403).send({ msg: 'Unauthorized.'});
        }
     } else {
     return res.status(403).send({ msg: 'Unauthorized.'});
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

//--------------------message routes ---------------------------------

router.get('/message', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
    let messages = await Message.find().select(' -v');
    console.log("in getMsg rout",messages);
    res.send(messages);
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }   
});
router.get('/message/:gname', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
    let messages = await Message.find({Gname:req.params.gname}).select(' -v');
    console.log("in getMsg rout",messages);
    res.send(messages);
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }   
});
router.post('/message', passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token) {
    
    console.log(req.body);
    message = new Message({
      sender : req.user.username,
      Gname : req.body.room,
      content:req.body.message
    });
    let {error} = validateMessage(message);
    console.log('eeror Joi post msg',error.details[0].message)
    if(error && error.details[0].message!='"$__" is not allowed') return res.status(400).json({success: false, msg: error.details[0].message});
    message = await message.save();
    var mesg =message==null?"Error occured ,message wasn\'t added":'Message was added sucessesfully';
    console.log('messageStatus',message)
    if (mesg.match(/Error*/)) {
      res.status(500).send({msg:mesg})
      }else{
        console.log('in else addmsg - 200')
        res.send({msg:mesg})
      }
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }   
});


router.get('/me',passport.authenticate('jwt', { session: false}) ,async (req,res) =>{
  var token = getToken(req.headers);
  if (token){
    console.log('here',req.user.username);
   res.send({user:req.user.username});
  }else{
    res.sendStatus(401);
  }
})


module.exports = router;