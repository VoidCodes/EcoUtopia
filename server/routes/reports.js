const express = require("express");
const yup = require("yup");
const { Reports, Sequelize } = require("../models");
const router = express.Router();

router.post("/createReport", async (req, res) => {
    const schema = yup.object().shape({
        userEmail: yup.string().email().required("Email is required"),
        question1: yup.number()
            .required("Question 1 is required")
            .integer("Question 1 must be a whole number")
            .typeError("Question 1 must be a number")
            .min(1, "Question 1 must be at least 1")
            .max(10, "Question 1 must be at most 10"),
        question2: yup.number()
            .required("Question 2 is required")
            .integer("Question 2 must be a whole number")
            .typeError("Question 2 must be a number")
            .min(1, "Question 2 must be at least 1")
            .max(10, "Question 2 must be at most 10"),
        longAnswer: yup.string().required("Long answer is required"),
        problemsEncountered: yup.string().notRequired(),
        screenshot: yup.string().notRequired(),
    });
    try {
        const {
            userEmail,
            question1,
            question2,
            longAnswer,
            problemsEncountered,
            screenshot,
        } = await schema.validate(req.body, { abortEarly: false });
        const report = await Reports.create({
            userEmail,
            question1,
            question2,
            longAnswer,
            problemsEncountered,
            screenshot,
        });
        res.status(201).json(report);
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(400).json({ error: error.errors });
    }
});
