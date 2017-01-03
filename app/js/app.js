(function(){
    //  set client ID token
    var clientID = "EoG8HgZ6WIseNFKbw1qUxXo5w6lhrV1-f76IvGt4bfTfE2hlxSU2OHhBDA9kYADd";
    // set client access token
    var clientAccessToken = "Z-NIDSz5s1ET8GhOVI8I7qhWpkP5cJTPyxB1lHXPzYbtpJgXHTUvHRlJ5t7Kjg55";
    // search for songs with the lyric "life's a bitch"
    var search_term = "lifes+a+bitch";
    var url = "https://api.genius.com/search?q=" + search_term + "&per_page=50" + "&access_token=" + clientAccessToken;

    var data;

    function getSongInfo(id) {

    }
    function displayRandomResult(d) {
        // randomly select the song
        var rand = randRange(0, d.length);
        var song = d[rand];
        //display the song title, artist, album and lyric
        var s = {
            title: sentenceCase(song.result.title),
            artist: song.result.primary_artist.name,
            path: "https://genius.com" + song.result.path,
            artist_path: song.result.primary_artist.url,
            thumbnail: song.result.song_art_image_thumbnail_url,
            songInfo: "https://api.genius.com/song/" + song.result.id
        }
        console.log(song);

        // build the display 
        // TODO: Use handlebars for templating this

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

    }

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

    // make a new XMLHttpRequest object
    var xhr;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        // windows IE
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // handles the data returned by the server
    function processResponse(){
        try {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    var jsonResponse = JSON.parse(xhr.responseText);
                    data = jsonResponse.response.hits;
                    displayRandomResult(data);
                } else {
                    console.log("error with the request!")
                }
            }
        }
        catch(e) {
            console.log("Caught Exception: " + e.description);
        }
    }

    // button handler
    var songsButton = document.getElementsByClassName('songs-button')[0];
    songsButton.addEventListener('mousedown', getSongs);

    // gets songs from the API
    function getSongs(){
        // open the connection to the server
        xhr.open("GET", url, true);
        // xhr.setRequestHeader("Authorization", "Bearer " + clientAccessToken);
        // handle the data response
        xhr.onreadystatechange = processResponse;
        xhr.send();
    }

    getSongs();

})();