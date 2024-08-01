const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./models');
const seedAdmin = require('./initialize'); // Adjust the path as needed
const fileparser = require('./middleware/fileparser');
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

app.post("/upload", (req, res) => {
    //console.time("Upload Time");
    fileparser(req)
        .then((result) => {
            //console.timeEnd("Upload Time - Success");
            res.status(200).json({ message: "Success", result });
            console.log("WHY ARE YOU NOT LOGGING AAAA");
        })
        .catch((error) => {
            //console.timeEnd("Upload Time - Error");
            res.status(400).json({ message: "Error uploading file: " + error });
        });
});

app.use('/uploads', express.static('uploads'));

// Routes
const courseRoute = require('./routes/course');
const userRoute = require('./routes/user');
const ordersRoute = require('./routes/orders');
const paymentRoute = require('./routes/payment');
const postsRoute = require('./routes/post');

app.use("/courses", courseRoute);
app.use('/user', userRoute);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use("/orders", ordersRoute); 
app.use("/payment", paymentRoute);
app.use("/posts", postsRoute);

db.sequelize.sync({ alter: true }).then(async () => {
    await seedAdmin(); // Seed the admin user
    let port = process.env.APP_PORT;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});
