const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./models'); // Adjust the path as needed
const seedAdmin = require('./initialize'); // Adjust the path as needed
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the EcoUtopia API" });
});

app.use('/uploads', express.static('uploads'));

// Handle Posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await db.Post.findAll(); // Ensure db.Post is properly initialized
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.post('/posts/:id/report', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Handle reporting logic
        res.status(200).json(post);
    } catch (error) {
        console.error('Error reporting post:', error);
        res.status(500).json({ error: 'Failed to report post' });
    }
});

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.Post.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Routes
const courseRoute = require('./routes/course');
const userRoute = require('./routes/user');
const ordersRoute = require('./routes/orders');


app.use("/courses", courseRoute);
app.use('/user', userRoute);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use("/orders", ordersRoute);

db.sequelize.sync({ alter: true }).then(async () => {
    await seedAdmin(); // Seed the admin user
    let port = process.env.APP_PORT;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});

