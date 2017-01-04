(function(){
    //  set client ID token
    var clientID = "EoG8HgZ6WIseNFKbw1qUxXo5w6lhrV1-f76IvGt4bfTfE2hlxSU2OHhBDA9kYADd";
    // set client access token
    var clientAccessToken = "Z-NIDSz5s1ET8GhOVI8I7qhWpkP5cJTPyxB1lHXPzYbtpJgXHTUvHRlJ5t7Kjg55";

    // var data;

    function displayRandomResult(e) {

        var data = e.response.hits;

        // randomly select the song
        var rand = randRange(0, data.length);
        var song = data[rand];

        //display the song title, artist, album and lyric
        var s = {
            title: sentenceCase(song.result.title),
            artist: song.result.primary_artist.name,
            path: "https://genius.com" + song.result.path,
            artist_path: song.result.primary_artist.url,
            thumbnail: song.result.song_art_image_thumbnail_url,
            songInfo: "https://api.genius.com/songs/" + song.result.id + "?access_token=" + clientAccessToken
        }
        // console.log(s);

        // build the display 

        // set background image
        document.body.style.backgroundImage = "url(" + s.thumbnail + ")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";

        // set song title
        var titleText = document.getElementsByClassName('title-text')[0];
        titleText.innerHTML = s.title;
        
        var titleLink = document.getElementsByClassName('title-link')[0];
        titleLink.href = s.path;

        // set artist
        var artist = document.getElementsByClassName('artist-text')[0];
        artist.innerHTML = s.artist;
        var artistLink = document.getElementsByClassName('artist-link')[0];
        artistLink.href = s.artist_path;

        // get song media object - eg. youtube, apple music, spotify links
        getSongMedia(s);

        

    }


    // make a new XMLHttpRequest object
    var xhr, songRequest;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
        songRequest = new XMLHttpRequest();
    } else {
        // windows IE
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
        songRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }




    // gets songs from the API
    function getSongs(){
        // search for songs with the lyric "life's a bitch"
        var request_uri = "https://api.genius.com/search?q=lifes%20a%20bitch%20&per_page=50&access_token=" + clientAccessToken;
        
        // open the connection to the server
        xhr.open("GET", request_uri, true);
        
        // handle the data response
        xhr.onreadystatechange = processResponse(displayRandomResult);
        xhr.send();
    }

    // get song media, via a separate xmlhttprequest
    function getSongMedia(song) {
        var songRequest_uri = song.songInfo;

        songRequest.open("GET", songRequest_uri, true);
        songRequest.onreadystatechange = processResponse(displaySongMedia);
        songRequest.send();
    }

    function displaySongMedia(e) {
        var data = e.response.song;
        var media = data.media;
        var list = document.getElementsByClassName('media-objects-list')[0];
        if (list.hasChildNodes()) {
            while(list.firstChild) {
                list.removeChild(list.firstChild);
            }
        }
        media.forEach(function(e) {
            // insert a list item for each media object
            var listItem = document.createElement('li'); // create a <li> for each media item
            listItem.classList.add('media-object-item'); // assign class for styling

            var a = document.createElement('a');
            a.href = e.url;
            a.setAttribute("target", "_blank");

            if (e.provider !== undefined) {
                var icon = document.createElement('i'); // create a div within that li

                // console.log(e);
                
                // set the icon for the media item provider
                switch (e.provider) {
                    case "apple_music":
                        icon.className = 'fa fa-apple';
                        break;
                    case "spotify":
                        icon.className = 'fa fa-spotify';
                        break;
                    case "soundcloud":
                        icon.className = 'fa fa-soundcloud';
                        break;
                    case "youtube":
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


    // handles the data returned by the server
    function processResponse(func){
        return function() {
            // if the response is ready
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status == 200) {
                    // parses JSON data
                    var jsonResponse = JSON.parse(this.responseText);
                    data = jsonResponse;
                    func(data);
                } else {
                    console.log("error with the request!")
                }
            }
            // try {
            // }
            // catch(e) {
            //     console.log("Caught Exception: " + e.description);
            // }
        }
    }



    // button handler
    var songsButton = document.getElementsByClassName('songs-button')[0];
    songsButton.addEventListener('mousedown', getSongs);

    // get the songs
    getSongs();



    /**
     *   utilities
     */
    
    // generate a random number between two numbers
    function randRange(min, max)
    {
         return Math.round(min + (max - min) * Math.random());
    }

    // set sentence case
    function sentenceCase (str) {  
      if ((str===null) || (str===''))  
           return false;  
      else  
       str = str.toString();  
      
     return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});  
    } 


})();