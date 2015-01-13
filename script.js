
function its_time(link) {
	var audio = document.querySelector('#sound');
	document.body.classList.add('visible');
	// document.querySelector('.percolator-where').setAttribute('href', link)
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
function update_time(time_string, link_string) {
	var a, d;
	if (time_string.length && link_string.length) {
		last_time = d = new Date(time_string);
		a = document.querySelector('.last-percolator-time');
		a.innerText = timeSince(d) + ' ago';		
		a.setAttribute('href', link_string);
		if (!check_last_time) {
			check_last_time = setInterval(function() {
				a.innerText = timeSince(last_time) + ' ago';		
				// console.log('updated', a.innerText)
			}, 60000);
		}
	}
}

var socket = io('http://itstimeforthepercolator.com'); // change to localhost for local dev
socket.on('hello', function(last) {
	if (last && last.last_percolated && last.last_percolated_url) {
		update_time(last.last_percolated, last.last_percolated_url);
	}
});
socket.on('tweet', function (data) {
	update_time(data);
	its_time(data.url);		
}); }
})