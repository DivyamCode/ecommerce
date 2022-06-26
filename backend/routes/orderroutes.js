const express = require('express');
const { is } = require('express/lib/request');
const { neworder, getOrderbyId,
     getAllorderMe,
     getAllorder, 
     updateOrder, 
     deleteOrder} = require('../controller/orderController');
const isAuthenticatedUser = require('../middleware/auth');

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,neworder);
router.route("/order/me").get(isAuthenticatedUser,getAllorderMe);
router.route("/order/allorder").get(isAuthenticatedUser,getAllorder);
router.route("/order/:id").get(isAuthenticatedUser,getOrderbyId);

//fully admin route
router.route("/admin/order").get(isAuthenticatedUser,getAllorder);

router.route("/admin/order/:id").put(isAuthenticatedUser,updateOrder).delete(isAuthenticatedUser, deleteOrder);


module.exports = router;