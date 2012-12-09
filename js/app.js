'use strict';
angular.module('sketchApp', ['ngResource', 'ui']).

config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
        //when('/home', {templateUrl: 'views/Home.html', controller: HomeCtrl, name:'Main'}).
		when('/main', {templateUrl: 'views/Main.html', controller: GeneralCtrl, name:'Main'}).
		//when('/about', {templateUrl: 'views/About.html', controller: AboutCtrl, name: 'About'}).
		//when('/gallery', {templateUrl: 'views/Gallery.html', controller: GalleryCtrl, name:'Gallery'}).
		otherwise({redirectTo: '/main'});
	//$locationProvider.html5Mode(true);
}]).
directive('openDialog', function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            var dialogId = '#' + attr.openDialog;
            elem.bind('click', function(e) {
                $(dialogId).dialog('open');
            });
        }
    };
}).
filter('orderType', function() {
    return function(input) {
        var out = "";
        if (input === 'Sticker')
            out = 'סטיקר';
        if (input === 'Shirt')
            out = 'חולצה'
        if (input === 'VehicleSunScreen')
            out = 'צילון לרכב'
        if (input === 'Shimshonit')
            out = 'שמשונית'
        return out;
    }
});