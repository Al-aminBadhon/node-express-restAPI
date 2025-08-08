require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/rest-auth-apis');
const express = require('express');
const app = express();

const port = process.env.SERVER_PORT || 3000;

const userRoute = require('./routes/userRoute');

app.use('/api', userRoute);

app.listen(port, ()=> {
    console.log(`server listening on ${port} .....`)
})

app.get('/', (req, res) => {
    res.send('Hello world!!!!!!!!!!!!!!');
})

