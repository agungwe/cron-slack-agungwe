const db = require("../models/index");
const jwt = require('jsonwebtoken');
const slack = require("../slack/it.slack");
const { sequelize } = require("../models/index");
const User = db.users
const Order = db.orders;
const Op = db.Sequelize.Op;
require("dotenv").config()

//post
exports.create = (req, res) => {

    var user = (jwt.verify(req.headers.token, process.env.SECRET_JWT));
    console.log("user "+user.id);
    
    //Validate request
    if (!req.body.nama) {
        res.status(400).send(
            {
                message: "Content can not be empty"
            }
        );
        return;
    }
    //Create order
    const order = {
        nama: req.body.nama,
        tanggal: req.body.tanggal,
        harga: req.body.harga,
        foto_struk: "-",
        id_user: req.body.id_user,
    }
    Order.create(order)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || 
                "some error occured while creating the order"
            })
        });
    
    
        
    //slack.sendMessage("agungw","tik","Nama : "+order.nama +" | Harga (Rp) : "+order.harga);
};

//put upload image
exports.uploadImageOrder = async (req, res) => {
    const id = req.params.id;
    const name = req.params.name;

    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field 
            let foto_struk = req.files.foto_struk;
            var renameFotoStruk = + id
                + "-"
                + name
                + (foto_struk.name).substring((foto_struk.name).indexOf("."))

            Order.update({
                foto_struk: renameFotoStruk

            }, {
                where: { id: id }
            }).then((result) => {
                if (result == 1) {
                    foto_struk.mv('./uploads/struk/' + renameFotoStruk);
                    //send response
                    res.send({
                        status: true,
                        message: 
                        'Foto Struk File is uploaded',
                        data: {
                            name: foto_struk.name,
                            rename : renameFotoStruk,
                            mimetype: foto_struk.mimetype,
                            size: foto_struk.size
                        }
                    });
                } else {
                    res.send({
                        message: 
                        `Cannot update Order with id = ${id}`
                    })
                }
            }).catch((err) => {
                res.status(500).send({
                    message: `Error updating Order id = ${id}`
                })
            })

        }
    } catch (err) {
        res.status(500).send(err);
    }
};

//Retrieve All
exports.findAll = (req, res) => {
    const nama = req.query.nama;
    let condition = 
    nama ? { nama: { [Op.like]: `%${nama}%` } } : null;
    Order.findAll({ where: condition })
    .then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occured while find Order"
        })
    });
};

//PUT Data Order
exports.updateOrder = async (req, res) => {
    const id = req.params.id;

    try {
        if (!req.params) {
            res.send({
                status: false,
                message: 'No Id selected'
            });
        } else {
            //get data that have been submitted
            var nama        = req.param('nama');
            var tanggal     = req.param('tanggal');
            var harga       = req.param('harga');
            var foto_struk  = req.param('foto_struk');  
            var id_user     = req.param('id_user'); 

            Order.update({
                nama: nama,
                tanggal: tanggal,
                harga: harga,
                foto_struk: foto_struk,
                id_user: id_user
            }, {
                where: { id: id }
            }).then((result) => {
                if (result == 1) {
                    res.send({
                        status: true,
                        message: 
                        'Sukses!! Data Order berhasil di Update.'
                    });
                } else {
                    res.send({
                        message: 
                        `Cannot update Order with id = ${id}`
                    })
                }
            }).catch((err) => {
                res.status(500).send({
                    message: `Error updating Order id = ${id}`
                })
            })

        }
    } catch (err) {
        res.status(500).send(err);
    }
};


//Edit Email
exports.sendEmail = (req,res,next) => {

    module.exports = async nodemailer =>{

    //let configEmail, transporter, emailTarget, mail;
  
    console.log(req.body)
  
    var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth    : {
                user: 'bluut022@gmail.com',
                pass: 'UptT1kUT'
            }
    }); 

    var mailOptions = {
        from: transporter.auth.email,//replace with your email
        to: 'agoenkwe@gmail.com',//replace with your email
        subject: `Contact name: ${req.body.name}`,
        html:`<h1>Contact details</h1>
            <h2> name:${req.body.name} </h2><br>
            <h2> email:${req.body.email} </h2><br>
            <h2> phonenumber:${req.body.phonenumber} </h2><br>
            <h2> message:${req.body.message} </h2><br>`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        res.send('error') // if error occurs send error as response to client
        } else {
        console.log('Email sent: ' + info.response);
        res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
        }
    });
    }
};
