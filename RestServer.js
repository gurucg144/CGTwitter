

var mongoose   = require('mongoose');
var express       = require('express');        

var app           = express();


var DayOfTheWeek     = require('./app/model/DayOfTheWeek');
var HourOfTheDay     = require('./app/model/HourOfTheDay');

var port = process.env.PORT || 8080;


var router = express.Router();
mongoose.connect('mongodb://localhost:27017/twitter'); 


router.use(function(req, res, next) {
    next();
});


router.get('/', function(req, res) {
    res.json({ message: 'Tweet aggregate interface' });
});


router.route('/ALL_TWEET_BY_DAY_OF_WEEK').get(function(req, res) {
	DayOfTheWeek.find(function(err, tw) {
            if (err)
                res.send(err);

            res.json(tw);
        });
    });

router.route('/ALL_TWEET_BY_HOUR_OF_DAY').get(function(req, res) {
	HourOfTheDay.find(function(err, tw) {
            if (err)
                res.send(err);

            res.json(tw);
        });
    });

app.use('/api', router);


app.listen(port);

DayOfTheWeek.remove();
new DayOfTheWeek ({day:'MONDAY', count:100}).save();
new DayOfTheWeek ({day:'TUESDAY', count:50}).save();
new DayOfTheWeek ({day:'WEDNESDAY', count:10}).save();
new DayOfTheWeek ({day:'THURSDAY', count:10}).save();
new DayOfTheWeek ({day:'FRIDAY', count:10}).save();
new DayOfTheWeek ({day:'SATURDAY', count:10}).save();
new DayOfTheWeek ({day:'SUNDAY', count:10}).save();


HourOfTheDay.remove();
new HourOfTheDay ({hour:1, count:100}).save();
new HourOfTheDay ({hour:2, count:50}).save();
new HourOfTheDay ({hour:3, count:10}).save();
new HourOfTheDay ({hour:4, count:10}).save();
new HourOfTheDay ({hour:5, count:10}).save();
new HourOfTheDay ({hour:6, count:10}).save();
new HourOfTheDay ({hour:7, count:10}).save();


console.log('Server running on port  ' + port);
