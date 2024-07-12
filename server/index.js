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

// Routes
const postRouter = require('./routes/post');
const courseRoute = require('./routes/course');
const userRoute = require('./routes/user');
const ordersRoute = require('./routes/orders');

app.use("/posts", postRouter); // Mount the postRouter for /api/posts endpoint
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
    console.error('Unable to start server:', err);
});
