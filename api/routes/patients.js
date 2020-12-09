//requiring to use express and mongoose
const express = require('express');
const mongoose = require('mongoose');
const { resource } = require('../../app');
const router = express.Router();
//added models from Patient
const Patient = require('../models/patient_model');

// will return for anything for /patients/
//return all the patients with the GET method
router.get('/', (req, res, next) => {
    Patient.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return{
                        patient: doc,
                        request: {
                            type: "GET", 
                            url: "http:localhost:8000/patients/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
            //console.log(response);
            // if (docs.length > 0 ){
            //     res.status(200).json(docs);
            // }else{
            //     res.status(404).json({
            //         message: 'No patients were found'
            //     });
            // }
            
        })
        .catch(err => {
            console.status(500).json({
                error: err
            });
                });
});

//201 request is returned since a new member is being 'created'/added
//POST for patient
router.post('/', (req, res, next) => {
    //creating a Patient constructor
    const patient = new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        dob: req.body.dob,
        insurance: req.body.insurance,
        age: req.body.age,
        appointment: req.body.appointment

    });
    patient
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({//this is what will be return, the information that was input
                message: 'Patient added to the list. Welcome to All Smiles',
                newPatient: {
                    name:result.name,
                    dob: result.dob,
                    insurance: result.insurance,
                    age: result.age,
                    appointment: result.appointment,
                    _id: result._id
                },
                request: {
                    type: "GET", 
                    url: "http:localhost:8000/patients/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
     
        });
});

//GET with patientID
//will get the patient with ID
router.get('/:patientID', (req, res, next) => {
    const id = req.params.patientID;
    Patient.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
        console.log("From DB: ",doc);
        res.status(200).json({
            patient: doc,
            request: {
                type: 'GET',
                description: "GET all patients",
                url: 'http://localhost:8000/patients'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

//Will update the patient information
router.patch('/:patientID', (req, res, next) => {
   const id= req.params.patientID;
   const updateOps = {};
   for (const ops of req.body){
       updateOps[ops.propName] = ops.value;
   };
   Patient.updateOne({ _id: id}, {$set: updateOps})
        .exec()
        .then( result => {
            console.log(result);//use it to test if it works
            res.status(200).json({
                message: "Patient Updated",
                request: {
                    type: "GET",
                    url: 'http://localhost:8000/patients/' + id
                }
            });
        
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//will remove the patient
router.delete('/:patientID', (req, res, next) => {
    const id = req.params.patientID;
    Patient.deleteOne({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Patient has been removed',
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/patients/',
                    body: { name: 'String', dob: 'Date', insurance: 'String', age: 'Number', appointment: 'Date'}
                    

                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
