module.exports = app => {
    const users = require("../controllers/user.controller")

    let router = require("express").Router()

    //create new post
    router.post("/signup",users.signup)
    router.post("/signin",users.signin)

    app.use("/users",router)
}