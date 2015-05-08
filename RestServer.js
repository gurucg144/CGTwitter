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

router.route('/tweets/:type').get(function(req, res) {

	var aggType;
	if (req.params.type == 'daily') {
		aggType = 'day_aggregate'
	} else if (req.params.type == 'hourly') {
		aggType = 'hour_aggregate';
	}
	console.log("aggType is " + aggType);

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Error in connecting to database:', err);
		} else {
			var collection = db.collection(aggType);

			collection.find().toArray(function(err, result) {
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
