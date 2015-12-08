var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

var personSchema    = new Schema({
    name : {type: String,
            validate: {
                validator: function(v){
                    return Boolean(v);
                },   
                message: "Name required."
            }
           },
    type : {type: String,
            lowercase : true,
            enum : ['practitioner', 'patient']}
});

module.exports = mongoose.model('Person', personSchema); 