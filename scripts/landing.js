(function () {
    "use strict";
    
    var points, i, revealPoint, animatePoints, sellingPoints, scrollDistance;
    
    points = document.getElementsByClassName('point');
    
    revealPoint = function (i) {
        points[i].style.opacity = 1;
        points[i].style.transform = "scaleX(1) translateY(0)";
        points[i].style.msTransform = "scaleX(1) translateY(0)";
        points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    
    function forEach(array, callback) {
        for (i = 0; i < array.length; i += 1) {
            callback(i);
        }
    }
    
    forEach(points, revealPoint);
    
    window.onload = function () {
        if (window.innerHeight > 950) {
            animatePoints(points);
        }
        sellingPoints = document.getElementsByClassName('selling-points')[0];
        
        scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
        window.addEventListener('scroll', function (event) {
            if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
                animatePoints(points);
            }
        });
    };
}());