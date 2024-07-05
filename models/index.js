"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// Create sequelize instance using config from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Adjust logging based on environment (e.g., console.log for development)
    timezone: "+08:00", // Adjust timezone based on your server's timezone
  }
);

// Read all model files from current directory and load them into Sequelize
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations if defined in models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Example of adding models to db object
db.Post = require('./Post')(sequelize, Sequelize);
db.Resident = require('./resident')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
// Add more models as needed

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
