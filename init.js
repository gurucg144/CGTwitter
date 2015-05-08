/*
 * Node program to fetch tweets nodejs for past one week.
 * How to run the program
 * Option 1 - node init.js 1 : 'To run for the first time or to perform clean run
 * Option 2 - node init.js 2 : To refresh tweets for subsequent runs.
 */

//TODO - Index on id field to be created to avoid duplicates. 
//       Currentlty to be done manually in mongo shell using
//       db.tweets.createIndex ({id: 1}, {unique: true})


var twit = require('twitter');
var mongodb = require('mongodb');

//Read command line argument
var mode = process.argv.slice(2)[0];

if (mode == null) {
	mode = 1;
}else if (mode != 1 && mode != 2) {
	console.log ('Usage :  init <options>');
	console.log ('<options> :  1 (initial), 2 (refresh)');
	process.exit(1);
}

if (mode == 1) {
	console.log ('Initial run');
}else {
	console.log ('Refresh');
}

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
	collection.remove();
	console.log ('Fetching Tweets');
	fetchTweets ({ q: '@nodejs', count: 100});
}
//Callback function to handle refresh.
function fetchTweetOnce (p) {
	client.get('search/tweets', p, function (error, tweets, response) {
		collection.insert (tweets.statuses, function (error, result) {
			console.log ('Refresh complete');
			globaldb.close ();
		});
	});
}

function handleFindOne (error, doc) {
	var since_id = doc.id;
	
	 var p2 = {q: '@nodejs', since_id: since_id, count: 100};
	 fetchTweetOnce (p2);
}
function handleMongoConnectRefresh (err, db) {
	globaldb = db;
	collection = db.collection('tweets');
	console.log ('Fetching Tweets');
	var options = { "sort": [['id',-1]] };
	collection.findOne ( {}, options, handleFindOne);
	
	fetchTweetOnce ({ q: '@nodejs', count: 100});
}
//connect to db before fetching Tweets.TODO - investiage if async moduel can be used.

if (mode ==1) {
	MongoClient.connect(url, handleMongoConnect);
}else if (mode == 2){
	MongoClient.connect(url, handleMongoConnectRefresh);
}