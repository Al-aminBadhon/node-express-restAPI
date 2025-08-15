require('dotenv').config();
const mongoose = require('mongoose');
const conn = require('./helper/connectionStrings')
const port = process.env.SERVER_PORT || 3000;
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
mongoose.connect(conn);

app.use('/api', userRoute);
app.use('/', authRoute);

app.listen(port, ()=> {
    console.log(`server listening on ${port} .....`)
})



