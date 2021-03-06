require('dotenv').config();
const config = require('./config.js');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const users = require('./routes/users.routes');
const items = require('./routes/items.routes');
const reviews = require('./routes/reviews.routes')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static('public'))
app.use(fileUpload());
app.use('/users', users);
app.use('/items', items);
app.use('/reviews', reviews);

mongoose
    .connect(config.mongoURL)
    .then(console.log("Database connected."))
    .catch(err => console.log(err));

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'Connection Error'))

app.listen(config.serverPort, function(){
    console.log(`Server is running on port ${config.serverPort}...`)
})
