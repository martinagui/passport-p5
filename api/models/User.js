const {Sequelize, DataTypes, Model} = require("sequelize");
const db = require('./db')
const bcrypt = require('bcrypt')

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
    }, 
    salt: {
        type: DataTypes.STRING,
    } 
}, {
    sequelize: db,
    modelName: 'user'
})

User.beforeCreate((user)=> {

    return bcrypt.genSalt(10)
    .then(salt=> {
        user.salt = salt;
        return bcrypt.hash(user.password, salt)
    })
    .then(hash=> {
        user.password = hash;
    })
    .catch(err => {console.log(err)})
})



module.exports = User;