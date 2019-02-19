const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name : String,
    gender : String,
    email : { type : String , unique : true },
    username : { type : String , unique : true},
    password : String,
    saltSecret : String
});

//events
UserSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(this.password, salt, (err,hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        })
    })
});

//Methods

UserSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generateJwt = function() {
    return jwt.sign({ _id : this._id, username : this.username }, "SECRET#123",{expiresIn : "30m"});
}



module.exports = mongoose.model('User',UserSchema);