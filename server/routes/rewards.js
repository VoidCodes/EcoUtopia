const express = require("express");
const yup = require("yup");
const { Rewards, Sequelize } = require("../models");
const router = express.Router();

router.post("/createReward", async (req, res) => {
    const schema = yup.object().shape({
        reward_name: yup.string().required("Reward name is required"),
        reward_description: yup.string().required("Reward description is required"),
        reward_points: yup.number()
        .required("Points is required")
        .integer("Points must be a whole number")
        .typeError("Points must be a number")
        .min(1, "Points must be at least 1"),
        reward_expiry_date: yup
        .date()
        .required("Reward expiry date is required")
        .min(new Date(), "Reward expiry date cannot be in the past") // Ensure the date is not in the past
        .typeError("Invalid date format. Please use YYYY-MM-DD."),
    });
    try {
        const {
            reward_name,
            reward_description,
            reward_points,
            reward_expiry_date,
        } = await schema.validate(req.body, { abortEarly: false });
        const reward = await Rewards.create({
            reward_name,
            reward_description,
            reward_points,
            reward_expiry_date,
        });
        res.status(201).json(reward);
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
          return res.status(400).json({ error: error.errors });
        }
        res.status(400).json({ error: error.errors });
    }
});

router.get("/getRewards", async (req, res) => {
    try {
        const rewards = await Rewards.findAll();
        res.json(rewards);
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
});

router.get("/getReward/:id", async (req, res) => {
    try {
        const reward = await Rewards.findByPk(req.params.id);
        if (!reward) {
            return res.status(404).json({ error: "Reward not found" });
        }
        res.json(reward);
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
})

router.put("/updateReward/:id", async (req, res) => {
    const schema = yup.object().shape({
        reward_name: yup.string(),
        reward_description: yup.string(),
        reward_points: yup.number()
        .integer("Points must be a whole number")
        .typeError("Points must be a number")
        .min(1, "Points must be at least 1"),
        reward_expiry_date: yup
        .date()
        .min(new Date(), "Reward expiry date cannot be in the past") // Ensure the date is not in the past
        .typeError("Invalid date format. Please use YYYY-MM-DD."),
    });
    try {
        const reward = await Rewards.findByPk(req.params.id);
        if (!reward) {
            return res.status(404).json({ error: "Reward not found" });
        }
        const {
            reward_name,
            reward_description,
            reward_points,
            reward_expiry_date,
        } = await schema.validate(req.body, { abortEarly: false });
        await reward.update({
            reward_name,
            reward_description,
            reward_points,
            reward_expiry_date,
        });
        res.json(reward);
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
          return res.status(400).json({ error: error.errors });
        }
        res.status(400).json({ error: error.errors });
    }
});

router.delete("/deleteReward/:id", async (req, res) => {
    try {
        const reward = await Rewards.findByPk(req.params.id);
        if (!reward) {
            return res.status(404).json({ error: "Reward not found" });
        }
        await reward.destroy();
        res.json({ message: "Reward deleted" });
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
});

module.exports = router;