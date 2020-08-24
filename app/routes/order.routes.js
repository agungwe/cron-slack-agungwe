module.exports = app => {
    const auth  = require('../middleware/auth');
    const orders = require("../controllers/order.controllers");
    //const cron_order = require("../cron/cron_slack_order");

    let router = 
    require("express").Router();

    //create a new order
    router.post("/", orders.create);
    //Pencarian semua data dari tabel
    router.get("/", orders.findAll);
    //Update data Order
    router.put("/update/:id", orders.updateOrder);
    
    //Send Email
    router.post("/kirim-email", orders.sendEmail);

    router.put("/image-photo/:id/:title", orders.uploadImageOrder);


    app.use("/orders", auth.isAuth,router);
}