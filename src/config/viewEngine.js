import express from "express";
import exrpessEjsExtend from "express-ejs-extend";

//Cau hinh view engine cho ung dung
let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.engine("ejs", exrpessEjsExtend);
  app.set("view engine","ejs");
  app.set("views","./src/views");
};

module.exports = configViewEngine;