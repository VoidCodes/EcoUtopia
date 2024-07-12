    const express = require('express');
    const router = express.Router();
    const { Post, Resident, User, Sequelize } = require('../models'); // Ensure models are imported correctly
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    const { authenticateToken, authorizeRoles } = require('../middleware/auth');

    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage: storage });

    // Create a new post
    router.post('/create-post', authenticateToken, upload.single('image'), async (req, res) => {
        try {
            const { title, content, tags } = req.body;
            
            // Extract the token from the headers
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }
            
            // Decode the token to extract the user information
            const decoded = jwt.decode(token);
            
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token. No user information found.' });
            }

            // Temporary workaround to get user_id based on role
            let userId = decoded.user_id;
            
            if (!userId && decoded.role) {
                // Example: If the role is RESIDENT, we can attempt to find the user by role and other details.
                // This logic will vary based on your actual application logic.
                const user = await User.findOne({ where: { role: decoded.role } });
                if (user) {
                    userId = user.id;
                }
            }
            
            if (!userId) {
                return res.status(401).json({ message: 'Invalid token. No user ID found.' });
            }
            
            const resident = await Resident.findOne({ where: { user_id: userId } });

            if (!resident) {
                return res.status(404).json({ message: 'Resident not found' });
            }

            const post = await Post.create({
                title,
                content,
                tags,
                resident_id: resident.id,
                residentName: resident.name, // Add the resident's name here
                imageUrl: req.file ? req.file.filename : null,
            });

            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Failed to create post' });
        }
    });


    router.get('/getAllPosts', async (req, res) => {
        try {
            // Fetch all posts with the resident's name
            /*const posts = await Post.findAll({
                include: [{
                    model: Resident,
                    as: 'resident',
                    attributes: ['name']
                }]
            });*/
            const posts = await Post.findAll()
            res.json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ error: 'An error occurred while fetching posts', details: error.message });
        }
    });

    // Get a post by ID
    router.get('/:id', async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [{
                    model: Resident,
                    as: 'resident',
                    attributes: ['name']
                }]
            });

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json(post);
        } catch (error) {
            console.error('Error fetching post:', error);
            res.status(500).json({ error: 'An error occurred while fetching the post' });
        }
    });

    const reportedPosts = {};

    // Report a post
    router.post('/:id/report', authenticateToken, async (req, res) => {
        try {
            const userId = req.user.id;
            const postId = req.params.id;

            if (!reportedPosts[postId]) {
                reportedPosts[postId] = new Set();
            }

            // Check if the user has already reported this post
            if (reportedPosts[postId].has(userId)) {
                return res.status(400).json({ error: 'You have already reported this post' });
            }

            const post = await Post.findByPk(postId);

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            // Add user to the set of users who reported this post
            reportedPosts[postId].add(userId);

            // Increment the report count
            post.reports += 1;
            await post.save();

            res.json({ message: 'Post reported successfully' });
        } catch (error) {
            console.error('Error reporting post:', error);
            res.status(500).json({ error: 'An error occurred while reporting the post' });
        }
    });

    // Delete a post
    router.delete('/:id', authenticateToken, async (req, res) => {
        const postId = req.params.id;
        try {
            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const postImagePath = path.join(uploadDir, post.imageUrl);

            await post.destroy();

            // Check if the file exists before attempting to delete it
            if (fs.existsSync(postImagePath)) {
                fs.unlinkSync(postImagePath);
            }

            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Failed to delete post' });
        }
    });

    module.exports = router;
