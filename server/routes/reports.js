const express = require('express');
const router = express.Router();
const { Feedback } = require('../models');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { userEmail, question1, question2, longAnswer, problemsEncountered } = req.body;
    const question1Value = parseFloat(question1);
    const question2Value = parseFloat(question2);

    if (question1Value < 0 || question1Value > 10 || (question1Value * 2) % 1 !== 0) {
      return res.status(400).json({ error: 'Question 1 must be between 0 and 10, in increments of 0.5' });
    }
    if (question2Value < 0 || question2Value > 10 || (question2Value * 2) % 1 !== 0) {
      return res.status(400).json({ error: 'Question 2 must be between 0 and 10, in increments of 0.5' });
    }

    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;
    const feedback = await Feedback.create({ userEmail, question1: question1Value, question2: question2Value, longAnswer, problemsEncountered, screenshot });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    feedback.status = status;
    await feedback.save();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
