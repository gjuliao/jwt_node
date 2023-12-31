const express = require('express');
const app = express();
const PORT = process.env.PORT || 4050;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();

// import routes
const authRoute = require("./routes/auth/auth");
const authDashboard = require('./routes/auth/authDashboard');


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (err) => { 
    console.error('connection error:', err);
    process.exit(1);
});

db.once('open', () => {
    console.log('Connected to the database');
});

//middleware -> disabling cors and used for json output
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send(`Its working!`)
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));

//routes
app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);