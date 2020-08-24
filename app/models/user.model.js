module.exports = (squelize,Squelize) => {
    const User = squelize.define("users",{
        firstname: {
            type: Squelize.STRING
        },
        lastname: {
            type: Squelize.STRING
        },
        email: {
            type: Squelize.STRING
        },
        password: {
            type: Squelize.STRING
        },
    })
    return User;
}