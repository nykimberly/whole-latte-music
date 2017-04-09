(function () {
    "use strict";
    
    var albumPicasso, albumMarconi, albumGlitch, createSongRow, template,  albumTitle, albumArtist, albumReleaseInfo, albumImage, albumSongList, setCurrentAlbum, albumsArray, i, m;

    // Create Album Object - The Colors by Pablo Picasso
    albumPicasso = {
        title: 'The Colors',
        artist: 'Pablo Picasso',
        label: 'Cubism',
        year: '1881',
        albumArtUrl: 'assets/images/album_covers/01.png',
        songs: [
            { title: 'Blue', duration: '4:26' },
            { title: 'Green', duration: '3:14' },
            { title: 'Red', duration: '5:01' },
            { title: 'Pink', duration: '3:21'},
            { title: 'Magenta', duration: '2:15'}
        ]
    };

    // Create Album Object - The Telephone by Guglielmo Marconi
    albumMarconi = {
        title: 'The Telephone',
        artist: 'Guglielmo Marconi',
        label: 'EM',
        year: '1909',
        albumArtUrl: 'assets/images/album_covers/20.png',
        songs: [
            { title: 'Hello, Operator?', duration: '1:01' },
            { title: 'Ring, ring, ring', duration: '5:01' },
            { title: 'Fits in your pocket', duration: '3:21'},
            { title: 'Can you hear me now?', duration: '3:14' },
            { title: 'Wrong phone number', duration: '2:15'}
        ]
    };

    // Create Album Object - Drive It Like You Stole It by The Glitch Mob
    albumGlitch = {
        title: 'Drive It Like You Stole It',
        artist: 'The Glitch Mob',
        label: 'Self-Released',
        year: '2011',
        albumArtUrl: 'assets/images/album_covers/22.png',
        songs: [
            { title: 'Drive It Like You Stole It', duration: '5:52' },
            { title: 'Between Two Points (feat. Swan)', duration: '5:35' }
        ]
    };

    // Create a function named createSongRow that generates the song row content
    createSongRow = function (songNumber, songName, songLength) {
        template = '<tr class="album-view-song-item">'
            + '  <td class="song-item-number">' + songNumber + '</td>'
            + '  <td class="song-item-title">' + songName + '</td>'
            + '  <td class="song-item-duration">' + songLength + '</td>'
            + '</tr>';
        return template;
    };

    // Create a function named setCurrentAlbum that will take one of our album objects as an argument and will utilize the object's stored information by injecting it into the template
    
    albumTitle = document.getElementsByClassName('album-view-title')[0];
    albumArtist = document.getElementsByClassName('album-view-artist')[0];
    albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    albumImage = document.getElementsByClassName('album-cover-art')[0];
    albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    setCurrentAlbum = function (album) {
        
        albumTitle.firstChild.nodeValue = album.title;
        albumArtist.firstChild.nodeValue = album.artist;
        albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
        albumImage.setAttribute('src', album.albumArtUrl);
        albumSongList.innerHTML = '';
        
        for (i = 0; i < album.songs.length; i += 1) {
            albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        }
    };

//    window.onload = function () {
//        setCurrentAlbum(albumMarconi);
//        albumsArray = [albumPicasso, albumGlitch, albumMarconi];
//        i = 1;
//        albumImage.addEventListener("click", function (event) {
//            setCurrentAlbum(albumsArray[i]);
//            i += 1;
//            if (i == albumsArray.length) {
//                i = 0;
//            }
//        });
//    };
    
    window.onload = function () {
        setCurrentAlbum(albumPicasso);
        albumsArray = [albumPicasso, albumGlitch, albumMarconi];
        m = 0;
        albumImage.addEventListener("click", function (event) {
            m ++;
            if (m == 1) {
                setCurrentAlbum(albumGlitch); // albumsArray[1] won't work after the second loop around
            } else if (m == 2 ) {
                setCurrentAlbum(albumMarconi); // hard coding the album variable seems to work  
            } else {
                setCurrentAlbum(albumPicasso);
                m = 0;
            }
        });
    };
    

}());