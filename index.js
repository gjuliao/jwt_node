const express = require('express');
const app = express();
const PORT = process.env.PORT || 4050;

app.get("/", (req, res) => {
    res.send(`Its working!`)
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));