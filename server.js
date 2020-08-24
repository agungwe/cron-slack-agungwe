const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cron = require("node-cron");
const nodemailer = require("nodemailer");

//Models
const db = require("./app/models/index");

const app = express();

//create log
app.use(morgan('combined'))

//parse request application / json x-www-form-urlencode
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Sync database
db.sequelize.sync();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 1000000
    },
    abortOnLimit: true
}));


//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//order & user routes
require("./app/routes/order.routes")(app);
require("./app/routes/user.routes")(app);

//schedule task
// var task = cron.schedule("* * * * *", function() {
//     //* * * * * --> jalan per 1 menit
//     console.log("Ini jalan setiap menit");
//     require("./app/cron/cron")(nodemailer).then(console.log('Success send email'));
// });
// task.start;

//Schedule task Send Email Total Order
var task = cron.schedule("* 9 * * *", function() {
    //* 9 * * * --> jalan per jam 9 pagi
    console.log("Ini jalan setiap jam 9 pagi");
    require("./app/cron/cron_order")(nodemailer).then(console.log('Email telah terkirim ke User'));
    },{
        scheduled:true,
        timezone:"Asia/Jakarta"
    });
task.start;

//schedule task Send Slack - Total Order User
var task = cron.schedule("* 10 * * *", function() {
    //* 9 * * * --> jalan per jam 9 pagi
    console.log("Ini jalan setiap jam 10 pagi");
    require("./app/cron/cron_order"),console.log('Total Order per User telah terkirim ke Slack');
    },{
        scheduled:true,
        timezone:"Asia/Jakarta"
    });
task.start;

//set port, listen for request
const PORT = process.env.PORT || 8080;

app.listen(PORT,() =>{
    console.log(`server is running on http://localhost : ${PORT} `);
})