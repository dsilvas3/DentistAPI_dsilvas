//requiring to use express
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Dentist = require('../models/dentist_model');



// This will be called when /dentist/ is pulled
//This is to get the dentist avaiable in the office.
router.get('/', (req, res, next) => {
    Dentist.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length > 0 ){
                res.status(200).json(docs);
            }else{
                res.status(404).json({
                    message: 'No dentist were found'
                });
            }
        })
        .catch(err => {
            console.status(500).json({
                error: err
            });
                });
   
});


router.get('/:dentistID', (req, res, next) => {
    const id = req.params.dentistID;
    Dentist.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        console.log("From DB: ",doc);
        res.status(200).json({
            dentist: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:8000/dentist'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});


//201 request is returned since a new member is being 'created'/added
router.post('/', (req, res, next) => {
    //creating a Patient constructor
    const dentist = new Dentist({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        Available: req.body.Available,
        Specialty: req.body.Specialty,
        startYear: req.body.startYear,

    });
    dentist
        .save()
        .then(result => {
            console.log(result)
        })
        .catch(err => console.log(err));
    res.status(201).json({
        message: 'Dentist has been added!',
        newDentist: dentist
    });
});

module.exports = router;