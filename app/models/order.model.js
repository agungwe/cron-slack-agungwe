module.exports = (sequelize, Sequelize)=>{
    const Order = sequelize.define("orders", {
        nama:{
            type: Sequelize.STRING
        },
        tanggal:{
            type: Sequelize.STRING
        },
        harga:{
            type: Sequelize.STRING
        },
        foto_struk:{
            type: Sequelize.STRING
        },
        id_user:{
            type: Sequelize.STRING
        },               
    });
    return Order;
}