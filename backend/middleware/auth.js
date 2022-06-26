const catchAsyncEror = require("../utils/catchAsyncEror");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require('jsonwebtoken');
const { userLogin } = require("../controller/userController");
const User = require("../model/userModel");


const isAuthenticatedUser = catchAsyncEror(async (req,res,next)=>{
    try {
        const token1 = req.cookies;
        if(!token1.token){
            res.status(401).json({
                success:false,
                message:"please login to access this resources"
            })
            return null
        }
        const c_token = token1.token;
        
        const decodedData = jwt.verify(c_token,process.env.JWT_SECRET);
        
        req.user = await User.findById(decodedData.id);
        console.log(req.user.roll);

        next();
    } catch (error) {
        
    }
});


// const authorizeRole = async(req,res,next)=>{
//     const user = await User.findById(req.user.id);
//     if(!(user.roll=="Admin")){
//         res.status(403).json({
//             message:"unauthorized route access"
//         }) 
//     }
//     req.user = user;
//     next();
// }

// module.exports = authorizeRole;
// exports.authorizeRoles = (...roles)=>{
//     return (req,res,next)=>{
//         if(!roles.includes(req.user.role)){
//             return next(
//                 new ErrorHandler(
//                     `Role: ${req.user.role} is not allowed to access this resources`,
//                     403
//                 )
//             )
//         }
//     }
// };
module.exports = isAuthenticatedUser

