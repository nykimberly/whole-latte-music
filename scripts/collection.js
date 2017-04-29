var buildCollectionItemTemplate, template, $collectionContainer, i;

// Wrap template in a function toreturn markup string as jQuery object.
// When naming action-oriented functions, start with a verb.
buildCollectionItemTemplate = function() {

  // Store collectionItemTemplate to template
  template =
    '<div class = "collection-album-container column fourth">'
  + ' <img src = "assets/images/album_covers/01.png"/>'
  + ' <div class = "collection-album-info caption">'
  + '    <p>'
  + '      <a class="album-name" href="album.html"> The Colors </a>'
  + '      <br/>'
  + '      <a href="album.html"> Pablo Picasso </a>'
  + '      <br/>'
  + '      X songs'
  + '      <br/>'
  + '    </p>'
  + '  </div>'
  + '</div>';

  // Wrap template in a jQuery object
  return $(template);
};

// Refactoring: $(window).load() is jQuery equivalent of window.onload
$(window).load(function() {

  // Refactoring: shorter jQuery alternative to DOM selection
  // '$' used to indicate jQuery-related variable
  $collectionContainer = $('.album-covers');

  // Empty() method removes all elements from the elements it's called on.
  $collectionContainer.empty();

  // To display our 12 albums, we will use the same for loop
  for (i = 0; i < 12; i += 1) {

    // However, we will use append method rather than +=.
    var $newThumbnail = buildCollectionItemTemplate();
    $collectionContainer.append($newThumbnail);
  }
});
