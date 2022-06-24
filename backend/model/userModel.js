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


userSchema.pre("save",async function(next){
     
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

//JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

//creating methods function ap[plicable on middleware databse model]

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  


userSchema.methods.getResetPasswordToken =function(){
        //Generating Token
        const resetToken = crypto.randomBytes(20).toString("hex");

        //hashing and add to user Schema
        this.resetPasswordToken = crypto.createHash("sha256").
        update(resetToken)
        .digest("hex");

        this.resetPasswordExpire = Date.now() + 15*60*1000;

        return resetToken;

}


module.exports = mongoose.model("user",userSchema);




