(function () {
  "use strict";

  var playButtonTemplate, pauseButtonTemplate,
    playerBarPlayButton, playerBarPauseButton,
    $previousButton, $nextButton, $playPauseButton,
    currentlyPlayingSongNumber, currentAlbum, currentSongFromAlbum,
    currentSoundFile, currentVolume,
    setSong,
    setVolume,
    getSongNumberCell,
    createSongRow, template, $row, clickHandler, $volumeFill, $volumeThumb, onHover, offHover,
    setCurrentAlbum, $albumTitle, $albumArtist, $albumReleaseInfo, $albumImage, $albumSongList, $newRow, i,
    setCurrentTimeInPlayerBar, $currentTimeElement,
    setTotalTimeInPlayerBar, $totalTimeElement,
    renderTime, seconds, intSeconds, minutes, remainingSeconds, rendered,
    updateSeekPercentage, offsetXPercent, percentageString,
    setupSeekBars, $seekBars, offsetX, barWidth, seekBarFillRatio, $seekBar,
    updateSeekBarWhileSongPlays,
    seek,
    trackIndex,
    updatePlayerBarSong,
    togglePlayFromPlayerBar,
    nextSong, currentSongIndex, lastSongNumber, $nextSongNumberCell, $lastSongNumberCell,
    previousSong, $previousSongNumberCell;

  // Initialize variables
  currentlyPlayingSongNumber = null;
  currentAlbum = null;
  currentSongFromAlbum = null;
  currentSoundFile = null;
  currentVolume = 50;
  seekBarFillRatio = 0;

  // Assign desired html elements in variables
  playButtonTemplate = '<a class="album-song-button">' + '<span class="ion-play"></span></a>';
  pauseButtonTemplate = '<a class="album-song-button">' + '<span class="ion-pause"></span></a>';
  playerBarPlayButton = '<span class="ion-play"></span>';
  playerBarPauseButton = '<span class="ion-pause"></span>';
  $previousButton = $('.main-controls .previous');
  $nextButton = $('.main-controls .next');
  $playPauseButton = $('.main-controls .play-pause');

  getSongNumberCell = function (number) {
      return $('.song-item-number[data-song-number="' + number + '"]');
  };

  // Write functions
  setSong = function (number) {
    // Assigns two variables with song number.
    if (currentSoundFile) {
      currentSoundFile.stop();
      // Pause any song currently playing.
    }
    currentlyPlayingSongNumber = parseInt(number);
    currentSongFromAlbum = currentAlbum.songs[number - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: [ 'mp3' ],
      preload: true
    });
  };

  seek = function (time) {
    // Function to change position in song to specific time.
    if (currentSoundFile) {
      currentSoundFile.setTime(time);
    }
  };

  // Function to set volume
  setVolume = function (volume) {
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
  };

  // Create a function that generates the the content for each row
  createSongRow = function (songNumber, songName, songLength) {
    template =
      '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + renderTime(songLength) + '</td>'
      + '</tr>';
    $row = $(template);
    // An event listener will listen for when the mouse clicks on a song #
    clickHandler = function () {
      songNumber = parseInt($(this).attr('data-song-number'));
      if (currentlyPlayingSongNumber !== null) {
        // Change to song number if there is click event on a playing cell
        getSongNumberCell(currentlyPlayingSongNumber).html(currentlyPlayingSongNumber);
      }
      if (songNumber !== currentlyPlayingSongNumber) {
        // Switch to new song In the click event where the clicked song isn't already playing
        setSong(songNumber);
        updateSeekBarWhileSongPlays();
        currentSoundFile.play();
        updatePlayerBarSong();
        $(this).html(pauseButtonTemplate);
      } else if (songNumber == currentlyPlayingSongNumber) {
        if (currentSoundFile.isPaused()) {
          // Switch to 'play' in the click event where the clicked song was paused
          currentSoundFile.play();
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          updateSeekBarWhileSongPlays();
        } else {
          // Switch to 'pause' in the click event where the clicked song was playing
          currentSoundFile.pause();
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
        }
      }
    };

    onHover = function (event) {
      songNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
      if (songNumber !== currentlyPlayingSongNumber) {
      // Make the play button appear if we are hovering over a song that isn't already playing
        $(this).find('.song-item-number').html(playButtonTemplate);
      }
    };

    offHover = function (event) {
      songNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
      if (songNumber !== currentlyPlayingSongNumber) {
        // Make the song number re-appear if we leave the song cell row
        $(this).find('.song-item-number').html(songNumber);
      }
    };
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
  };

  setCurrentAlbum = function (album) {
    currentAlbum = album;
    $albumTitle = $('.album-view-title');
    $albumArtist = $('.album-view-artist');
    $albumReleaseInfo = $('.album-view-release-info');
    $albumImage = $('.album-cover-art');
    $albumSongList = $('.album-view-song-list');
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();
    for (i = 0; i < album.songs.length; i += 1) {
      // Assign album.song[index] to its corresponding song#, name, and length
      $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
    $('.currently-playing .song-name').text(album.songs[0].title);
    $('.currently-playing .artist-name').text(album.artist);
    $('.currently-playing .artist-song-mobile').text(album.songs[0].title + " - " + album.artist);
    setTotalTimeInPlayerBar(renderTime(album.songs[0].duration));
  };

  setCurrentTimeInPlayerBar = function (currentTime) {
    $currentTimeElement = $('.seek-control .current-time');
    $currentTimeElement.text(currentTime);
  };

  setTotalTimeInPlayerBar = function (totalTime) {
    $totalTimeElement = $('.seek-control .total-time');
    $totalTimeElement.text(totalTime);
  };

  renderTime = function (timeInSeconds) {
    seconds = Number.parseFloat(timeInSeconds);
    seconds = Number.parseFloat(timeInSeconds);
    intSeconds = Math.floor(seconds);
    minutes = Math.floor(intSeconds / 60);
    remainingSeconds = intSeconds % 60;
    rendered = minutes + ':';
    if (remainingSeconds < 10) {
        rendered += '0';
    }
    rendered += remainingSeconds;
    return rendered;
  };

  updateSeekBarWhileSongPlays = function () {
    if (currentSoundFile) {
      currentSoundFile.bind('timeupdate', function (event) {
        seekBarFillRatio = this.getTime() / this.getDuration();
        var $seekBar = $('.seek-control .seek-bar');
        updateSeekPercentage($seekBar, seekBarFillRatio);
        setCurrentTimeInPlayerBar(renderTime(this.getTime()));
      });
    }
  };

  updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    // Write a generic function to update any seek bar with seekBarFillRatio
    offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
  };

  setupSeekBars = function () {
    // Determine seekBarFillRatio from click event
    $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function (event) {
      offsetX = event.pageX - $(this).offset().left;
      barWidth = $(this).width();
      seekBarFillRatio = offsetX / barWidth;
      if ($(this).parent().attr('class') === 'seek-control') {
        // Update music seeker if the clicked seek-control parent is selected
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        // Update volume seeker if clicked
        setVolume(seekBarFillRatio * 100);
      }
      updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function (event) {
      // Now use jQuery to find elements with class thumb and add event listener.
      var $seekBar = $(this).parent();
      $(document).bind('mousemove.thumb', function (event) {
        offsetX = event.pageX - $seekBar.offset().left;
        barWidth = $seekBar.width();
        seekBarFillRatio = offsetX / barWidth;
        if ($seekBar.parent().attr('class') === 'seek-control') {
          seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
          // if ($(this).parent().attr('class') === 'volume')
          setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($seekBar, seekBarFillRatio);
      });
      $(document).bind('mouseup.thumb', function () {
        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
      });
    });
  };

  updatePlayerBarSong = function () {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(renderTime(currentSongFromAlbum.duration));
  };

  trackIndex = function (album, song) {
    return album.songs.indexOf(song);
  };

  togglePlayFromPlayerBar = function () {
    if (currentSoundFile === null) {
    // If the song is currently paused
      setSong(1);
      updatePlayerBarSong();
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      getSongNumberCell(1).html(pauseButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPauseButton);
    } else if (currentSoundFile.isPaused()) {
      // If the song is paused, play the song.
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPauseButton);
    } else if (currentSoundFile) {
      // Display the play button on song row and player bar.
      currentSoundFile.pause();
      $('.main-controls .play-pause').html(playerBarPlayButton);
      getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
    }
  };

  nextSong = function () {
    // Function that performs when next button is clicked.
    currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex += 1;
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    lastSongNumber = currentlyPlayingSongNumber;
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
  };

  previousSong = function () {
    // Function that performs when previous button is clicked.
    currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex -= 1;
    if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
    }
    lastSongNumber = currentlyPlayingSongNumber;
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPauseButton);
    $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
  };

  // Now state what should show upon page load and define some event listeners
  $(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    setVolume(currentVolume);
    updateSeekPercentage($('.player-bar .seek-control .seek-bar'), seekBarFillRatio);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
  });

}());
