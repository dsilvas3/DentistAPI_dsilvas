const express = require('express');
//express is our middleware
const app = express();
const morgan = require('morgan'); //using morgan to call the next function
const bodyParser = require('body-parser');//parsing middleware
const mongoose = require('mongoose');

app.use(morgan('dev'));//using morgan as a HTTP request Logger middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//add additional headers 
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Acceppt,Authorization");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();

});

//Show where my application folder is
app.use(express.static(__dirname));
console.log(" This is the directoru listed in __dirname " + __dirname);
app.use('/styles', express.static(__dirname));
app.use('/images', express.static(__dirname + '/images'));
app.use('/scripts', express.static(__dirname + '/scripts'));

//calling patients.js
const patientsRoutes = require('./api/routes/patients');
const appointmentsRoutes = require('./api/routes/appointments');
const dentistRoutes = require('./api/routes/dentist');

mongoose.connect('mongodb+srv://dsilvas:' + process.env.password + '@cluster0.zfeb7.mongodb.net/dentist?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
//These are routes that will handle request
//use pateintsRoutes when anything with /patient is called
app.use('/patients', patientsRoutes);
//use appointmentsRoutes when anything with /appointments is called
app.use('/appointments', appointmentsRoutes);
//use dentistRoutes when anything with /dentist is called
app.use('/dentist', dentistRoutes);

//Sidenote: this is where you would router them to an error page
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});
//calling the next error object
//500 error on the server side
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;