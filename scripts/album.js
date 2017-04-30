////////////////////////////////////////////////////////////////////////////////
// Variables
////////////////////////////////////////////////////////////////////////////////
var playButtonTemplate,
    pauseButtonTemplate,
    playerBarPlayButton,
    playerBarPauseButton,
    currentlyPlayingSongNumber,
    currentAlbum,
    currentSongFromAlbum,
    $previousButton,
    $nextButton,
    createSongRow,
    template,
    $row,
    clickHandler,
    songNumber,
    onHover,
    offHover,
    setCurrentAlbum,
    $albumTitle,
    $albumArtist,
    $albumReleaseInfo,
    $albumImage,
    $albumSongList,
    $newRow,
    i,
    trackIndex,
    updatePlayerBarSong,
    nextSong,
    currentSongIndex,
    lastSongNumber,
    $nextSongNumberCell,
    $lastSongNumberCell,
    previousSong,
    $previousSongNumberCell;

////////////////////////////////////////////////////////////////////////////////
// Assignments
////////////////////////////////////////////////////////////////////////////////

// Assign desired html elements in variables
playButtonTemplate = '<a class="album-song-button">'
                          +'<span class="ion-play"></span></a>';
pauseButtonTemplate = '<a class="album-song-button">'
                          +'<span class="ion-pause"></span></a>';
playerBarPlayButton = '<span class="ion-play"></span>';
playerBarPauseButton = '<span class="ion-pause"></span>';

// Set variables in the global scope to hold current song and album info.
currentlyPlayingSongNumber = null;
currentAlbum = null;
currentSongFromAlbum = null;

$previousButton = $('.main-controls .previous');
$nextButton = $('.main-controls .next');

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////

// Create a function that generates the the content for each row
createSongRow = function (songNumber, songName, songLength) {
  template =
      // Row class is 'album-view-song-item', parent class of data items
      '<tr class="album-view-song-item">'

      // First data item has a class of 'song-item-number'
      // We will store an additional data attribute here called 'data-song-number'.
      // This will allow us to access the data via DOM.
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">'
          + songNumber + '</td>'

      // Song-item-title is another data in the same row as song-item-number
      + '  <td class="song-item-title">' + songName + '</td>'

      // Song-item-duration is another data in the same row as song-item-number
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>';

  $row = $(template);

  // An event listener will listen for when the mouse clicks on a song #
  clickHandler = function() {

    // We retrieve the song item number associated with the click
    songNumber = parseInt($(this).attr('data-song-number'));

    // In the click event when there is already a song playing,
  	if (currentlyPlayingSongNumber !== null) {

      // Turn the song off by revert the pause button back to its song number
      $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber
          + '"]').html(currentlyPlayingSongNumber);
  	}

    // In the click event where the clicked song isn't already playing,
    if (currentlyPlayingSongNumber !== songNumber) {

  		// Turn the song on by rendering the play button to a pause button and
  		$(this).html(pauseButtonTemplate);

      // changing currentlyPlayingSongNumber from null to this song number.
  		currentlyPlayingSongNumber = songNumber;

      // Update variable to track when new song number is established.
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

      // Update the player bar to hold the new song title and artist.
      updatePlayerBarSong();

    // In the click event where the clicked song is playing,
  } else if (currentlyPlayingSongNumber === songNumber) {

  		// Turn the song off by reverting the pause button into a play button and
  		$(this).html(playButtonTemplate);

      // reverting the currentlyPlaying from 'data-song-number' to 'null'
  		currentlyPlayingSongNumber = null;

      // Update variable to track when new song number is established.
      currentSongFromAlbum = null;

      // Revert the player bar to a play button
      $('.main-controls .play-pause').html(playerBarPlayButton);
  	}
};

  // An event listener will listen for when the mouse hovers over song row
  onHover = function (event) {

      // We retrieve the song item number associated with this row
      songNumber =
          parseInt($(this).find('.song-item-number').attr('data-song-number'));

      // If the song item number isn't a song that's currently playing,
      if (songNumber !== currentlyPlayingSongNumber) {

          // then we make the play button appear.
          $(this).find('.song-item-number').html(playButtonTemplate);
      }
  };

  // An event listener will listen for when the mouse leaves a song row
  offHover = function (event) {

      // We retrieve the song item number associated with this row
      songNumber =
          parseInt($(this).find('.song-item-number').attr('data-song-number'));

      // If the song item number isn't a song that's currently playing,
      // then we make the song number reappear
      if (songNumber !== currentlyPlayingSongNumber) {
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

// Create a function that will take album objects as an argument
setCurrentAlbum = function (album) {

  currentAlbum = album;

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
      $newRow = createSongRow(i + 1, album.songs[i].title,
                    album.songs[i].duration);
      $albumSongList.append($newRow);
  }
};

// Track the album and song index
trackIndex = function (album, song) {
  return album.songs.indexOf(song);
};

// Update the player bar
updatePlayerBarSong = function() {

  // Pull song name from currently playing song
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);

  // Pull artist name from currently playing song
  $('.currently-playing .artist-name').text(currentAlbum.artist);

  // Pull song name and artist name to apply to mobile view
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title
        + " - " + currentAlbum.artist);

  // Adjust play button to pause button
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Function that performs when next button is clicked.
nextSong = function() {

  // Extract index from trackIndex function.
  currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

  // Increment the index up to move to the next song.
  currentSongIndex += 1;

  // If the index goes above the length of the album, cycle back to 0.
  if (currentSongIndex >= currentAlbum.songs.length) {
      currentSongIndex = 0;
  }

  // Save the last song number before changing it.
  lastSongNumber = currentlyPlayingSongNumber;

  // Set to the new current song.
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  // Update the player bar information.
  updatePlayerBarSong();

  $nextSongNumberCell = $('.song-item-number[data-song-number="'
                          + currentlyPlayingSongNumber + '"]');
  $lastSongNumberCell = $('.song-item-number[data-song-number="'
                          + lastSongNumber + '"]');

  // Update with pause button.
  $nextSongNumberCell.html(pauseButtonTemplate);

  // Update with number.
  $lastSongNumberCell.html(lastSongNumber);
};

// Function that performs when previous button is clicked.
previousSong = function() {

    // Extract index from trackIndex function.
    currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    // Decrement the index up to move to the next song.
    currentSongIndex -= 1;

    // If the index goes below zero, send it to the end
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    $previousSongNumberCell = $('.song-item-number[data-song-number="'
                              + currentlyPlayingSongNumber + '"]');
    $lastSongNumberCell = $('.song-item-number[data-song-number="'
                              + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

////////////////////////////////////////////////////////////////////////////////
// Script
////////////////////////////////////////////////////////////////////////////////

// Now state what should show upon page load and define some event listeners
$(document).ready(function () {
    // Picasso will show for now (static)
    setCurrentAlbum(albumPicasso);
    // Handles click events on the player bar next and previous buttons
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
