var mongodb = require('mongodb');
var express = require('express');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/twitter';

var app = express();

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
	next();
});

router.get('/', function(req, res) {
	res.json({
		message : 'Tweet aggregate interface'
	});
});

router.route('/tweets/aggregate').get(function(req, res) {

	
	var aggType;
	var sortType;
	
	var query = req.param('type');
	
	if (query == 'daily') {
		aggType = 'day_aggregate'
		sortType = 'day_of_week';
	} else if (query == 'hourly') {
		aggType = 'hour_aggregate';
		sortType = 'hour_of_day';
	} else {
		res.status(404).send ('Not found');
		return;
	}
	
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Error in connecting to database:', err);
		} else {
			var collection = db.collection(aggType);
			//not able to use variable sortType.
			collection.find({},{_id:0}).sort({day_of_week:1, hour_of_day:1}).toArray(function(err, result) {
				if (err)
					res.send(err);
				else
					res.send(result);
			});
		}
	});
});

app.use('/api', router);

app.listen(port);

console.log('Server running on port  ' + port);
