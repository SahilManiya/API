const Manager = require('../../../../model/Manager/Manager');
const Register = require('../../../../model/admin/Registration'); 
const User = require("../../../../model/User_Model/User");
const path = require('path');
const nodemailer = require('nodemailer');
const express = require('express');
const jwtData = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

module.exports.add_manager = async(req,res)=>{
    try {
        if(req.body.password == req.body.cpass){
            let check = await Manager.findOne({email:req.body.email});
            if(check){
                if(req.file){
                    await fs.unlinkSync(req.file.path);
                }
                return res.status(200).json({msg:'Email alrady  Ragisted....',status:1});
            }
            else{
                var imgPath = '';
                if(req.file){
                    imgPath = Manager.managerImageModel+'/'+req.file.filename;
                }
                req.body.managerImage = imgPath;
                var newpass = req.body.password;
                req.body.password = await bcrypt.hash(req.body.password,10);
                req.body.adminIds = req.user.id;
                let data = await Manager.create(req.body);
                if(data){
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                          user: "sahilmaniya76@gmail.com",
                          pass: "ajmkqqnndvxjwmos",
                        },
                    });
                    const info = await transporter.sendMail({
                        from: 'sahilmaniya76@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: "Manager Added ✔", // Subject line
                        text: "Hello world?", // plain text body
                        html: `<b>email = ${req.body.email}</b></br></br><b>password = ${newpass}</b>`, // html body
                    });
                    let reg = await Register.findById(req.user.id);
                    reg.managerIds.push(data.id);
                    await Register.findByIdAndUpdate(req.user.id,reg);
                    return res.status(200).json({msg:'Data Inserted Succfully Check Mail',status:1,rec:data});
                }
                else{
                    return res.status(200).json({msg:'Data not Inserted Succ....',status:0});
                }
            }
        }
        else{
            if(req.file){
                await fs.unlinkSync(req.file.path);
            }
            console.log('password not Match');
            return res.status(200).json({msg:'Confirm Password not Match',status:0});
        }
    } 
    catch (error) {
        return res.status(200).json({msg:'Something Wrong',status:0});
    }
}

module.exports.login = async (req, res) => {
    try {
        let checkmail = await Manager.findOne({ email: req.body.email });
        if (checkmail) {
            if (await bcrypt.compare(req.body.password, checkmail.password)) {
                let token = jwtData.sign({ managerData: checkmail }, "Manager", {expiresIn: "1h"});
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
}

module.exports.profile = async(req,res)=>{
    try {
        let data = await req.user;
        if(data){
            let managerData = await Manager.findById(req.user.id).populate('adminIds').exec();
            return res.status(200).json({ msg: "AdminProfile Data", status: 1, rec: data });
        }
        else{
            return res.status(200).json({ msg: "Somthig Wrong", status: 0 });
        }
    } 
    catch (error) {
        return res.status(400).json({ msg: "Something went wrong", status: 0 });  
    }
}

module.exports.editManager = async(req,res)=>{
    try {
        if(req.file){
            let data = await Manager.findById(req.params.id);
            if(data.managerImage){
                let fullPath = path.join(__dirname,"../../../..",data.managerImage);
                await fs.unlinkSync(fullPath);
            }
            let imgPath = await Manager.managerImageModel+'/'+req.file.filename;
            req.body.managerImage = imgPath;
            let dataUpdate = await Manager.findByIdAndUpdate(req.params.id,req.body);
            if(dataUpdate){
                let updateData = await Manager.findById(req.params.id);
                console.log("Manager Data Update Successfully");
                return res.status(200).json({msg:"Manager Record not Update",status:1,rec:updateData});
            }
            else{
                console.log("Manager Image Update");
                return res.status(200).json({msg:"Manager Image Update",status:0});
            }
        }
        else{
            let dataUpdate = await Manager.findByIdAndUpdate(req.params.id,req.body);
            if(dataUpdate){
                let updateData = await Manager.findById(req.params.id);
                console.log("Manager Data Update Successfully");
                return res.status(200).json({msg:"Manager Record Update Successfully",status:1,rec:updateData});
            }
            else{
                console.log("Manager Data not Update");
                return res.status(200).json({msg:"Manager Record not Update",status:0});
            }
        }
    } 
    catch (error) {
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}

module.exports.deleteManager = async(req,res)=>{
    try {
        let data = await Manager.findById(req.params.id);
        if(data.managerImage){
            let fullPath = path.join(__dirname,"../../../..",data.managerImage);
            await fs.unlinkSync(fullPath);
            let deleteData = await Manager.findByIdAndDelete(req.params.id);
            if(deleteData){
                console.log("Manager Data And Image Delete Successfully");
                return res.status(200).json({msg:"Manager Record And Image Delete Successfully",status:1,rec:deleteData});
            }
            else{
                console.log("Manager Image Delete");
                return res.status(200).json({msg:"Manager Image Delete",status:0,rec:deleteData});
            }
        }
        else{
            var deleteData = await Manager.findByIdAndDelete(req.params.id);
            var Id = req.params.id;
            var findAdmin = await Register.findById(deleteData.adminIds);
            console.log(Id);
            console.log(findAdmin);
            let pos = findAdmin.managerIds.findIndex((v,i)=>v==Id);
            console.log(pos);
            findAdmin.managerIds.splice(pos,1);
            console.log(findAdmin);
            console.log(findAdmin.managerIds);
            await Register.findByIdAndUpdate(deleteData.adminIds,findAdmin);
            if(deleteData){
                console.log("Manager Data Delete Successfully");
                return res.status(200).json({msg:"Manager Record Delete Successfully",status:1,rec:deleteData});
            }
            else{
                console.log("Manager Data not Delete");
                return res.status(200).json({msg:"Manager Data not Delete",status:0,rec:deleteData});
            }
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