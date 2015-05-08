/*
 * Node program to fetch tweets nodejs for past one week.
 */

var twit = require('twitter');
var mongodb = require('mongodb');

//Create Twitter Client with OAuth parameters.TODO- to be parameterized.
var client = new twit({
	consumer_key : 'yKwnNuyifMlgpTSJDAQoNOA7L',
	consumer_secret : 'ENTSVsjo3K00GN3iJcW7i7uSADhaDXPHodzwCy9AJljiwo2Uxv',
	access_token_key : '3183264714-E0FL691dsN37lX2uQUZMLbKdMyRKgyqJHD5x69Z',
	access_token_secret : 'lyjP2ru9CwzxKzNEKV0sZVRp2M3roS2V4EAs6QyNz2d0c'
});

//Define MongoClient.
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/twitter';

//Global db and connection objects. TODO - enhance logic not to use.
var globaldb;
var collection;

//Tweeter max_id to fetch, this value will decrease after each round by fetch by fetch count.
var max_id;


//mindate - Is current date - 7 days. TODO - to be parameterized. 
var mindate;
var bottomdate = new Date();
bottomdate.setDate(bottomdate.getDate()-7);

//callback function for database insert, also handles logic to fetch additional tweets.
function handleInsert (error, result) {
	
	var dt1 = new Date(mindate.replace('+0000', ''));

	if (dt1 >= bottomdate) {				
		p1 = {q : '@nodejs', max_id : max_id, count : 100 };
		fetchTweets (p1);
	}else {
		globaldb.close ();
		console.log ('Fetch complete');
	}
}

//Callback function to handle tweets, inserts data into db.
function handleTweetFetch (error, tweets, response) {

	max_id = tweets.statuses[tweets.statuses.length-1].id;
	mindate = tweets.statuses[tweets.statuses.length-1].created_at;
	collection.insert (tweets.statuses, handleInsert ());	
}
//Callback function to handle tweets.
function fetchTweets (p) {
	client.get('search/tweets', p, handleTweetFetch);
}

//Callback function to connect to mongoDB
function handleMongoConnect (err, db) {
	globaldb = db;
	collection = db.collection('tweets');
	console.log ('Fetching Tweets');
	fetchTweets ({ q: '@nodejs', count: 100});
}
//connect to db before fetching Tweets.TODO - investiage if async moduel can be used.
MongoClient.connect(url, handleMongoConnect);
