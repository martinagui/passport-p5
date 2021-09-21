require('dotenv').config();
const u = process.env.DBUSER;
const p = process.env.DBPASSWORD;

const {Sequelize} = require('sequelize');

const db = new Sequelize(`postgres://${u}:${p}@localhost:5432/authws`);
module.exports = db;