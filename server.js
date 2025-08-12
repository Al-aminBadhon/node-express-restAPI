require('dotenv').config();
const mongoose = require('mongoose');
const conn = require('./helper/connectionStrings')
const port = process.env.SERVER_PORT || 3000;
const userRoute = require('./routes/userRoute');
const express = require('express');
const app = express();
mongoose.connect(conn);

app.use('/api', userRoute);

app.listen(port, ()=> {
    console.log(`server listening on ${port} .....`)
})



