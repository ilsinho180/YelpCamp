const express=require("express");
const router=express.Router();
const catchAsync=require("../Utils/catchAsync.js")
const passport = require("passport");
const users=require("../controllers/users.js");

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", { failureRedirect: '/login', failureFlash: true , keepSessionInfo: true}), users.login);

router.get("/logout", users.logout );

module.exports=router;