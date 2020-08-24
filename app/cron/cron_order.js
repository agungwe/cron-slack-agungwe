require('dotenv').config()
const db = require("../models/index")
const User = db.users
const Order = db.orders
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models/index');
const slack = require("../slack/it.slack");

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
                                    subject: 'Total Transaksi Order',
                                    html: `Berikut kami kirimkan total transaksi Anda pada:
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