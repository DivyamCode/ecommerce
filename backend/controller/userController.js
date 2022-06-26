const crypto = require('crypto');

const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");
const bcrypt = require('bcryptjs');
const getResetToken = require('../utils/resetPassToken');

//register user

exports.registerUser = async(req,res,next)=>{
    try {
        
        let {name,email ,password} = req.body;
        password = await bcrypt.hash(password,10);

        const user = await User.create({
            name,email, password,
            avatar:{
                public_id:"this is sample id",
                url:"profilepic"
            },
        });

        sendToken(user,201,res);
    } catch (error) {       
    }
}

//login
exports.userLogin = async(req,res,next)=>{
    try {
        const {email,password} = req.body;

    if(!email || !password){
        res.status(404).json({
            success:false,
            message:"enter valid email and password"
        })
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        res.status(404).json({
            success:false,
            message:"invalid user and password"
        })
    }
    // console.log(user.password);
    const isPasswordMatched =await bcrypt.compare(password,user.password);
    if(!isPasswordMatched){
        res.status(404).json({
            success:false,
            message:"Invalid email and password"
        })
    }

    sendToken(user,200,res);
    } catch (error) {
        
    }
  


}

exports.logoutUser = async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"logout"
    })

}

//RESET PASSWORD LINK HERE BELOW IMPLEMENTED

exports.forgotPassword = async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        res.status(401).json({
            success:false,
            message:"Invalid email"
        })
    }
    console.log(user._id);

    const resetToken = await getResetToken(user);

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    console.log(resetPasswordUrl);
    console.log(resetToken);

    const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\n if you had not requested this please ignore it`;

    console.log("password reset is working on saving schema hashed resetPasswordToken");


    try {
        await sendEmail({
            email:user.email,
            suject:`${process.env.Website_name} password recovery`,
            message
        });
        res.status(200).json({
            success:true,
            message:`email sent to ${user.email} successfully`,

        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire= undefined;
        await user.save({validateBeforeSave:false});

        res.status(500).json({
            message:"something went wrong"

        }) 
    }
}
   

//RESET PASSWORD LINK

exports.resetPassword = async(req,res,next)=>{

    try {
        const resetToken = req.params.token;
        if(resetToken==null){
            res.send(404).json({
                message:"invalid url"
            })
            return null
        }
        const password = await bcrypt.hash(req.body.password,10);
        // const pass = {"password":password,
        //             "resetPasswordExpire":undefined,
        //             "resetPasswordToken":undefined
        //         };
    
        //creating hashed token
        resetPasswordToken_c = crypto
        .createHash("sha256").
        update(resetToken)
        .digest("hex");
    
        const user = await User.findOne({
            resetPasswordToken_c,
            resetPasswordExpire:{$gt:Date.now()},
        })
        console.log(user);
    
        if(!user){
            res.status(404).json({
                success:false,
                message:"invalid url"
            })
        }
        const update_password = await User.findByIdAndUpdate(user._id,{"password":password,
        "resetPasswordExpire":null,
        "resetPasswordToken":null
            },{
            new:true,runValidators:true,
            useFindAndModify:false
        })
        const user_l = await User.findById(user._id);
        // await user.save()
    
        sendToken(user_l,200,res);
    } catch (error) {
        
    }

}




//Get user detail

exports.getUserdetail = async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
}

exports.updatePassword = async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const {old_password,new_password,confirm_password} = req.body;
    const isPasswordMatched =await bcrypt.compare(old_password,user.password);

    if(!isPasswordMatched){
        res.status(401).json({
            message:"invalid old password"
        })
        return null
    }
    if(!(new_password==confirm_password)){
        res.status(401).json({
            message:"new password and confirm password do not match"
        })
        return null

    }
    const hashed_pass = await bcrypt.hash(new_password,10)
    const uppass = {"password":hashed_pass}
    const updatepassword = await User.findByIdAndUpdate(user._id,uppass,{
        new:true,runValidators:true,
        useFindAndModify:false
    })

    res.status(201).json({
        success:true,
        message:"password updated successfully",
        updatepassword
    })

}

exports.getAlluser = async(req,res,next)=>{
    const user = await User.find();
    res.status(200).json({
        success:true,
        user
    })
}

exports.deleteUser = async(req,res,next)=>{
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if(!deleteUser){
        return res.status(500).json({
            success:false,
            message:"User does not found"
        })
    }
    await deleteUser.remove();
    res.status(200).json({
        success:true,
        message:"User is removed"
    })

}

exports.updateProfile1 = async(req,res,next)=>{
    console.log("a");

    const user = await User.findById(req.user.id);
    const data = {"name":req.body.name,
    "email":req.body.email}
    
    const updateProfile = await User.findByIdAndUpdate(req.user.id,data,{
        new:true,runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        message:"updated profile successfully",
        updateProfile
    })


}
//generally for admin

exports.getSingleuser = async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    res.status(200).json({
        success:true,
        user
    });
}
