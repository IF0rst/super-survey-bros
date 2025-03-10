//## Dependencies ##\
const express = require("express");
const {urlencoded} = require("express");
const cookieParser = require('cookie-parser');
const router = require(__dirname + "/back_end/services/router.js");
const db = require(__dirname + "/back_end/services/db.js");

//## Variables ##\\
const expressInstance = express();
const PORT = 80

//## Config ##\\
expressInstance.engine('html', require('ejs').renderFile);
expressInstance.use(urlencoded({ extended: true }));
expressInstance.use(express.json());
expressInstance.use(cookieParser());

//## Initialize back_end ##\\
db.attemptConnect();
router.init(expressInstance)
expressInstance.listen(PORT,()=>{console.log("[*] Website Started")})