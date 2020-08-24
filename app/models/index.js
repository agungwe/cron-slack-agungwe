const dbConfig = require("../config/db.config")
const Sequelize= require("sequelize")

const sequelize =
new  Sequelize(
        dbConfig.DB,
        dbConfig.USER,
        dbConfig.PASSWORD,{
            host: dbConfig.HOST,
            dialect: dbConfig.dialect,
            operatorAliases: false,
            pool : {
                max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.min,
                idle:dbConfig.pool.min
            }
        }
    )

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// create table
db.orders = require("./order.model")(sequelize,Sequelize)
db.users = require("./user.model")(sequelize,Sequelize)

module.exports = db