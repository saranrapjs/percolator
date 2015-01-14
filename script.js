function its_time() {
	var audio = document.querySelector('#sound');
	document.body.classList.add('visible');
	if (audio.paused === true) {
		audio.addEventListener('ended', function() {
			its_no_longer_time();
			this.removeEventListener('ended');
		});
		audio.play();
	}
}
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
function its_no_longer_time() {
	document.body.classList.remove('visible');
	// document.querySelector('.percolator-where').removeAttribute('href')
}
var last_time,
	check_last_time;
function update_time(time_string, link_string, text) {
	var a, t, d;
	if (time_string.length && link_string.length) {
		last_time = d = new Date(time_string);
		t = document.querySelector('.last-percolator-time');
		t.innerText = timeSince(d) + ' ago';		
		a = document.querySelector('.last-percolator-text');
		a.setAttribute('href', link_string);
		a.innerText = text;
		if (!check_last_time) {
			check_last_time = setInterval(function() {
				t.innerText = timeSince(last_time) + ' ago';		
				// console.log('updated', a.innerText)
			}, 60000);
		}
	}
}
var socket = io('http://itstimeforthepercolator.com'); // change to localhost for local dev
socket.on('hello', function(last) {
	if (last && last.last_percolated && last.last_percolated_url && last.last_percolated_text) {
		update_time(last.last_percolated, last.last_percolated_url, last.last_percolated_text);
	}
});
socket.on('tweet', function (data) {
	update_time(data.last_percolated, data.last_percolated_url, data.last_percolated_text);
	its_time();		
});