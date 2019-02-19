const User = require("../models/users");
const passport = require('passport');
const _ = require('lodash');

exports.t =  (req,res) => {
    res.send('hello');
}

exports.get_user = (req,res) => {
    
    User.findOne({
        email : req.body.email,
        password : req.body.password
    }).exec( (err,result) => {
        if(err){
            res.send('error');
        }else if(result == null){
            res.json({"status" : false});
         }
         else{
             res.json({"status" : true});
         }
    } );
}


exports.authenticate = (req,res,next) => {
     
    passport.authenticate('local', (err,user,info) => {
        
        //error from passport middleware
        if(err) return res.status(400).json(err);
        //registered user
        else if(user){
            return res.status(200).json({"token" : user.generateJwt()});
        }
        //unknown user or wrong password
        else
        {
            console.log(info);
             return res.status(404).json(info);
        }
    })(req,res);
}

exports.create_user =  (req,res) => {
    
    var user = new User();
    user.name = req.body.name;
    user.gender = req.body.gender;
    user.email = req.body.email;
    user.password = req.body.password;
    user.username = req.body.username;

    user.save((err,result) => {
        if(err){
            if(err.code == 11000){
                var field = err.errmsg.split("index:")[1];
                field = field.split("_")[0];
                res.status(422).send(["An account with this " + field.trim() + " already exists."]);
            }
            else
            return next(err);
        }
        else{      
         res.send(result);
        }
    })
}

exports.userProfile = (req,res,next) => {
    User.findOne({ _id : req._id },
        (err, user) => { 
            if(!user)
                return res.status(404).json({ status : false , message : 'User record not found.'});
            else
                return res.status(200).json({ status : true , user : _.pick(user,['name','gender','email']) });
        });
}

