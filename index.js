const express = require('express');
const app = express();
const PORT = process.env.PORT || 4050;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

app.get("/", (req, res) => {
    res.send(`Its working!`)
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));

const authRoute = require("./routes/auth/auth");

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});