var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var observationSchema    = new Schema({
    patientId : {type: String,
            validate: {
                validator: function(v){
                    return Boolean(v);
                },   
                message: "ID required."
            }
           },
    date : {type : Date,
            default : Date.now
    },
    practitionerId : String,
    type : {
        type : String,
        lowercase : true,
        enum : ["temperature", "blood pressure", "heart rate", "oxygen", "cholestoral" ]
    },
    value : String,
    unit : String
});

module.exports = mongoose.model('Observations', observationSchema); 
