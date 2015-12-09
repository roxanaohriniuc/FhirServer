var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var Person      = require('./app/models/person');
var Observation = require('./app/models/observation');
var Fhir        = require('./app/models/mock-fhir')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

//Mongo Connection
mongoose.connect('mongodb://admin:admin@ds053874.mongolab.com:53874/mock_fhir');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// ROUTES FOR OUR API
var router = express.Router(); 

router.use(function(req, res, next) {
    console.log(req.method + " @ " + req.url);
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'Mock Fhir API.' });   
});

router.route('/people')
    .post(function(req, res) {
        var person = new Person();
        person.name = req.body.name;
        person.type = req.body.type;
        person.save(function(err) {
            if(err)
                res.send(err);
        res.json({message:'Person created.'});
        });
})
    .get(function(req, res) {
            Person.find(function(err, people) {
                if(err)
                    res.send(err);
                res.json(people);
            });
});

router.route('/people/:person_id')
    .get(function(req, res){
         Person.findById(req.params.person_id, function(err, person) {
            if(err)
                res.send(err);
            res.json(person);
         });
    })
    .put(function(req, res){
        Person.findById(req.params.person_id, function(err, person){
            if(err)
                res.send(err);
            person.name = req.body.name || person.name;
            person.type = req.body.type || person.practicioner;
            
            person.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: 'Person updated.'});
            });
        });
    })
    .delete(function(req, res){
        Person.remove({
            _id: req.params.person_id
        }, function(err, person){
            if(err)
                res.send(err);
            res.json({mesasge: 'Person deleted.'});
        });
    });

router.route('/practitioners')
    .post(function(req, res) {
        var person = new Person();
        person.name = req.body.name;
        person.type = 'practitioner';
        person.save(function(err) {
            if(err)
                res.send(err);
        res.json({message:'Pratitioner created.'});
        });
})
    .get(function(req, res){ 
        Person.find({'type' : 'practitioner'}, 
        function(err, people) {
            if(err)
                res.send(err);
            res.json(people);
        });
    });

router.route('/patients')
    .post(function(req, res) {
        var person = new Person();
        person.name = req.body.name;
        person.type = 'patient';

        person.save(function(err) {
            if(err)
                res.send(err);
        res.json({message:'Patient created.'});
        });
})
    .get(function(req, res){ 
        Person.find({'type' : 'patient'}, 
        function(err, people) {
            if(err)
                res.send(err);
            res.json(people);
        });
    });

router.route('/patients/:patient_id/observations')
    .get(function(req, res){
        Observation.find({'patientId' : req.params.patient_id},
                        function(err, observations) {
                            if(err)
                                res.send(err);
            res.json(observations);
        })
})

router.route('/observations')
    .post(function(req, res){
          var observation = new Observation();
            observation.patientId = req.body.patientId;
            observation.type = req.body.type;
            observation.practitionerId = req.body.practitionerId;
            observation.value = req.body.value;
            observation.unit = req.body.unit;
            observation.save(function(err){
                if(err)
                    res.send(err);
                res.json({message : 'Observation created.'})
            });
          })
     .get(function(req, res) {
            Observation.find(function(err, people) {
                if(err)
                    res.send(err);
                res.json(people);
            });
    });

router.route('/observations/:observation_id')
    .get(function(req, res){
         Observation.findById(req.params.observation_id, function(err, observation) {
            if(err)
                res.send(err);
            res.json(observation);
         });
    })
    .put(function(req, res){
        Observation.findById(req.params.observation_id, function(err, observation){
            if(err)
                res.send(err);
            obesrvation.practitionerId = req.body.practitionerId;
            observation.value = req.body.value;
            observation.unit = req.body.unit;
            
            observation.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: 'Observation updated.'});
            });
        });
    })
    .delete(function(req, res){
        Observation.remove({
            _id: req.params.observation_id
        }, function(err, observation){
            if(err)
                res.send(err);
            res.json({mesasge: 'Observation deleted.'});
        });
    });

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
