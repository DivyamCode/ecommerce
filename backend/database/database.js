const mongoose = require('mongoose');

const connectDatabase = ()=>{

    // mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,
    //     useUnifiedTopology:true,
    //     useCreateIndex:true}).then((data) =>{
    //         console.log(`Mongodb connected with server : ${data.connection.host}`);
        
    //     }).catch((err)=>{
    //         console.log(err);
    //     })

    mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce", { useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=> console.log("connection succesfull ..."))
    // .catch((err)=>console.log(err));

    // console.log('connection success database');


}

module.exports = connectDatabase

