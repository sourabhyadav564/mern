const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env' });

require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());

// we link the router files to make our route
app.use(require('./router/auth'));

const PORT = process.env.PORT;

//middleware
const middleware = (req, res, next) => {
    console.log('middleware');
    next();
};


app.get('/', (req, res) => {
    res.send(`Hello World!`);
});
app.get('/about', middleware, (req, res) => {
    res.send(`Hello World!`);
});
app.get('/contact', (req, res) => {
    // res.cookie('contact', "middle");
    res.send(`Hello World!`);
});
app.get('/signin', (req, res) => {
    res.send(`Hello World!`);
});
app.get('/signup', (req, res) => {
    res.send(`Hello World!`);
});

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
});