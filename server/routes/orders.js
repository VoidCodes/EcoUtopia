const express = require('express');
const router = express.Router();
const { Orders, Course } = require('../models');
const { Model } = require('sequelize');


router.post("/", async (req, res) => {
    let data = req.body;
    let result = await Orders.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let list = await Orders.findAll({
        include:
            {
                model: Course,
                attributes: ['course_name', 'course_id', 'course_description', 'course_instructor', 'course_date', 'course_start_time', 'course_end_time']
            },
        order: [['order_id', 'ASC']]
    });
    res.json(list);
});

module.exports = router;