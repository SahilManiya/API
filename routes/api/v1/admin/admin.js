const express = require("express");

const Passport = require("passport");

const Registration = require('../../../../model/admin/Registration');

const adminController = require("../../../../controller/api/v1/admin/adminContoller");

const routes = express.Router(); 

routes.post("/insertAdminData",Registration.uploadImage ,adminController.insertAdminData);


routes.post("/loginAdmin", adminController.loginAdmin);

routes.put('/editAdmin/:id',Passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),Registration.uploadImage,adminController.editAdmin);

routes.get("/viewAllAdmin",Passport.authenticate("jwt", {failureRedirect: "/admin/failLogin" }),adminController.viewAllAdmin);

routes.delete('/deleteAdmin/:id',Passport.authenticate("jwt",{failureRedirect :"/admin/failLogin"}),adminController.deleteAdmin);

routes.get('/profile',Passport.authenticate("jwt",{failureRedirect:"/admin/failLogin"}),adminController.profile);

routes.get("/viewAllManager",Passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.viewAllManager);

routes.get("/viewAllUser",Passport.authenticate("jwt",{failureRedirect:"/admin/failLogin"}),adminController.viewAllUser);

routes.use('/manager',require('../Manager/Manager'));

routes.get("/failLogin", async (req, res) => {
    return res.status(400).json({ msg: "Invalid username or password", status: 0 });
});

module.exports = routes;
