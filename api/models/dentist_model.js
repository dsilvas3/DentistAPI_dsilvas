const mongoose = require('mongoose');

const dentistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required: true},
    Available: {type:Date, required: true},
    Specialty:{type:String, required: true},
    startYear: {type:String, required: true}
});

module.exports = mongoose.model('Dentist', dentistSchema);
