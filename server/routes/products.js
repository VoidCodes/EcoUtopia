const express = require("express");
const yup = require("yup");
const { Product, Sequelize } = require("../models");
const router = express.Router();

router.post("/createProduct", async (req, res) => {
    const schema = yup.object().shape({
        product_name: yup.string().required("Product name is required"),
        product_description: yup.string().required("Product description is required"),
        product_price: yup.number().required("Price is required"),
        product_category: yup
        .string()
        .required("Product category is required")
        .oneOf(
            ["Electronics", "Clothing", "Books", "Food"],
            'Product category must be either "Electronics", "Clothing", "Books", or "Food"'
        ), // "Electronics", "Clothing", "Books", or "Food"
        product_quantity: yup
        .number()
        .required("Product quantity is required")
        .integer("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1"),
        product_image: yup.string().required("Product image is required"),
    });
    
    try {
        const {
        product_name,
        product_description,
        product_price,
        product_category,
        product_quantity,
        product_image,
        } = await schema.validate(req.body);
    
        const product = await Product.create({
        product_name,
        product_description,
        product_price,
        product_category,
        product_quantity,
        product_image,
        });
    
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.errors.join(", ") });
    }
    });

