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

MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log('Error in connecting to database:', err);
	} else {
		var options = { "sort": [['id',-1]] };
		var collection = db.collection('tweets');
		
		collection.findOne ( {}, options, function (err, doc) {
			var since_id = doc.id;
		    
		    var params = {
		    		screen_name : 'nodejs',
		    		trim_user : 'true',
		    		since_id : since_id,
		    		truncated: true,
		    		contributor_details:false,
		    		exclude_replies: true
		    	};

		    client.get('statuses/user_timeline', params, function(error, tweets, response) {
		    	if (!error) {

		    		if (tweets.length == 0 || (tweets.length == 1 && tweets[0].id == since_id)) {
		    			console.log ('No tweets');
		    			db.close ();
		    			return;
		    		}
		    		
					collection.insert(tweets, function(err, result) {
						if (err) {
							console.log(err);
						}
				    	db.close();
					});
		    	}
		    });
		});
	}
});
