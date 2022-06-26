const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message ||"internal server eror";

    //wrong MongoDb Id eror

    if(err.name === "CastError"){
        const message = `Resource not founf. INvalid path ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Mongoose duplicate key eror
    if(err.code ===11000){
        const message = `Duplicate ${object.keys(err.KeyValue)} Entered`;
        err = new ErrorHandler(message,400);

    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message

    })

}