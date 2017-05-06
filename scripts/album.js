(function () {
    "use strict";

    ////////////////////////////////////////////////////////////////////////////////
    // Variables
    ////////////////////////////////////////////////////////////////////////////////
    var playButtonTemplate,
        pauseButtonTemplate,
        playerBarPlayButton,
        playerBarPauseButton,
        $previousButton,
        $nextButton,
        currentlyPlayingSongNumber,
        currentAlbum,
        currentSongFromAlbum,
        currentSoundFile,
        currentVolume,
        setSong,
        setVolume,
        getSongNumberCell,
        createSongRow,
        template,
        $row,
        clickHandler,
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
                              + '<span class="ion-play"></span></a>';
    pauseButtonTemplate = '<a class="album-song-button">'
                              + '<span class="ion-pause"></span></a>';
    playerBarPlayButton = '<span class="ion-play"></span>';
    playerBarPauseButton = '<span class="ion-pause"></span>';
    $previousButton = $('.main-controls .previous');
    $nextButton = $('.main-controls .next');

    // Set variables in the global scope to hold current song and album info.
    currentlyPlayingSongNumber = null;
    currentAlbum = null;
    currentSongFromAlbum = null;
    currentSoundFile = null;
    currentVolume = 80;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////////////

    // Assigns two variables with song number.
    setSong = function (number) {

        // Pause any song currently playing.
        if (currentSoundFile) {
            currentSoundFile.stop();
        }

        // Converts string to integer.
        currentlyPlayingSongNumber = parseInt(number);
        // Converts integer to index.
        currentSongFromAlbum = currentAlbum.songs[number - 1];

        // Create a new buzz sound object that can be passed an audioUrl.
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
            // Define properties of sound object here.
            formats: [ 'mp3' ],
            // Load the mp3s as soon as the page loads.
            preload: true
        });

        // Set volume to current volume.
        setVolume(currentVolume);
    };

    // Function to set volume
    setVolume = function (volume) {

      // If song is playing, specify volume.
        if (currentSoundFile) {
            currentSoundFile.setVolume(volume);
        }

    };

    // Holds html to avoid repetition
    getSongNumberCell = function (number) {
        return $('.song-item-number[data-song-number="' + number + '"]');
    };

    // Create a function that generates the the content for each row
    createSongRow = function (songNumber, songName, songLength) {

        template =
            // Row class is 'album-view-song-item', parent class of data items
            '<tr class="album-view-song-item">'
            // First data item has a class of 'song-item-number'
            // We will store an additional attribute here called 'data-song-number'.
            // This will allow us to access the data via DOM.
            + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            // Song-item-title is another data in the same row as song-item-number
            + '  <td class="song-item-title">' + songName + '</td>'
            // Song-item-duration is another data in the same row as song-item-number
            + '  <td class="song-item-duration">' + songLength + '</td>'
            + '</tr>';

        $row = $(template);
        // An event listener will listen for when the mouse clicks on a song #

        clickHandler = function () {
            // We retrieve the song item number associated with the click
            songNumber = parseInt($(this).attr('data-song-number'));

            // In the click event when there is already a song playing,
            // Turn the song off by revert the pause button back to its song number
            if (currentlyPlayingSongNumber !== null) {
                getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
            }

          // In the click event where the clicked song isn't already playing,
            if (currentlyPlayingSongNumber !== songNumber) {

                // Turn the song on by rendering the play button to a pause button and
                $(this).html(pauseButtonTemplate);
                // changing from null to this song number.
                setSong(songNumber);
                currentSoundFile.play();
                // Update the player bar to hold the new song title and artist.
                updatePlayerBarSong();

            // In the click event where the clicked song is playing,
            } else if (currentlyPlayingSongNumber === songNumber) {

                // If the song is currently paused,play the song.
                if (currentSoundFile.isPaused()) {
                    currentSoundFile.play();
                    // Display pause button both on song row and player bar.
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                } else {
                    // Otherwise pause the song.
                    currentSoundFile.pause();
                    // Display the play button on song row and player bar.
                    $(this).html(playButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPlayButton);
                }
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
            $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
            $albumSongList.append($newRow);
        }
    };

    // Track the album and song index
    trackIndex = function (album, song) {
        return album.songs.indexOf(song);
    };

    // Update the player bar
    updatePlayerBarSong = function () {
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
    nextSong = function () {
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
        setSong(currentSongIndex + 1);
        currentSoundFile.play();
        // Update the player bar information.
        updatePlayerBarSong();
        $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        $lastSongNumberCell = getSongNumberCell(lastSongNumber);
        // Update with pause button.
        $nextSongNumberCell.html(pauseButtonTemplate);
        // Update with number.
        $lastSongNumberCell.html(lastSongNumber);
    };

    // Function that performs when previous button is clicked.
    previousSong = function () {
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
        // Set to the new current song.
        setSong(currentSongIndex + 1);
        currentSoundFile.play();
        // Update the Player Bar information
        updatePlayerBarSong();
        $('.main-controls .play-pause').html(playerBarPauseButton);
        $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        $lastSongNumberCell = getSongNumberCell(lastSongNumber);
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

}());
