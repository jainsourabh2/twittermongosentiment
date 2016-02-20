var Twitter = require('twitter');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var config = require('./config');  
var sentiment = require('sentiment');
  
// Use connect method to connect to the Server 
MongoClient.connect(config.connectionstring, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  
  	// Get the documents collection 
	var collection = db.collection('twitterdata');
  
	var client = new Twitter({
		consumer_key: process.env.consumer_key,
		consumer_secret: process.env.consumer_secret,
		access_token_key: process.env.access_token_key,
		access_token_secret: process.env.access_token_secret		
	});
   
	client.stream('statuses/filter', {track: '#SourabhJain'}, function(stream) {

	stream.on('data', function(tweet) {
		console.log(tweet);

		// Insert some documents 
		collection.insert(
		{ttext 		: tweet.text
		,tsource 	: tweet.source
		,tuname 	: tweet.user.name
		,tusname 	: tweet.user.screen_name	
		,tuloc 		: tweet.user.location
		,tuver 		: tweet.user.verified
		,tustatcnt 	: tweet.user.statuses_count
		,tufollcnt 	: tweet.user.followers_count
		,tufricnt 	: tweet.user.friends_count
		,ttimestamp : tweet.timestamp_ms
		,tsenti 	: sentiment(tweet.text)
		}, function(err, result) {
			//assert.equal(null, err);
			//db.close();
		});
	});

	stream.on('error', function(error) {
		console.log('hello')
		console.log(error);
		//throw error;
		//db.close();
	});

});

  //db.close();
});