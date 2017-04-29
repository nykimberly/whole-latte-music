//(function () {
//    "use strict";

// Define all variables at head
var albumPicasso,
    albumMarconi,
    createSongRow,
    template,
    setCurrentAlbum,
    $albumTitle,
    $albumArtist,
    $albumReleaseInfo,
    $albumImage,
    $albumSongList,
    $newRow,
    findParentByClassName,
    currentParent,
    getSongItem,
    songListContainer,
    playButtonTemplate,
    pauseButtonTemplate,
    clickHandler,
    songRows,
    i,
    songItem,
    songItemNumber,
    currentlyPlayingSongElement,
    currentlyPlayingSong;

// Create Album Object 01 - The Colors by Pablo Picasso
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

// Create Album Object 20 - The Telephone by Guglielmo Marconi
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

// Create a function that generates the the content for each row
createSongRow = function (songNumber, songName, songLength) {
    template =
        // Row class is 'album-view-song-item', parent class of data items
        '<tr class="album-view-song-item">'

        // First data item has a class of 'song-item-number'
        // We will store an additional data attribute here called 'data-song-number'.
        // This will allow us to access the data via DOM.
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'

        // Song-item-title is another data in the same row as song-item-number
        + '  <td class="song-item-title">' + songName + '</td>'

        // Song-item-duration is another data in the same row as song-item-number
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';

    return $(template);
};

// Create a function named setCurrentAlbum that will take one of our album objects as an argument
setCurrentAlbum = function (album) {

    // Assign classes to jQuery objects.
    $albumTitle = $('.album-view-title');
    $albumArtist = $('.album-view-artist');
    $albumReleaseInfo = $('.album-view-release-info');
    $albumImage = $('.album-cover-art');
    $albumSongList = $('.album-view-song-list');

    // Assign album detail elements using text and attribute methods
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    // Assign album.song[index] to its corresponding song#, name, and length.
    for (i = 0; i < album.songs.length; i += 1) {
        $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

// Create a function that will look up the DOM tree until a target parent class is found.
// Be sure to account for null cases.
findParentByClassName = function (currentElement, targetParentClass) {

    // If current element and target class are not valid entries then log out 'null'
    if (currentElement === null || currentElement.parentElement === null) {
        console.log("null");

    // Otherwise, iterate up until parent class is equivalent to target parent class
    } else {
        currentParent = currentElement.parentElement;
        while (currentParent.className !== targetParentClass) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};

// Consider possible use cases where an element may need to be related to its song-item number
getSongItem = function (element) {
    switch (element.className) {

    // look up DOM tree for song-item number
    case 'album-song-button':
        return findParentByClassName(element, 'song-item-number');
    case 'ion-play':
        return findParentByClassName(element, 'song-item-number');
    case 'ion-pause':
        return findParentByClassName(element, 'song-item-number');

    // look down DOM tree for .song-item-number
    case 'album-view-song-item':
        return element.querySelector('.song-item-number');

    // look up DOM tree for parent of song-item number, then select song-item number
    case 'song-item-title':
        return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-duration':
        return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');

    // return the .song-item-number itself
    case 'song-item-number':
        return element;
    }
};

// Grab album song list again, as done in setCurrentAlbum
songListContainer = document.getElementsByClassName('album-view-song-list')[0];

// Grab album song item again, as done in createSongRow
songRows = document.getElementsByClassName('album-view-song-item');

// Define a shared parent class of 'album-song-button' but both play and pause buttons, and then differentiate with a child span class of 'ion-play' and 'ion-pause'.
playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// When there is a mouse click, the target of the mouse click will be sent to the clickHandler function. The function checks whether there is a song playing prior to this click and will react in one of two ways.
clickHandler = function (targetElement) {

    // We will act on the song item number inputted
    songItem = getSongItem(targetElement);

    // If there is no song currently playing, then render the current play button to a pause button and changing the state of currentlyPlayingSong from null to its data-song-number.
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');

    // If the song we clicked on is playing, simply revert the state from 'data-song-number' to 'null' and revert the pause button into a play button.
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;

    // If there is a song playing, but it isn't the one we are clicking on, then adjust the pause button of the song item previously playing from the button to its original song number. Then, render a pause button on the current song number of the mouse click target. Finally, change the state of currentlyPlayingSong from the previous song number to this new song number associated with the target of the mouse click.
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

// Now state what should show upon page load and then define some event listeners
window.onload = function () {

    // Picasso will show for now (static)
    setCurrentAlbum(albumPicasso);

    // The initial state of currentlyPlayingSong will be null.
    currentlyPlayingSong = null;

    // An event listener will listen for when the mouse hovers over the album's song list.
    songListContainer.addEventListener('mouseover', function (event) {

        // The target event property returns the element that triggered the event. We will associate the element (target) the mouse is on with its row (the parent class 'album-view-song-item').
        if (event.target.parentElement.className === 'album-view-song-item') {

            // We then get the song-item associated with this row.
            songItem = getSongItem(event.target);

            // Finally, we grab the song nummber and check that it isn't a song that's currently playing. If that's the case, then we make a play button appear so that the user can click play if they want to :)
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });

    for (i = 0; i < songRows.length; i += 1) {

        // Now, in order to make the play button disappear after the mouse leaves, we will add the 'mouseleave' listener.
        songRows[i].addEventListener('mouseleave', function (event) {

            // We assign songItem to the song-item-number class of the element that triggered the event (target). We grab its actual number by getting the data-song-number attribute.
            songItem = getSongItem(event.target);
            songItemNumber = songItem.getAttribute('data-song-number');

            // If the song isn't currently playing, then we revert it to its song number image by changing the innerHTML from 'playButtonTemplate' to it's original 'songItemNumber'.
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });

        // When there is a mouse click, the target of the mouse click will be sent to the clickHandler function. The function checks whether there is a song playing and whether the song we clicked on is the song that is playing.
        songRows[i].addEventListener('click', function (event) {
            clickHandler(event.target);
        });
    }
};
//}());
