// import utilities
import { randRange, sentenceCase } from './utils';
//  set client ID token
import { clientID, clientAccessToken } from './config';
// import css
import '../scss/styles.scss';

if (module.hot) { module.hot.accept(); }

const request = obj => (
	new Promise((resolve, reject) => {
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
	})
);

function removeMediaElements(list) {
	const els = Array.from(list.childNodes);

	return els.map(item => item.parentNode.removeChild(item));
}

function createMediaElement(mediaDetails, list) {
	const a = document.createElement('a');
	a.href = mediaDetails.url;
	a.setAttribute('target', '_blank');

	const listItem = document.createElement('li');
	listItem.classList.add('media-object-item');

	// add the icon
	if (mediaDetails.provider !== undefined) {
		const icon = document.createElement('i');

		// set the icon for the media item provider
		switch (mediaDetails.provider) {
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
	list.appendChild(listItem);
	return listItem;
}

function displaySongMedia(songReq) {
	const data = songReq.response.song;
	const media = Object.values(data.media);
	const list = document.querySelector('.media-objects-list');

	// clear out the list of media elements if there's already stuff in there
	if (list.childNodes.length > 0) {
		removeMediaElements(list);
	}

	// insert a list item for each media object
	media.map(item => createMediaElement(item, list));
}

// get the song media
// get song media, via a separate xmlhttprequest
function getSongMedia(song) {
	const songRequestURI = song.songInfo;
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
function setBackgroundImage(s) {
	// set background image
	document.body.style.backgroundImage = `url(${s.thumbnail})`;
	document.body.style.backgroundRepeat = 'no-repeat';
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';
}

function selectRandomSong(songs) {
	const data = songs.response.hits;

	// randomly select the song
	const rand = randRange(0, data.length);
	const song = data[rand];

	// display the song title, artist, album and lyric
	const songDetails = {
		title: sentenceCase(song.result.title),
		artist: song.result.primary_artist.name,
		path: `https://genius.com/${song.result.path}`,
		artist_path: song.result.primary_artist.url,
		thumbnail: song.result.song_art_image_thumbnail_url,
		songInfo: `https://api.genius.com/songs/${song.result.id}?access_token=${clientAccessToken}`,
	};

	// build the display
	setBackgroundImage(songDetails);

	// set song title
	const titleText = document.querySelector('.title-text');
	titleText.innerHTML = songDetails.title;

	const titleLink = document.querySelector('.title-link');
	titleLink.href = songDetails.path;

	// set artist
	const artist = document.querySelector('.artist-text');
	artist.innerHTML = songDetails.artist;
	const artistLink = document.querySelector('.artist-link');
	artistLink.href = songDetails.artist_path;

	// get song media object - eg. youtube, apple music, spotify links
	getSongMedia(songDetails);
}

// gets songs from the API
function getSongs() {
	// search for songs with the lyric 'life's a bitch"
	const requestURI = `https://api.genius.com/search?q=lifes%20a%20bitch%20&per_page=50&access_token=${clientAccessToken}`;

	request({ url: requestURI })
		.then((data) => {
			const songs = JSON.parse(data);
			selectRandomSong(songs);
		})
		.catch((error) => {
			console.log(error);
		});
}

// button handler
const songsButton = document.querySelector('.songs-button');
songsButton.addEventListener('click', getSongs);

// get the songs
getSongs();
