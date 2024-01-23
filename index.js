const express = require("express");

const Passport = require("passport");

const session = require("express-session");

const passportjwt = require("./config/jwt-passprt-stategy");

const db = require("./config/mongoose");

const port = 8002;

const app = express();

app.use(
    session({
        name: "JWTSESSION",
        secret: "jwtApi",
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
    })
);

app.use(Passport.initialize());

app.use(Passport.session());

app.use(express.urlencoded());

app.use("/",require("./routes/api/v1/User_Routes/User"));
app.use("/admin", require("./routes/api/v1/admin/admin"));

app.listen(port, (err) => {
    err
        ? console.log("Server not responding")
        : console.log(`Server respond successfully st port: ${port}`);
});
