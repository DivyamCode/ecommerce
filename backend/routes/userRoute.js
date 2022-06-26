const express = require('express');
const { registerUser, userLogin, logoutUser ,forgotPassword ,
        resetPassword, getUserdetail, 
        updatePassword, getAlluser, deleteUser, updateProfile1, getSingleuser }
         = require('../controller/userController');
const isAuthenticatedUser = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);


router.route("/me").get(isAuthenticatedUser,getUserdetail);
router.route("/updatePassword").put(isAuthenticatedUser,updateProfile1);

//for admin-----may -user also future decide
router.route("/alluser").get(getAlluser);
router.route("/me/update").post(isAuthenticatedUser, updateProfile1);
router.route("/delete/user/:id").delete(deleteUser);
router.route("/getsingleuser/:id").get(getSingleuser);





module.exports =router;