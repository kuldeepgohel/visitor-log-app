const express = require('express');
const cors = require('cors');

const qrRoutes = require('./routes/qrRoutes');
const checkinRoutes = require('./routes/checkinRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api',qrRoutes);
app.use('/api',checkinRoutes);

app.get('/',(req,res)=> {
    res.send("visitor log API is running")
})

module.exports = app;