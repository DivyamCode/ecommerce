const mongoose = require("mongoose");

const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"Name cannot exceed 30 character"],
        minLength:[4,"Nmae cannot smaller than 4 charcater"]
    },
    email:{
        type:String,
        require:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter your valid email"],
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password should be greater than 8 character"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    roll:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
});



module.exports = mongoose.model("user",userSchema);




