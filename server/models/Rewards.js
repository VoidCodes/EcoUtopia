// models/rewards.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection"); // Adjust path if necessary

const Rewards = sequelize.define("Rewards", {
    reward_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reward_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reward_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1
        }
    },
    reward_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString().slice(0, 10)
        }
    },
    reward_image: {  // Newly added column
        type: DataTypes.STRING,
        allowNull: true  // or false, depending on whether it's required
    }
});

module.exports = Rewards;
