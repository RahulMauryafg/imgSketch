'use strict';
angular.module('Admin', ['ngResource', 'ui']).

config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.
		when('/main', {templateUrl: 'views/main.html', controller: GeneralCtrl, name:'Main'}).
		otherwise({redirectTo: '/main'});
}])