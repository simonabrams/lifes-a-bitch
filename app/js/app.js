// import utilities
import { randRange, sentenceCase } from './utils';
//  set client ID token
import { clientID, clientAccessToken } from './config';
// import GSAP
import { TweenMax, TimelineMax } from 'gsap';
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

// gets rid of previously added elements in the media items list
function removeMediaElements(list) {
	const els = Array.from(list.childNodes);

	return els.map(item => item.parentNode.removeChild(item));
}

// add a button for each type of media that is associated with the song
// eg. YouTube, Spotify, Soundcloud, etc.
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
	const icons = media.map(item => createMediaElement(item, list));
	const iconsAnim = TweenMax.staggerFrom(icons, 1, {
		autoAlpha: 0,
		scale: 1.1,
		ease: Elastic.easeOut,
	}, 0.2);
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

// sets the title text and links for the song
function setSongDetails(song) {
	// title
	const titleText = document.querySelector('.title-text');
	titleText.innerHTML = song.title;

	const titleLink = document.querySelector('.title-link');
	titleLink.href = song.path;

	// set artist
	const artist = document.querySelector('.artist-text');
	artist.innerHTML = song.artist;

	const artistLink = document.querySelector('.artist-link');
	artistLink.href = song.artist_path;

	// animate the info in
	const tl = new TimelineMax();
	tl.staggerFrom([titleText, artist], 1, { autoAlpha: 0, scale: 1.1, ease:Strong.easeInOut }, 0.2);
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
		path: `https://genius.com${song.result.path}`,
		artist_path: song.result.primary_artist.url,
		thumbnail: song.result.song_art_image_thumbnail_url,
		songInfo: `https://api.genius.com/songs/${song.result.id}?access_token=${clientAccessToken}`,
	};

	// sets the background iamge
	setBackgroundImage(songDetails);

	// set song title, artist and urls
	setSongDetails(songDetails);

	// get song media object - eg. youtube, apple music, spotify links
	getSongMedia(songDetails);
}

// gets songs from the API
function getSongs() {
	// get a random page number
	const page = (Math.floor(Math.random() * 50)) - 1;
	console.log(page);
	// search for songs with the lyric 'life's a bitch'"
	const requestURI = `https://api.genius.com/search?q=lifes%20a%20bitch%20&per_page=50&page=${page}&access_token=${clientAccessToken}`;
	console.log(requestURI);
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
