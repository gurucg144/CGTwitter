/*
 * Aggregates twitter data by day_of_week and hour_of_day 
 * and inserts to mongodb using map reduce aggregation.
 */

var mongodb = require('mongodb');
var events = require('events');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/twitter';

var EventEmitter = events.EventEmitter;

var emitter = new EventEmitter();
var count = 0;
var globaldb;

emitter.on("done", function() {
	count++;
	if (count > 1) {
		globaldb.close();
	}
});

MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log('Error connecting to db');
		return;
	}
	globaldb = db;
	var collection = db.collection('tweets');

	var map = function() {

		var keyfDay = function(doc) {
			var dt = new Date(doc.created_at.replace('+0000', ''));
			var weekday = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
					'Thursday', 'Friday', 'Saturday' ];

			return {
				day_of_week : weekday[dt.getDay()]
			};
		};
		emit(keyfDay(this), this.id);
	};

	var reduce = function(dayofweek, c) {
		return c.length;
	};

	collection.mapReduce(map, reduce, {
		out : {
			replace : 'mr_daily_aggregate'
		}
	}, function(error, collection) {
		console.log("Daily aggregation complete");
		emitter.emit("done");
	});

	var map2 = function() {

		//Hour of day Key

		var keyfHour = function(doc) {
			var dt = new Date(doc.created_at.replace('+0000', ''));
			return {
				hour_of_day : dt.getHours()
			};
		};

		emit(keyfHour(this), this.id);
	};

	var reduce2 = function(hourofday, c) {
		return c.length;
	};

	collection.mapReduce(map2, reduce2, {
		out : {
			replace : 'mr_hourly_aggregate'
		}
	}, function(error, collection) {
		console.log("Hourly aggregation complete");
		emitter.emit("done");
	});
});