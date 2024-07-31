const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./models');
const seedAdmin = require('./initialize'); // Adjust the path as needed
require('dotenv').config();

const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');

// Initialize the AWS Translate client
const translateClient = new TranslateClient({ region: 'us-east-1' }); // Replace with your region

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
const courseRoute = require('./routes/course');
const userRoute = require('./routes/user');
// const rewardsRoute = require('./routes/rewards'); // Remove this line
const ordersRoute = require('./routes/orders');
const postsRoute = require('./routes/post');

// Translation logic
const translateText = async (text, targetLanguage) => {
    if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be null or empty.');
    }

    try {
        const command = new TranslateTextCommand({
            Text: text,
            SourceLanguageCode: 'en', // or detect the source language
            TargetLanguageCode: targetLanguage,
        });

        const response = await translateClient.send(command);
        return response.TranslatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
};

// Translation route handler
const handleTranslation = async (req, res) => {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Text and targetLanguage are required.' });
    }

    try {
        const translatedText = await translateText(text, targetLanguage);
        res.json({ translatedText });
    } catch (error) {
        res.status(500).json({ error: 'Error translating text.' });
    }
};

// Define the translate route
app.post('/api/translate', handleTranslation);

app.use("/courses", courseRoute);
app.use('/user', userRoute);
// app.use('/rewards', rewardsRoute); // Remove this line
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use("/orders", ordersRoute);    
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
