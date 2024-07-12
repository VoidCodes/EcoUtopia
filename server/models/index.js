"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const db = {};

console.log("Before sequelize");
// Log environment variables
console.log('Environment variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT
})

// Create sequelize instance using config
let sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: "+08:00"
  }
);

// Log the start of the connection attempt
console.log('Attempting to connect to the database...');
const start = Date.now();

sequelize.authenticate()
  .then(() => {
    const duration = Date.now() - start;
    console.log(`Connection has been established successfully. Duration: ${duration} ms`);
    console.log('Database connection successful');
  })
  .catch(err => {
    const duration = Date.now() - start;
    console.error(`Unable to connect to the database. Duration: ${duration} ms, Error: ${err}`);
  });


fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
