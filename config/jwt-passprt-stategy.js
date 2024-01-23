const Passport = require("passport");

const Registration = require("../model/admin/Registration");
const Manager = require('../model/Manager/Manager');
const User = require('../model/User_Model/User');

const jwtp = require("passport-jwt");
const jwtStrategy = require("passport-jwt").Strategy;

const jwtExtract = require("passport-jwt").ExtractJwt;

let opts = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "jwtApi",
}

let opts1 = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Manager",
}

let opts2 = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "User",
}

Passport.use(new jwtStrategy(opts, async (record, done) => {
        let data = await Registration.findById(record.userDate._id);
        if(data){
            return done(null,data);
        }
        else{
            return done(null,false);
        }
    })
);

Passport.use('Manager',new jwtStrategy(opts1, async (record, done) => {
        let data1 = await Manager.findById(record.managerData._id);
        if(data1){
            return done(null,data1)
        }
        else{
            return done(null,false);
        }
    })
);

Passport.use('User',new jwtStrategy(opts2, async (record, done) => {
        let data2 = await User.findById(record.userData._id);
        if(data2){
            return done(null,data2)
        }
        else{
            return done(null,false);
        }
    })
);

Passport.serializeUser((user, done) => {
    return done(null, user.id);
});

Passport.deserializeUser(async (id, done) => {
    let reCheck = await Registration.findById(id);
    reCheck ? done(null, reCheck) : done(null, false);
});
