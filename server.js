// var express = require("express");
import express from "express";
let app = express();

let hostname = "localhost";
let port = 2020;

app.get("/helloword",(req,res) => {
    res.send("hello word");
});

app.listen(port, hostname,() => {
    console.log(`App listening on port ${port}`);
});