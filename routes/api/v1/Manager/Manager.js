const express = require('express');
const routes = express.Router();
const Manager = require('../../../../model/Manager/Manager');
const passport = require('passport');
const ManagerController = require('../../../../controller/api/v1/Manager/ManagerController'); 

routes.post('/add_manager',passport.authenticate("jwt",{failureRedirect:"/admin/manager/failLogin"}),Manager.managerUploadImage,ManagerController.add_manager);

routes.post('/login',ManagerController.login);

routes.get('/profile',passport.authenticate("Manager",{failureRedirect:"/admin/manager/failLogin"}),ManagerController.profile);

routes.put('/editManager/:id',passport.authenticate("Manager",{failureRedirect:"/admin/manager/failLogin"}),Manager.managerUploadImage,ManagerController.editManager);

routes.delete('/deleteManager/:id',passport.authenticate("Manager",{failureRedirect:"/admin/manager/failLogin"}),ManagerController.deleteManager);

routes.get("/viewAllUser",passport.authenticate("Manager",{failureRedirect:"/admin/manager/failLogin"}),ManagerController.viewAllUser);

routes.get("/faillogin" ,async (req,res) =>{
    return res.status(400).json({msg:'invalid Login',status:0});
})

module.exports = routes;
