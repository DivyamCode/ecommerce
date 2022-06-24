const express = require('express');
const { registerUser, userLogin, logoutUser ,forgotPassword , resetPassword, getUserdetail } = require('../controller/userController');
const isAuthenticatedUser = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser,getUserdetail);



module.exports =router;