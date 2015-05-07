var twit = require('twitter');
var mongodb = require('mongodb');

var client = new twit({
	consumer_key : 'yKwnNuyifMlgpTSJDAQoNOA7L',
	consumer_secret : 'ENTSVsjo3K00GN3iJcW7i7uSADhaDXPHodzwCy9AJljiwo2Uxv',
	access_token_key : '3183264714-E0FL691dsN37lX2uQUZMLbKdMyRKgyqJHD5x69Z',
	access_token_secret : 'lyjP2ru9CwzxKzNEKV0sZVRp2M3roS2V4EAs6QyNz2d0c'
});

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/twitter';

var params = {
		q : '@nodejs',
		count: 100
};

client.get('search/tweets', params, function(error, tweets, response) {
	
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Error in connecting to database:', err);
		} else {
			var collection = db.collection('tweets');

			collection.insert(tweets.statuses, function(err, result) {

				if (err) {
					console.log(err);
				}else {
					console.log('Tweets fetched');
				}
				db.close();
			});
		}
	});
});
