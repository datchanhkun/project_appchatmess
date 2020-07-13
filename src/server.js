// var express = require("express");
import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRouters from "./routers/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";

// // Gia lap https de login fb
// import pem from "pem";
// import https from "https";
// //createCertificate la phuong thuc tao ra 1 chung chi SSL tu ki co thoi han 1 ngay
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//         throw err;
//     }
//     //Init app
//     let app = express();

//     //ket noi den mongodb
//     ConnectDB();

//     //Sau khi ket noi den mongodb roi moi goi den session
//     configSession(app);

//     //Cau hinh view engine
//     configViewEngine(app);

//     //Luu du lieu user, *de duoi cau hinh view engine*
//     app.use(bodyParser.urlencoded({ extended: true }));

//     //su dung flash messages
//     app.use(connectFlash());

//     //cau hinh passport js
//     app.use(passport.initialize());
//     app.use(passport.session());
//     //Init tat ca cac router
//     initRouters(app);

//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//         console.log(`App listening on port ${process.env.APP_PORT}`);
//     });

// });
//Init app
let app = express();

//ket noi den mongodb
ConnectDB();

//Sau khi ket noi den mongodb roi moi goi den session
configSession(app);

//Cau hinh view engine
configViewEngine(app);

//Luu du lieu user, *de duoi cau hinh view engine*
app.use(bodyParser.urlencoded({ extended: true }));

//su dung flash messages
app.use(connectFlash());

//cau hinh passport js
app.use(passport.initialize());
app.use(passport.session());
//Init tat ca cac router
initRouters(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`App listening on port ${process.env.APP_PORT}`);
});
