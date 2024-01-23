const mongoose = require("mongoose");
const path = require('path');
const imagePath = '/uploads/admin';
const multer = require('multer');

const registrationSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String
    },
    adminImage : {
        type : String
    },
    hobby: {
        type: Array
    },
    message: {
        type: String
    },
    managerIds : {
        type : Array,
        ref : 'Manager',
    }
})

registrationSchema.statics.imageModel = imagePath;

const imageStore = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,"../..",imagePath));
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now());
    }
})

registrationSchema.statics.uploadImage = multer({storage:imageStore}).single('adminImage');

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
