var last_percolated,
	last_percolated_url,
	last_percolated_text;

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require("url");

app.listen(6969);

try {
	var cache = fs.readFileSync(__dirname + '/cache.json'),
		cached_tweet = JSON.parse(cache);

	// console.log(cached_tweet);

	if (cached_tweet.url && cached_tweet.last_percolated && cached_tweet.text) {
		last_percolated_url = cached_tweet.url;
		last_percolated_text = cached_tweet.text;
		last_percolated = cached_tweet.last_percolated;
	}

} catch (e) {

}



function handler (req, res) {
  var uri = url.parse(req.url).pathname,
  	filename;
  	if (uri === '/style.css') {
  		filename = '/style.css';
  	} else if (uri === '/script.js') {
  		filename = '/script.js';
  	} else {
  		filename = '/index.html';
  	}
  fs.readFile(__dirname + filename,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

function filter(text) {
	text = text.toLowerCase();
	if (text.indexOf('percolator') === -1 && text.indexOf('perculator') === -1) return false;
	if (text.indexOf('time') === -1 || text.indexOf('for') === -1) return false;
	return true;
}


var Twit = require('twit')

var config = require(__dirname + '/config.json');

var T = new Twit(config);

var stream = T.stream('statuses/filter', { track: ['percolator','perculator'] })

function cache_latest(tweet) {
	last_percolated = tweet.last_percolated;
	last_percolated_url = tweet.url;
	last_percolated_text = tweet.text;
	fs.writeFileSync(__dirname + '/cache.json', JSON.stringify(tweet));
}

io.on('connection', function (socket) {
	io.emit('hello', {
		last_percolated : last_percolated,
		last_percolated_url : last_percolated_url,
		last_percolated_text : last_percolated_text
	});
});

stream.on('tweet', function (tweet) {
	// console.log(tweet.text);
	if (filter(tweet.text) === true) {
		console.log(tweet.text);
		tweet.url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
		tweet.last_percolated = tweet.created_at;
		cache_latest(tweet);
		io.emit('tweet', tweet);
	}
});