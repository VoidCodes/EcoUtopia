// routes/rewards.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const { Rewards } = require('../models'); // Adjust path if necessary

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Helper function to upload file to S3
const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `rewards/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  return s3.upload(params).promise();
};

// Create a new reward
router.post('/', upload.single('reward_image'), async (req, res) => {
  try {
    const { reward_name, reward_description, reward_points, reward_expiry_date } = req.body;
    let reward_image_url = null;

    if (req.file) {
      const result = await uploadToS3(req.file);
      reward_image_url = result.Location; // URL of the uploaded image
    }

    const reward = await Rewards.create({
      reward_name,
      reward_description,
      reward_points,
      reward_expiry_date,
      reward_image: reward_image_url,
    });

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rewards
router.get('/', async (req, res) => {
  try {
    const rewards = await Rewards.findAll();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific reward by ID
router.get('/:id', async (req, res) => {
  try {
    const reward = await Rewards.findByPk(req.params.id);
    if (reward) {
      res.json(reward);
    } else {
      res.status(404).json({ message: 'Reward not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific reward
router.put('/:id', upload.single('reward_image'), async (req, res) => {
  try {
    const { reward_name, reward_description, reward_points, reward_expiry_date } = req.body;
    const reward = await Rewards.findByPk(req.params.id);

    if (reward) {
      let reward_image_url = reward.reward_image;

      if (req.file) {
        const result = await uploadToS3(req.file);
        reward_image_url = result.Location;
      }

      await reward.update({
        reward_name,
        reward_description,
        reward_points,
        reward_expiry_date,
        reward_image: reward_image_url,
      });

      res.json(reward);
    } else {
      res.status(404).json({ message: 'Reward not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific reward
router.delete('/:id', async (req, res) => {
  try {
    const reward = await Rewards.findByPk(req.params.id);

    if (reward) {
      await reward.destroy();
      res.json({ message: 'Reward deleted' });
    } else {
      res.status(404).json({ message: 'Reward not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
