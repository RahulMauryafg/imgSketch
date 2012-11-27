'use strict';

/*
 * Main Controller
 * create a global scope with routing information
**/
function MainCtrl($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.route = $route;
}


function HomeCtrl($scope) {
	//controller stuff
}

/*
 * General Controller
 * Controlling general settings
**/
function GeneralCtrl($scope, $resource) {
	$scope.Settings = $resource('//gi.mediamagic.co.il/clients/avoda/stickers/resources/settings', {});
	$scope.settings = $scope.Settings.get(function (r) {
		$scope.settings = r;
		$scope.currentTemplate = $scope.settings.templates[0];
		$scope.Api = $resource($scope.settings.host + 'api/:action', {});
		$scope.Rest = $resource($scope.settings.host + 'resources/:collection/:id', {});
	});

	$scope.user = {
		token: 0,
		userId: 0
	};

	$scope.formData = {
		imageText: {posX: 0, posY: 0 },
		imageTemplate: 0
	};

	$scope.imageData = {};
	$scope.selectTemplate = function (index) {
		$scope.currentTemplate = angular.copy($scope.settings.templates[index]);
	};

	$scope.save = function () {
		if ($scope.user.token === 0) {
			$('#loginDialog').dialog('open');
		} else {
			$scope.sendImage($scope.formData);
		}
	};

	$scope.$on('loginUser', function (e, a) {
		$scope.user = a;
		$('#loginDialog').dialog('close');
		$scope.sendImage($scope.formData);
	});

	$scope.sendImage = function (obj) {
		obj.token = $scope.user.token;
		$scope.Rest.save({collection: 'image'}, obj, function (response) {
			$scope.imageData = response;
			$('#imageDialog').dialog('open');
		});
	};
}

function UserCtrl($scope, $resource) {
	$scope.loginData = {};
	$scope.registerData = {};
	$scope.error = false;
	$scope.login = function () {
		//$scope.loginData.password = jQuery.sha1($scope.loginData.password);
		$scope.Api.save({action: 'login'}, $scope.loginData, function (response) {
			if (response.error) {
				$scope.error = true;
				$scope.errorMsg = response.description;
				return;
			}
			$scope.$emit('loginUser', response);
		});
	};

	$scope.registerData = {};
	$scope.register = function () {
		console.log($scope.registerData);
		$scope.Rest.save({collection: 'user'}, $scope.registerData, function (response) {
			console.log(response);
		});
	};
}

function ImageCtrl($scope, $resource) {
}

function GalleryCtrl($scope, $resource) {

}
