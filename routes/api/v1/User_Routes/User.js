const express = require('express');
const routes = express.Router();
const User = require('../../../../model/User_Model/User');
const UserController = require('../../../../controller/api/v1/User/UserController'); 
const Passport = require('passport');

routes.post("/add_user",User.uploadImage,UserController.add_user);

routes.post("/login",UserController.login);

routes.get("/profile",Passport.authenticate('User',{failureRedirect:"/failLogin"}),UserController.profile);

routes.put("/editUser/:id",Passport.authenticate('User',{failureRedirect:"/failLogin"}),User.uploadImage,UserController.editUser);

routes.delete("/deleteUser/:id",Passport.authenticate('User',{failureRedirect:"/failLogin"}),UserController.deleteUser);

routes.get("/failLogin",async(req,res)=>{
    return res.status(400).json({msg:'Invalid Login',status:0});
})

module.exports = routes;