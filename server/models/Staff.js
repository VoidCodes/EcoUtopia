module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define("Staff", {
        firstname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        mobilenum: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        aboutMe: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        profilePic: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }, {
        tableName: 'staff'
    });
}
