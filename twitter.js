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
		consumer_key: 'AxopL7EZPFqIRuWyRlFEDH8wL',
		consumer_secret: 'wuW5irAwOPpvUwKCIIw7nEqzSdcGz9cf2mnZVwTT6TCdLLePri',
		access_token_key: '1469634289-a5kJCSPwWkEUrdb3L9s9hIOGHykjBEhF3q2WKIJ',
		access_token_secret: 'CDci8r063MbRYx2T6gQyTbWBqvS2vMrv38g8thH9pwfp8'
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