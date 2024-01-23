const mongoose = require('mongoose');
const path = require('path');
const imagePath = '/uploads/UserImages';
const multer = require('multer');

const UserSchema = mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    userImage : {
        type : String
    }
})

UserSchema.statics.imageModel = imagePath;
const imageStore = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,"../..",imagePath));
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now());
    }
})
UserSchema.statics.uploadImage = multer({storage:imageStore}).single('userImage');

const User = mongoose.model('User',UserSchema);
module.exports = User;