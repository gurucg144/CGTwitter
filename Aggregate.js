/*
 * Aggregates twitter data by day_of_week and hour_of_day 
 * and inserts to mongodb
 */

var mongodb = require('mongodb');
var events  = require ('events');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/twitter';

var EventEmitter = events.EventEmitter;

var emitter = new EventEmitter();
var count = 0;
var globaldb;

emitter.on("done", function() {
	count++;
	if (count > 1) {
		globaldb.close ();
	}
});


MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log('Error connecting to db');
		return;
	}
	globaldb = db;
	var collection = db.collection('tweets');
	var daycollection = db.collection('day_aggregate');
	var hourcollection = db.collection('hour_aggregate');

	//clear collection for fresh aggregate values. 
	daycollection.remove();
	hourcollection.remove();

	//Day of the week key.
	var keyfDay = function(doc) {
		var dt = new Date(doc.created_at.replace('+0000', ''));
		var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		return {
			day_of_week : weekday[dt.getDay()]
		};
	};

	//Perform day_of_week grouping
	collection.group(keyfDay, {}, {
		"count" : 0
	}, function(obj, prev) {
		prev.count++		
	}, true, function(err, results) {
		daycollection.insert(results, function (err, records) {
			console.log ('Daily aggregation complete');
			emitter.emit ("done");
		});
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
		hourcollection.insert(results, function (err, records) {
			console.log ('Hourly aggregation complete');
			emitter.emit ("done");
		});
	});
});