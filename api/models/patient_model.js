const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required: true},
    dob: {type: Date, required: true},
    insurance: {type:String, required: true},
    age: {type: Number, required: true}, 
    appointment: {type: Date, required: true},
});

module.exports = mongoose.model('Patient', patientSchema);