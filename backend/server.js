const app = require('./app');
const dotenv = require('dotenv');
//Database import
const connectDatabase = require("./database/database");

//Handling uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(`Error :${err}`);
    console.log(`shuting down the server due to uncaught exception`);

});






//connceting database
connectDatabase();

dotenv.config({path:"backend/config/config.env"});


const server = app.listen(process.env.PORT,()=>{
    console.log(`server running on port http://localhost:${process.env.PORT}`);
});

//Unhandled Promise Rejection

process.on("unhandledRejection",(err)=>{
    console.log(`eror:${err.message}`);
    console.log(`shuting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})