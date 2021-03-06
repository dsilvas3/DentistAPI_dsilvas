//requiring to use express and mongoose
const { request } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//calling the models for each of the objects
const Appointment = require('../models/appt_model');
const Patient = require('../models/patient_model');
const Dentist = require('../models/dentist_model')


//GET
// will return for anything for /appointment/
//Will get all the appointments that are being stored in the DB
router.get('/', (req, res, next) => {
    Appointment.find()
        .select('-__v')
        .populate('patientID', '-__v')//will load the patient information with ID
        .populate('dentistID', '-__v')//will load the dentist information with ID
        .exec()
        .then(docs => {
            console.log(docs);//load the docs in the console, this was for testing purposes
            if (docs.length > 0 ){
                res.status(200).json({
                    count: docs.length,//return the number of appointments
                    orders: docs.map(doc => {
                        return {
                            appointment: doc,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/appoinments' + doc._id
                            }
                        }
                    })
                })
            }else{
                res.status(404).json({
                    message: 'No appointments were found' //this 404 did not work for me
                });
            }
        })
        .catch(err => {
            console.status(500).json({
                error: err
            });
                });
    
});
//POST
//201 request is returned since a new appointment is being created is being 'created'/added
router.post('/', (req, res, next) => {
    Patient.findById(req.body.patientID)
        .then(patient => {
            if (!patient){
                return res.status(404).json({//this 404 did not work for me
                    message: 'Patient not found'
                });
            }else {
                const appointment = new Appointment({ //create a new appointment this is all the information that is being requested
                    _id: mongoose.Types.ObjectId(),
                    patientID: req.body.patientID,
                    dentistID: req.body.dentistID,
                    appointmentID: req.body.appointmentID,
                    name: req.body.name,
                    date: req.body.date,
                    time: req.body.time,
                    reason: req.body.reason
                });
                return appointment.save()//save the information input

            }
        })
        .then(result => { // this is what will be returned to the user
            console.log(result)
            res.status(201).json({
                message: 'Appointment has been booked!',
                Details: {
                    _id: result.id,
                    patient: result.patient,
                    dentist: result.dentist,
                    appointmentID: result.appointmentID,
                    name: result.name,
                    date: result.date,
                    time: result.time,
                    reason: result.reason
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/appointments' + result._id
        
        
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
//GET with appointmentID
//find an appointment for 12-26-2020
//Uses an if statement to check if the user has an appt
router.get('/:appointmentID', (req, res, next) => {
    Appointment.findById(req.params.appointmentID)
    .select('-__v')
    .populate('patientID', '-__v')
    .populate('dentistID', '-__v')
    .exec()
    .then(appointment => {
        if (!appointment){
            return res.status(404).json({
                message: ' Appointment not found'
            });
        
        }else {
            res.status(200).json({
                appointment: appointment, 
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/appointments'
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
});

//PATCH with appointmentID
//will be able to update any information using the appt ID
router.patch('/:appointmentID', (req, res, next) => {
    const id= req.params.appointmentID;
   const updateOps = {};
   for (const ops of req.body){
       updateOps[ops.propName] = ops.value;
   };
   Patient.update({ _id: id}, {$set: updateOps})
        .exec()
        .then( result => {
            console.log(result);
            res.status(200).json(result);
        
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
        
});

//DELETE with appointmentID
router.delete('/:appointmentID', (req, res, next) => {
    const id = req.params.appointmentID;
    Appointment.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Appointment has been removed",
                request: {
                    type: "POST",
                    url: 'http://localhost:8000/appointment'
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
