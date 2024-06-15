module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tags: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resident_id: {
            //call from resident table as foreign key
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reports: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        tableName: 'Posts',
    });

    Post.associate = function (models) {
        Post.belongsTo(models.Resident, { foreignKey: 'resident_id' });
    };

    Post.associate = function (models) {
        Post.hasMany(models.Comment, { foreignKey: 'post_id' });
    }

    return Post;
};