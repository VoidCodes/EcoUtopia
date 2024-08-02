module.exports = (sequelize, DataTypes) => {
    const Products = sequelize.define("Products", {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        product_image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_rating: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        product_created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        product_updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        tableName: 'product',
    });

    return Products;
}