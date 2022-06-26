const getresetToken = async(user)=>{
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashed_resetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    const dic_hashed_token = {"resetPasswordToken":hashed_resetToken}
    
    const user_token = await User.findByIdAndUpdate(user._id,dic_hashed_token,{
        new:true,runValidators:true,
        useFindAndModify:false
    })
    const resetTokenexpire = {"resetPasswordExpire":Date.now() + 15*60*1000}
    const user_token_expire = await User.findByIdAndUpdate(user._id,resetTokenexpire,{
        new:true,runValidators:true,
        useFindAndModify:false
    })

    return resetToken;


}
module.exports = getresetToken;