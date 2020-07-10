var express = require("express");
var app = express();

var hostname = "localhost";
var port = 2020;

app.get("/helloword",(req,res) => {
    res.send("hello word");
});

app.listen(port, hostname,() => {
    console.log(`App listening on port ${port}`);
});