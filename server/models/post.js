// post.model.js
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id', // Ensure this matches the actual field name in the database
            references: {
                model: 'users', // Adjust based on the actual table name in your database
                key: 'user_id' // Adjust based on the actual column name in your database
            }
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
        tableName: 'posts',
        timestamps: true, // Adjust based on your requirements
        createdAt: 'createdAt', // Ensure these match the actual column names in your database
        updatedAt: 'updatedAt'
    });

    Post.associate = function(models) {
        Post.belongsTo(models.User, { // Adjust based on the actual model name in your database
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Post;
};

