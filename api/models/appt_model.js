const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patientID: {type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', required: true},
    dentistID: {type: mongoose.Schema.Types.ObjectId,
    ref: 'Dentist', required: true},
    appointmentID: {type:Number, required: true},
    name: {type:String, required: true},
    date: {type: String, required: true},
    time: {type:String, required: true},
    reason: {type:String, required: true}
});

module.exports = mongoose.model('Appointment', appointmentSchema);


