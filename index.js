var last_percolated,
	last_percolated_url;

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(6969);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
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
	if (text.indexOf('percolator') === -1) return false;
	if (text.indexOf('time') === -1 || text.indexOf('for') === -1) return false;
	return true;
}


var Twit = require('twit')

var config = require(__dirname + '/config.json');

var T = new Twit(config);

var stream = T.stream('statuses/filter', { track: 'percolator' })


io.on('connection', function (socket) {
	io.emit('hello', {
		last_percolated : last_percolated,
		last_percolated_url : last_percolated_url
	});
});

stream.on('tweet', function (tweet) {
	// console.log(tweet.text);
	if (filter(tweet.text) === true) {
		console.log(tweet.text);
		tweet.url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
		last_percolated = tweet.created_at;
		last_percolated_url = tweet.url;
		tweet.last_percolated = last_percolated;
		io.emit('tweet', tweet);
	}
});