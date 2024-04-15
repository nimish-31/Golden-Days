const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser'); 
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/GoldenDays')
    .then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch((error) => {
        console.log(error);
    });

const studDataSchema = new mongoose.Schema({
    studname: String,
    parentname: String,
    email: String,
    phone: String,
    grade: String,
    year_of_passing: String,
    pschool: String,
    referral: String
});

const StudData = mongoose.model('StudData', studDataSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public2'))); // Serve static files from 'public2' directory

app.post('/submit', async (req, res) => {
    try {
        const newData = new StudData({
            studname: req.body.studname,
            parentname: req.body.parentname,
            email: req.body.email,
            phone: req.body.phone,
            grade: req.body.grade,
            year_of_passing: req.body.year_of_passing,
            pschool: req.body.pschool,
            referral: req.body.referral
        });

        await newData.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/data', async (req, res) => {
    try {
        const data = await StudData.find({});
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve index.html when admissions page is accessed
app.get('/admissions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public2', 'admission.html'));
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        server.close();
    });
});
