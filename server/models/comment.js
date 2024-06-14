// comment.model.js
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
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
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'postId', // Ensure this matches the actual field name in the database
            references: {
                model: 'posts', // Adjust based on the actual table name in your database
                key: 'id' // Adjust based on the actual column name in your database
            }
        },
        reports: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'comments',
        timestamps: true, // Adjust based on your requirements
        createdAt: 'createdAt', // Ensure these match the actual column names in your database
        updatedAt: 'updatedAt'
    });

    Comment.associate = (models) => {
        // Correct association with User model
        Comment.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        // Correct association with Post model
        Comment.belongsTo(models.Post, {
            foreignKey: 'postId',
            as: 'post'
        });
    };

    return Comment;
};
