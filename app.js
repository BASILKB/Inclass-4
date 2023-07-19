const express = require('express');
const app = express();
const port = 3000; // You can change this to any desired port number
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));

// Connection URL for MongoDB (replace <db_uri> with your MongoDB connection string)
const url = 'mongodb://localhost:27017';
const dbName = 'Newsletter';

// Serve the static files from the "public" directory
app.use(express.static('public'));

// Define the route to show the sign-up form
app.get('/', (req, res) => {
    res.render('signup.ejs');
});

// Define the route to handle form submissions and store data in MongoDB
app.post('/signup', async (req, res) => {
    const formData = req.body;
    console.log(formData)
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('LocalDB');
        await collection.insertOne(formData);
        console.log('Data inserted into MongoDB');

        res.render('thankyou.ejs', { formData });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        res.status(500).send('Server Error');
    } finally {
        mongoose.connection.close();
    }
});

// Define the route to show the thank you page
app.get('/thankyou', (req, res) => {
    res.send('<h1>Thank You for Signing Up!</h1>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
