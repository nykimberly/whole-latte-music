// Define all variables at head
var albumPicasso,
    albumMarconi,
    createSongRow,
    template,
    $row,
    onHover,
    offHover,
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

  $row = $(template);

  // An event listener will listen for when the mouse clicks on a song #
  var clickHandler = function() {

    // We retrieve the song item number associated with the click
  	var songNumber = $(this).attr('data-song-number');

    // In the click event when there is already a song playing,
  	if (currentlyPlayingSong !== null) {

  		// Turn the song off by revert the pause button back to its song number
  		$('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]').html(currentlyPlayingSong);
  	}

    // In the click event where the clicked song isn't already playing,
  	if (currentlyPlayingSong !== songItem) {

  		// Turn the song on by rendering the play button to a pause button and
  		$(this).html(pauseButtonTemplate);

      // changing currentlyPlayingSong from null to this song number.
  		currentlyPlayingSong = songNumber;

    // In the click event where the clicked song is playing,
  	} else if (currentlyPlayingSong === songItem) {

  		// Turn the song off by reverting the pause button into a play button and
  		$(this).html(playButtonTemplate);

      // reverting the currentlyPlaying from 'data-song-number' to 'null'
  		currentlyPlayingSong = null;
  	}
};

  // An event listener will listen for when the mouse hovers over song row
  onHover = function (event) {

      // We retrieve the song item number associated with this row
      songItem = $(this).find('.song-item-number').attr('data-song-number');

      // If the song item number isn't a song that's currently playing,
      if (songItem !== currentlyPlayingSong) {

          // then we make the play button appear.
          $(this).find('.song-item-number').html(playButtonTemplate);
      }
  };

  // An event listener will listen for when the mouse leaves a song row
  offHover = function (event) {

      // We retrieve the song item number associated with this row
      songItem = $(this).find('.song-item-number').attr('data-song-number');

      // If the song item number isn't a song that's currently playing,
      // then we make the song number reappear
      if (songItem !== currentlyPlayingSong) {
          $(this).find('.song-item-number').html(songNumber);
      }
  };

  // jQuery find() is similar to querySelector.
  // Looks for element with specified class contained in row that is clicked.
  $row.find('.song-item-number').click(clickHandler);

  // jQuery hover() combines mouseover and mouseleave.
  $row.hover(onHover, offHover);

  // Now contains the event listeners we've attached.
  return $row;
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

// Define a shared parent class of 'album-song-button' but both play and pause buttons, and then differentiate with a child span class of 'ion-play' and 'ion-pause'.
playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Now state what should show upon page load and then define some event listeners
$(document).ready(function () {
    // Picasso will show for now (static)
    setCurrentAlbum(albumPicasso);
});
