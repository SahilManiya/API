const bcrypt = require("bcrypt");
const jwtData = require("jsonwebtoken");
const path = require('path');
const express = require('express');
const Registration = require("../../../../model/admin/Registration");
const Manager = require('../../../../model/Manager/Manager');
const User = require("../../../../model/User_Model/User");
const Admin = require("mongodb");
const fs = require('fs');

module.exports.insertAdminData = async (req, res) => {
    try {
        if(req.body.password == req.body.c_pass){
            let checkmail = await Registration.findOne({ email: req.body.email });
            if (checkmail) {
                if(req.file){
                    await fs.unlinkSync(req.file.path);       
                }
                return res.status(200).json({ msg: "Email already exist", status: 0 });
            } 
            else {
                var imgPath = '';
                if(req.file){
                    imgPath = Registration.imageModel+'/'+req.file.filename;
                }
                req.body.adminImage = imgPath;
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let registrationData = await Registration.create(req.body);
                if (registrationData) {
                    return res.status(200).json({msg: "Data inserted successfully",status: 1,registrationData: registrationData})
                } 
                else {
                    return res.status(200).json({ msg: "Data not insert", status: 0 });
                }       
            } 
        }  
        else {
            if(req.file){
                await fs.unlinkSync(req.file.path);
            }
            console.log('password not Match');
            return res.status(200).json({ msg: 'Confirm Password not Match', status: 0 });
        }
    } 
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
}

module.exports.loginAdmin = async (req, res) => {
    try {
        let checkmail = await Registration.findOne({ email: req.body.email }); 
        if (checkmail) {
            if (await bcrypt.compare(req.body.password, checkmail.password)) {
                let token = jwtData.sign({ userDate: checkmail }, "jwtApi", {expiresIn: "1h"});
                return res.status(200).json({msg: "Login successfully",status: 1,token: token,});
            } 
            else {
                return res.status(200).json({ msg: "Invalid Password", status: 0 });
            }
        } 
        else {
            return res.status(200).json({ msg: "Email not match", status: 0 });
        }
    } 
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};

module.exports.viewAllAdmin = async (req, res) => {
    try {
        let allData = await Registration.find({});
        if(allData){
            return res.status(200).json({ msg: "Here is Admin data", status: 1, allData: allData });
        }
        else{
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }
    } 
    catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};

module.exports.profile = async(req,res)=>{
    try {
        let data = await req.user;
        if(data){
            let adminData = await Registration.findById(req.user.id).populate('managerIds').exec();
            console.log(adminData.managerIds);
            return res.status(200).json({ msg: "AdminProfile Data", status: 1, rec: data });
        }
        else{
            return res.status(200).json({ msg: "Somthig Wrong", status: 0 });
        }
    } 
    catch (error) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 }); 
    }
}

module.exports.editAdmin = async(req,res)=>{
    try {
        if(req.file){
            let oldData = await Registration.findById(req.params.id);
            if(oldData.adminImage){
                let fullPath = path.join(__dirname,"../../../..",oldData.adminImage);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = Registration.imageModel+'/'+req.file.filename;
            req.body.adminImage = imgPath;
        }
        else{
            let oldData = await Registration.findById(req.params.id);
            var imgpath = '';
            if(oldData){
                imgpath = oldData.adminImage;
            }
            req.body.adminImage = imgpath;
        }
        let data = await Registration.findByIdAndUpdate(req.params.id,req.body);
        if(data){
            let updateData = await Registration.findById(req.params.id);
            return res.status(200).json({msg:'Data Updated Succ....',status:1,rec:updateData});
        }
        else{
            return res.status(400).json({msg:'not Updated',status:0});
        }
    } 
    catch (error) {
        return res.status(400).json({msg:'Somthing Wrong',status:0});    
    }
}

module.exports.deleteAdmin = async(req,res)=>{
    try {
        let data = await Registration.findById(req.params.id);
        if(data.adminImage){
            let fullPath = path.join(__dirname,"../../../..",data.adminImage);
            await fs.unlinkSync(fullPath);
            let deleteData = await Registration.findByIdAndDelete(req.params.id);
            if(deleteData){
                console.log("AdminRecord And Image Delete");
                return res.status(200).json({msg:'Admin Data and Image Delete Successfully',status:1,rec:deleteData});
            }
            else{
                console.log("Adin Image Delete");
                return res.status(200).json({ msg: "Admin Image Delete Successfully", status: 0 });
            }
        }
        else{
            let deleteData = await Registration.findByIdAndDelete(req.params.id);
            if(deleteData){
                console.log("AdminRecord Delete");
                return res.status(200).json({msg:'Admin Data Delete Successfully',status:1,rec:deleteData});
            }
            else{
                console.log("Admin Record not Delete");
                return res.status(200).json({ msg: "Admin Record not Delete", status: 0 });
            }   
        }
    } 
    catch (error) {
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}

module.exports.viewAllManager = async(req,res)=>{
    try {
        let managerData = await Manager.find({});
        if(managerData){
            return res.status(200).json({msg:"View All Manager Data",status:1,rec:managerData});
        }
        else{
            return res.status(200).json({msg:"Manager Data Not Showing",status:0})
        }
    } 
    catch (error) {
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}

module.exports.viewAllUser = async(req,res)=>{
    try {
        let UserData = await User.find({});
        if(UserData){
            return res.status(200).json({msg:"All User Data",status:1,rec:UserData});
        }
        else{
            return res.status(200).json({msg:"User Data not Showing",status:0});
        }
    } 
    catch (error) {
        console.log("Somthing Wrong");
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}