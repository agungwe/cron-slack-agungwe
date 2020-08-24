module.exports = async nodemailer => {

    let configMail, transporter, emailTarget, mail;

    configMail = {
        service: 'gmail',
        auth: {
            user: 'bluut022@gmail.com',
            pass: 'UptT1kUT'
        }
    };

    transporter = await nodemailer.createTransport(configMail);
    emailTarget = 'agoenkwe@gmail.com';
    
    mail = {
        to: emailTarget,
        from: configMail.auth.user,
        subject: 'Pesan Diterima',
        html: 'Pesanan kami diterima. Terima kasih'
    };
    transporter.sendMail(mail);
}