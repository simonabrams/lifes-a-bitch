// import utilities
import { randRange, sentenceCase, processResponse } from './js/utils';
//  set client ID token
import { clientID, clientAccessToken } from './js/config';

// make a new XMLHttpRequest object
/* let xhr;
let songRequest;
if (window.XMLHttpRequest) {
	xhr = new XMLHttpRequest();
	songRequest = new XMLHttpRequest();
} else {
	// windows IE
	xhr = new ActiveXObject('Microsoft.XMLHTTP');
	songRequest = new ActiveXObject('Microsoft.XMLHTTP');
} */

const request = (obj) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(obj.method || 'GET', obj.url, true);
		if (obj.headers) {
			Object.keys(obj.headers).forEach((key) => {
				xhr.setRequestHeader(key, obj.headers[key]);
			});
		}
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			} else {
				reject(xhr.statusText);
			}
		};
		xhr.onerror = () => reject(xhr.statusText);
		xhr.send(obj.body);
	});
};

function displaySongMedia(e) {
	const data = e.response.song;
	const { media } = data.media;
	const list = document.querySelector('media-objects-list');
	if (list.hasChildNodes()) {
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}
	}
	media.forEach((item) => {
		// insert a list item for each media object
		const listItem = document.createElement('li'); // create a <li> for each media item
		listItem.classList.add('media-object-item'); // assign class for styling

		const a = document.createElement('a');
		a.href = item.url;
		a.setAttribute('target', '_blank');

		if (item.provider !== undefined) {
			const icon = document.createElement('i'); // create a div within that li

			// console.log(e);
			// set the icon for the media item provider
			switch (item.provider) {
			case 'apple_music':
				icon.className = 'fa fa-apple';
				break;
			case 'spotify':
				icon.className = 'fa fa-spotify';
				break;
			case 'soundcloud':
				icon.className = 'fa fa-soundcloud';
				break;
			case 'youtube':
				icon.className = 'fa fa-youtube';
				break;
			default:
				icon.className = '';
				break;
			}
			icon.className += ' fa-3x fa-fw';

			a.appendChild(icon);
		}
		listItem.appendChild(a);
		list.appendChild(listItem); // add the li to the main media-object list
	});
}

// get the song media
// get song media, via a separate xmlhttprequest
function getSongMedia(song) {
	const songRequestURI = song.songInfo;
	// songRequest.open('GET', songRequestURI, true);
	// songRequest.onreadystatechange = processResponse(displaySongMedia);
	// songRequest.send();
	request({ url: songRequestURI })
		.then((data) => {
			const songRequest = JSON.parse(data);
			displaySongMedia(songRequest);
		})
		.catch((error) => {
			console.log(error);
		});
}

// stule the song display
function styleSongDisplay(s) {
	// set background image
	document.body.style.backgroundImage = `url(${s.thumbnail})`;
	document.body.style.backgroundRepeat = 'no-repeat';
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';
}

function displayRandomResult(songs) {
	const data = songs.response.hits;
	console.log(songs);

	// randomly select the song
	const rand = randRange(0, data.length);
	const song = data[rand];

	// display the song title, artist, album and lyric
	const s = {
		title: sentenceCase(song.result.title),
		artist: song.result.primary_artist.name,
		path: `https://genius.com + ${song.result.path}`,
		artist_path: song.result.primary_artist.url,
		thumbnail: song.result.song_art_image_thumbnail_url,
		songInfo: `https://api.genius.com/songs/${song.result.id}?access_token=${clientAccessToken}`,
	};
	// console.log(s.songInfo);

	// build the display
	styleSongDisplay(s);

	// set song title
	const titleText = document.querySelector('.title-text');
	titleText.innerHTML = s.title;

	const titleLink = document.querySelector('.title-link');
	titleLink.href = s.path;

	// set artist
	const artist = document.querySelector('.artist-text');
	artist.innerHTML = s.artist;
	const artistLink = document.querySelector('.artist-link');
	artistLink.href = s.artist_path;

	// get song media object - eg. youtube, apple music, spotify links
	getSongMedia(s);
}

// gets songs from the API
function getSongs() {
	// search for songs with the lyric 'life's a bitch"
	const requestURI = `https://api.genius.com/search?q=lifes%20a%20bitch%20&per_page=50&access_token=${clientAccessToken}`;

	request({ url: requestURI })
		.then((data) => {
			const songs = JSON.parse(data);
			displayRandomResult(songs);
		})
		.catch((error) => {
			console.log(error);
		});
}

// button handler
const songsButton = document.querySelector('.songs-button');
songsButton.addEventListener('mousedown', getSongs);

// get the songs
getSongs();
