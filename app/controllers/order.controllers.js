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
exports.editMail = (req, res) => {
    const subject = req.params.subject;
    const isi = req.params.isi;

    module.exports = async nodemailer =>{

    let configEmail, transporter, emailTarget, mail;

        configEmail = {
            service : 'gmail',
            auth    : {
                user: 'bluut022@gmail.com',
                pass: 'UptT1kUT'
            }
        }

    transporter = await nodemailer.createTransport(configEmail)
    await sequelize.query("SELECT * from users WHERE id = ':id_user'",{replacements:{ id_user : 1},type: QueryTypes.SELECT})
        .then(async (users)=>{
                    for (const key in users) {
                        if (users.hasOwnProperty(key)) {
                            let month = ''
                            const today      = new Date();
                            const year       = today.getFullYear();
                            const mes        = today.getMonth()+1;
                            if (mes.toString.length == 1){
                                month = '0'+mes
                            }else{
                                month = mes
                            }
                            const day        = today.getDate()-1;
                            const time_start = year+"-"+month+"-"+day;
                            const user = users[key];
                            await  sequelize.query("SELECT firstname, tanggal, SUM(harga) as total_harga FROM orders JOIN users ON users.id = orders.id_user WHERE id_user = :id_user AND tanggal = :tanggal",
                            {
                                replacements: {id_user:user.id,
                                               tanggal:time_start},
                                type: QueryTypes.SELECT
                            }).then((total_harga)=>{
                                 mail = {
                                    to:user.email,
                                    from: configEmail.auth.user,
                                    subject: subject,
                                    html: isi `Berikut kami kirimkan total transaksi Anda pada:
                                            <p>Tanggal: ${total_harga[0].tanggal}</p> 
                                            <p>Sebesar: Rp ${total_harga[0].total_harga}.</p>
                                            
                                            <p>Demikian. Terima kasih</p>`
                                                                                        
                                }
                                transporter.sendMail(mail)
                                slack.sendMessage("Admin","tik","Nama : "+`${total_harga[0].firstname}`+" | Total Belanja (Rp) : "+`${total_harga[0].total_harga}`);
                            })
                       }
                    }
        })
    
    }
}
