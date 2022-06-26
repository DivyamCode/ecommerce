const express = require('express');
const Product = require("./model/productModel");




const app = express();
const cookieparser = require('cookie-parser');

var bodyParser = require('body-parser');
// const errorMiddleware = require("./middleware/eror");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());

//Eror handler

// app.use(errorMiddleware);


//Route imports

const product = require("./routes/productRoutes");
const user = require("./routes/userRoute");
const order = require('./routes/orderroutes');

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);

module.exports = app;