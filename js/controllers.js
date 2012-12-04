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

/*
 * General Controller
 * Controlling general settings
**/

function GeneralCtrl($scope,$resource){
	//Constructor
	$scope.Settings = $resource('//gi.mediamagic.co.il/clients/avoda/printingCreator/resources/settings', {});
	$scope.settings = $scope.Settings.get(function(r){ 
		$scope.settings = r;
		$scope.currentTemplate = $scope.settings.templates[0];
		$scope.Api = $resource($scope.settings.host + 'api/:action', {});
		$scope.Rest = $resource($scope.settings.host + 'resources/:collection/:id', {});
	});

	$scope.sketchpad = Raphael.sketchpad("editor", {
		width: 330,
		height: 220,
		editing: true
	});

	$scope.sketchpad.change(function() {
		var json = $scope.sketchpad.json();
		(json.length > 2) ?
			$("#sketchData").val(escape($('#editor').html())).trigger('input').trigger('change') :
			$("#sketchData").val('').trigger('input').trigger('change');
	});

	$scope.formData = {
		payload: {
			imageText: {posX: 0, posY: 0 },
			imageTemplate: 0
		},
		user: {
		},
		order: {
		}
	};

	$scope.imageData = {};
	$scope.currentStep = 1;
	$scope.toggleDraw = false;
	$scope.toggleText = false;
	
	//Form flow controls
	$scope.selectTemplate = function (index) {
		$scope.currentTemplate = angular.copy($scope.settings.templates[index]);
	};
	$scope.step = function(step){
		$scope.currentStep = step;
		if (step >= 2){
			$scope.toggleDraw = false;
			$scope.toggleText = true;
			$scope.sketchpad.editing(false);
		} else {
			$scope.toggleText = false;
		}
	}

	$scope.stepCheck = function(step){
		return (step === $scope.currentStep);
	}

	$scope.toggleEditMode = function(){
		$scope.toggleDraw = !$scope.toggleDraw;
		$scope.toggleText = !$scope.toggleText;
		$scope.sketchpad.editing($scope.toggleDraw);
	}

	//submit controls
	$scope.sendImage = function(){
		_obj.token = $scope.user.token;
		$scope.Rest.save({collection: 'image'}, _obj, function(response){
			//$('#imageDialog').dialog('open');
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
	}
}

function paymentCtrl(){
}

function ImageCtrl($scope, $resource) {
}

function GalleryCtrl($scope, $resource) {

}
