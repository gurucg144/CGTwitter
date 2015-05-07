/*
 * Aggregates twitter data by day_of_week and hour_of_day 
 * and inserts to mongodb
 */

var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/twitter';

MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log('Error connecting to db');
		return;
	}
	var collection = db.collection('tweets');
	var daycollection = db.collection('day_aggregate');
	var hourcollection = db.collection('hour_aggregate');

	//clear collection for fresh aggregate values. 
	daycollection.remove();
	hourcollection.remove();

	//Day of the week key.
	var keyfDay = function(doc) {
		var dt = new Date(doc.created_at.replace('+0000', ''));
		return {
			day_of_week : dt.getDay()
		};
	};

	//Perform day_of_week grouping
	collection.group(keyfDay, {}, {
		"count" : 0
	}, function(obj, prev) {
		prev.count++
	}, true, function(err, results) {
		//Replace numeric value with day of the week.
		//var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		//results.day_of_week = weekdays[results.day_of_week];
		console.log(results);
		daycollection.insert(results);
	});
	
	//Hour of day Key
	var keyfHour = function(doc) {
		var dt = new Date(doc.created_at.replace('+0000', ''));
		return {
			hour_of_day : dt.getHours()
		};
	};

	collection.group(keyfHour, {}, {
		"count" : 0
	}, function(obj, prev) {
		prev.count++
	}, true, function(err, results) {
		console.log(results);
		hourcollection.insert(results);
	});
	//Need to add db.close ();
});