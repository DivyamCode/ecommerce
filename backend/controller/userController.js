const ErrorHandler = require("../utils/errorhandler");
const catchAsyncEror = require("../utils/catchAsyncEror");
const crypto = require('crypto');

const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");

//register user

exports.registerUser = catchAsyncEror( async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is sample id",
            url:"profilepic"
        },
    })

    sendToken(user,201,res);
})

//login
exports.userLogin = catchAsyncEror(async(req,res,next)=>{

    const {email,password} = req.body;

    //check user had given password

    if(!email || !password){
        return next(new ErrorHandler("Please enter your Email and Password"));
    }

    const user = User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Please enter your Email and Password",401));
    
    }
    const isPasswordMatched = user.comparePassword();

    if(!isPasswordMatched){
        return next(new ErrorHandler("Please enter your Email and Password",401));
    }

    sendToken(user,200,res);



})

exports.logoutUser = catchAsyncEror(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"logout"
    })

})

//RESET PASSWORD LINK HERE BELOW IMPLEMENTED

exports.forgotPassword = catchAsyncEror(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :-\n\n ${resetPasswordUrl}\n\n if you had not requested this please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password recovery`,
            message,

        });

        res.status(200).jsom({
            success:true,
            message:`email sent to ${user.email} successfully`,

        })

    } catch (eror) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire= undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
    }

})

//RESET PASSWORD LINK

exports.resetPassword = catchAsyncEror(async(req,res,next)=>{

    //creating hashed token
    this.resetPasswordToken = crypto
    .createHash("sha256").
    update(resetToken)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Reset password Token is invalid or has been expired"));

    }

    user.password = req.body.password;
    user.resetPasswordExpire=undefined;
    this.resetPasswordToken=undefined;

    await user.save()

    sendToken(user,200,res);

})



//Get user detail

exports.getUserdetail = catchAsyncEror(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})