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
	$scope.settings = {
		development: false,
		fb: false,
		gallery: {
			perPage: 4
		}
	}
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
		$scope.formData = {
			payload: {
				imageText: {posX: 320, posY: 28, width:"290", height:"190" },
				imageTemplate: $scope.currentTemplate.id,
				imageData: {posX: 283, posY: 10, width: "330", height: "220", data: ''}
			},
			user: {
				fbUid: 0,
				name: 'first last',
				phone: '0501234567',
				email: 'mail@domain.com',
				street: 'defaultstreet',
				city: 'city',
				zip: '12345',
				houseNumber: '1',
				apartmentNumber: '1a'
			},
			order: {
				type: 'Shirt'
			}
		};
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

	$scope.imageData = {};
	$scope.currentStep = 1;
	$scope.toggleDraw = false;
	$scope.toggleText = false;
	
	//Form flow controls
	$scope.selectTemplate = function (index) {
		$scope.currentTemplate = angular.copy($scope.settings.templates[index]);
		$scope.formData.payload.imageTemplate = $scope.currentTemplate.id;
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

	$scope.order = function(type){
		if (type != undefined && type === 'dl'){
			$scope.formData.order.type = 'FacebookCover';
		}
		if ($scope.settings.fb) {
			$('#loginDialog').dialog('open');	
		} else {
			$('#orderDialog').dialog('open');
		}
	}

	$scope.toggleEditMode = function(){
		$scope.toggleDraw = !$scope.toggleDraw;
		$scope.toggleText = !$scope.toggleText;
		$scope.sketchpad.editing($scope.toggleDraw);
	}
}

function LoginCtrl($scope, $resource) {
	$scope.updateUser = function(){
		//update user
		$scope.order();
	}
	$scope.order = function(type){
		$('#loginDialog').dialog('close');
		$('#orderDialog').dialog('open');
	}
}


function GalleryCtrl($scope, $resource) {
	$scope.currentImage = {};
	$scope.Gallery = $resource('//gi.mediamagic.co.il/clients/avoda/printingCreator/resources/images', {});
	$scope.gallery = $scope.Gallery.query(function(r){
		$scope.gallery = r;
		$scope.galleryData = {
			total: r.length,
			pages: Math.ceil(r.length/$scope.settings.gallery.perPage),
			currentPage: 1,
			startIndex: 0,
			endIndex: $scope.settings.gallery.perPage
		}
		$scope.getCurrentSet($scope.galleryData.currentPage);
	});

	$scope.zoom = function(index){
		$scope.currentImage = $scope.currentSet[index];
		$('#galleryDialog').dialog('open');
	}

	$scope.page = function(action){
		if (action === 'next' && $scope.galleryData.currentPage < $scope.galleryData.pages)
			$scope.galleryData.currentPage++;
		if (action === 'prev' && $scope.galleryData.currentPage > 1)
			$scope.galleryData.currentPage--;
		$scope.getCurrentSet($scope.galleryData.currentPage);
	}

	$scope.getCurrentSet = function(page){
		var newStartindex = (page-1)*$scope.settings.gallery.perPage;
		$scope.currentSet = $scope.gallery.slice(newStartindex,newStartindex + $scope.settings.gallery.perPage);
	}
}

function paymentCtrl(){
}


function OrderCtrl($scope){
	$scope.downloadUrl = null;
	$scope.showSizes = function(){

		if ($scope.formData != undefined && $scope.formData.order.type === 'Shirt') {
			return false;
		} else {
			return true;
		}
	}
	$scope.register = function(){
		if ($scope.development == false) {
			$scope.Rest.save({collection: 'order'}, $scope.formData, function(response){
				if ($scope.formData.order.type === 'FacebookCover')
					$scope.downloadUrl = response.downloadUrl;
				$('#orderDialog').dialog('close');
				$('#thankyouDialog').dialog('open');
			});
		}
		else {
			console.log($scope.formData);
			$('#orderDialog').dialog('close');
			$('#thankyouDialog').dialog('open');
		}
	}

	$scope.checkOrderType = function(){
		if ($scope.formData != undefined && $scope.formData.order.type == 'FacebookCover'){
			return true;
		} else {
			return false;
		}
	}
}