(function () {
    "use strict";
    var i;
    function forEach(array, callback) {
        for (i = 0; i < array.length; i += 1) {
            callback(i);
        }
    }
}());