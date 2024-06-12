module.exports = (sequelize, DataTypes) => {
    const Resident = sequelize.define("Resident", {
        resident_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        mobile_num: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        about_me: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        profile_pic: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {
        tableName: 'resident'
    });

    return Resident;
}
