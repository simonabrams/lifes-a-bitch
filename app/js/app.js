(function(){
    // set client access token
    var clientAccessToken = "Z-NIDSz5s1ET8GhOVI8I7qhWpkP5cJTPyxB1lHXPzYbtpJgXHTUvHRlJ5t7Kjg55";
    // search for songs with the lyric "life's a bitch"
    var search_term = "life%27s+a+bitch";
    var url = "https://api.genius.com/search?q=" + search_term + "&access_token=" + clientAccessToken;

    var data;

    function displayRandomResult(d) {
        // randomly select the song
        var rand = randRange(0, d.length);
        var song = d[rand];
        //display the song title, artist, album and lyric
        var s = {
            title: song.result.title,
            artist: song.result.primary_artist.name,
            path: "https://genius.com" + song.result.path,
            artist_path: song.result.primary_artist.url,
            thumbnail: song.result.song_art_image_thumbnail_url
        }
        console.log(song);

        // build the display 
        // TODO: Use handlebars for templating this

        document.body.style.backgroundImage = "url(" + s.thumbnail + ")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";


        // var thumbnailLink = document.getElementsByClassName('thumbnail-link')[0];
        // thumbnailLink.href = s.path;

        var titleText = document.getElementsByClassName('title-text')[0];
        titleText.innerHTML = s.title;
        
        var titleLink = document.getElementsByClassName('title-link')[0];
        titleLink.href = s.path;

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


    // make a new XMLHttpRequest object
    var xhr;
    if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        // windows IE
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // open the connection to the server
    xhr.open("GET", url, true);
    // handle the data response
    xhr.onreadystatechange = processResponse;
    xhr.send();

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

})();