//(function () {
//    "use strict";
    
var albumPicasso, albumMarconi, createSongRow, template, setCurrentAlbum, albumTitle, albumArtist, albumReleaseInfo, albumImage, albumSongList, songRows, i, songListContainer, playButtonTemplate, revert;

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

// Create a function named createSongRow that generates the song row content
createSongRow = function (songNumber, songName, songLength) {
    template =
        '<tr class="album-view-song-item">'
        // HTML data attributes allow us to store information in an attribute on an HTML element. Add an attribute called data-song-number. This allows us to access the data held in the attribute using DOM methods when the mouse leaves the table row, and the song number's table cell returns to its original state.
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
    return template;
};

// Create a function named setCurrentAlbum that will take one of our album objects as an argument

setCurrentAlbum = function (album) {
    albumTitle = document.getElementsByClassName('album-view-title')[0];
    albumArtist = document.getElementsByClassName('album-view-artist')[0];
    albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    albumImage = document.getElementsByClassName('album-cover-art')[0];
    albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    albumSongList.innerHTML = '';

    for (i = 0; i < album.songs.length; i += 1) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

songListContainer = document.getElementsByClassName('album-view-song-list')[0];
songRows = document.getElementsByClassName('album-view-song-item');
playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function () {
    setCurrentAlbum(albumPicasso);
    songListContainer.addEventListener('mouseover', function (event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
        }
    });
    
    function revert() {
        this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
    }
    for (i = 0; i < songRows.length; i += 1) {
        songRows[i].addEventListener('mouseleave', revert);
    }
};
//}());