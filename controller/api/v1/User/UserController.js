const User = require('../../../../model/User_Model/User');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwtData = require('jsonwebtoken');

module.exports.add_user = async(req,res)=>{
    try{
        if(req.body.password == req.body.c_pass){
            let checkmail = await User.findOne({email:req.body.email});
            if(checkmail){
                if(req.file){
                    await fs.unlinkSync(req.file.path);
                }
                return res.status(200).json({ msg: "Email already exist", status: 0 });
            }
            else{
                let imgPath = '';
                if(req.file){
                    imgPath = await User.imageModel+'/'+req.file.filename;
                }
                req.body.userImage = imgPath;
                req.body.password = await bcrypt.hash(req.body.password,10);
                var newpass = req.body.password;
                let UserData = await User.create(req.body);
                if(UserData){
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
                    })
                    return res.status(200).json({msg:'Data Inserted Succfully Check Mail',status:1,rec:UserData});
                }
                else{
                    console.log("User Data Inserted Successfullly");
                    return res.status(200).json({msg: "Data inserted successfully",status: 1,rec: UserData});
                }
            }
        } 
        else{
            if(req.file){
                await fs.unlinkSync(req.file.path);
            }
            return res.status(200).json({ msg: "Password not Match", status: 0 });
        }      
    }
    catch(err){
        console.log("Something Wrong");
        return res.status(400).json({msg:"Something Wrong",status:0});  
    }
}

module.exports.login = async(req,res)=>{
    try {
        let checkmail = await User.findOne({email:req.body.email});
        if(checkmail){
            if(await bcrypt.compare(req.body.password,checkmail.password)){
                let token = await jwtData.sign({userData :checkmail},'User',{expiresIn:'1h'});
                return res.status(200).json({msg: "Login successfully",status: 1,token: token,});
            }
            else{
                console.log("Password not Match")
                return res.status(200).json({ msg: "Password not Match", status: 0 });
            }
        }
        else{
            console.log("Invalid Email")
            return res.status(200).json({ msg: "Imvalid Email", status: 0 });
        }
    } 
    catch (error) {
        console.log("Something Wrong");
        return res.status(400).json({msg:"Something Wrong",status:0});   
    }
}

module.exports.profile = async(req,res)=>{
    try {
        let data = await req.user;
        if(data){
            return res.status(200).json({msg:"User Profile",status:1,rec:data});
        }
        else{
            return res.status(200).json({msg:"Somethig Went Wrong",status:0});
        }
    } 
    catch (error) {
        console.log("Something Wrong");
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}

module.exports.editUser = async(req,res)=>{
    try {
        if(req.file){
            let data = await User.findById(req.params.id);
            if(data.userImage){
                let fullPath = path.join(__dirname,"../../../..",data.userImage);
                await fs.unlinkSync(fullPath);
            }
            let imgPath = await User.imageModel+'/'+req.file.filename;
            req.body.userImage = imgPath;
            let dataUpdate = await User.findByIdAndUpdate(req.params.id,req.body);
            if(dataUpdate){
                let updateData = await User.findById(req.params.id);
                console.log("User Record and Image Updated Successfully")
                return res.status(200).json({msg:"User Record and Image Update Successfully",status:1,rec:updateData});
            }
            else{
                let updateData = await User.findById(req.params.id);
                console.log("User Image Update");
                return res.status(200).json({msg:"User Image Update",status:1,rec:updateData});
            }
        }
        else{
            let dataUpdate = await User.findByIdAndUpdate(req.params.id,req.body);
            if(dataUpdate){
                let updateData = await User.findById(req.params.id);
                console.log("User Record Updated Successfully")
                return res.status(200).json({msg:"User Record Update Successfully",status:1,rec:updateData});
            }
            else{
                console.log("User Data not Update");
                return res.status(200).json({msg:"User Record not Update",status:0});
            }
        }
    } 
    catch (error) {
        console.log("Something Wrong");
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}

module.exports.deleteUser = async(req,res)=>{
    try {
        let data = await User.findById(req.params.id);
        if(data.userImage){
            let fullPath = path.join(__dirname,"../../../..",data.userImage);
            await fs.unlinkSync(fullPath);
            let deleteData = await User.findByIdAndDelete(req.params.id);
            if(deleteData){
                console.log("User Record and Image Delete");
                return res.status(200).json({msg:"User Record and Image Delete",status:1,rec:deleteData});
            }
            else{
                console.log("User Image Delete");
                return res.status(200).json({msg:"User Image Delete",status:0,rec:deleteData});
            }
        }
        else{
            let deleteData = await User.findByIdAndDelete(req.params.id);
            if(deleteData){
                console.log("User Record and Image Delete");
                return res.status(200).json({msg:"User Record and Image Delete",status:1,rec:deleteData});
            }
            else{
                console.log("User Image Delete");
                return res.status(200).json({msg:"User Image Delete",status:0,rec:deleteData});
            }
        }
    } 
    catch (error) {
        console.log("Something Wrong");
        return res.status(400).json({msg:"Something Wrong",status:0});    
    }
}