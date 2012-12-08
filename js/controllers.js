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
	$scope.config = {
		production: false,
		hosts: {
			dev: '//gi.mediamagic.co.il/clients/avoda/printingCreator',
			production: '//212.29.200.117'
		},
		payHost: {
			dev: 'http://dev.shelly.org.il/checkout?',
			production: 'http://shelly.org.il/checkout?'
		},
		school: true,
		development: false,
		fb: true,
		selectType: true,
		defaultType: 'Shirt',
		defaultSize: 'M',
		gallery: {
			perPage: 4
		}
	}
	$scope.host = ($scope.config.production) ? $scope.config.hosts.production : $scope.config.hosts.dev;
}

/*
 * General Controller
 * Controlling general settings
**/

function GeneralCtrl($scope,$resource){
	//Constructor
	//TODO: init formdata object prior to settings load, update imageTemplate property after settings init
	$scope.Settings = $resource($scope.host + '/resources/settings', {});
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
				name: '',
				phone: '',
				email: '',
				street: '',
				city: '',
				zip: '',
				houseNumber: '',
				apartmentNumber: '',
				personId: 0,
				amount: 40,
				payments: 1

			},
			order: {
				type: $scope.config.defaultType,
				size: $scope.config.defaultSize
			}
		};
		$scope.master = angular.copy($scope.formData);
	});

	$scope.imageData = {};
	$scope.currentStep = 1;
	$scope.toggleDraw = false;
	$scope.toggleText = false;
	$scope.photoId = 0;

	$scope.updateUserFromFB = function(cb){
		FB.api('/me', function(response) {
			$scope.formData.user.fbUid = response.id;
			$scope.formData.user.email = response.email;
			$scope.formData.user.name = response.name;
			cb();
		});
	}

	$scope.$on('photofinish', function(e, obj){
		$scope.photoId = obj.id;
		$scope.downloadUrl = obj.downloadUrl;
	});

	//EVENTS
	$scope.$on('reset', function(){
		$scope.formData = angular.copy($scope.master);
		$scope.sketchpad.clear();
	});

	$scope.sketchpad = Raphael.sketchpad("editor", {width: 330, height: 220, editing: true});

	$scope.sketchpad.change(function() {
		var json = $scope.sketchpad.json();
		(json.length > 2) ?
			$("#sketchData").val(escape($('#editor').html())).trigger('input').trigger('change') :
			$("#sketchData").val('').trigger('input').trigger('change');
	});
	
	//Form flow controls
	$scope.selectTemplate = function (index) {
		$scope.currentTemplate = angular.copy($scope.settings.templates[index]);
		$scope.formData.payload.imageTemplate = $scope.currentTemplate.id;
	};

	$scope.step = function(step){
		if ($scope.config.selectType === true) {
			$scope.currentStep = step;
			if (step >= 2){
				$scope.toggleDraw = false;
				$scope.toggleText = true;
				$scope.sketchpad.editing(false);
			} else {
				$scope.toggleText = false;
			}
		} else {
			$scope.formData.order.type = $scope.config.defaultType;
			$scope.formData.order.size = $scope.config.defaultSize;
			$scope.order($scope.formData.order.type);
		}
	}

	$scope.stepCheck = function(step){
		return (step === $scope.currentStep);
	}

	$scope.order = function(type){
		if (type != undefined && type === 'dl'){
			$scope.formData.order.type = 'FacebookCover';
		}
		if ($scope.config.fb) {
			$('#loginDialog').dialog('open');
			$scope.$broadcast('fbLogin');
		} else {
			$('#orderDialog').dialog('open');
		}
	}

	$scope.toggleEditMode = function(mode){
		if (mode === 'draw') {
			$scope.toggleDraw = $scope.toggleText = true;
			$scope.sketchpad.editing(true);
		} else if (mode === 'text') {
			$scope.toggleDraw = $scope.toggleText = false;
			$scope.sketchpad.editing(false); 
		}
	}

	$scope.clearDraw = function(){
		//todo: fix $apply sync issue
		$scope.formData.payload.data = '';
		$scope.sketchpad.clear();
	}
}

function LoginCtrl($scope, $resource) {

	$scope.fbMode = function(){
		var mode = ($scope.formData != undefined && $scope.formData.order.type === 'FacebookCover') ? false : true;
		return mode;
	}


	$scope.uploading = false;
	$scope.fbState = 0;
	$scope.$on('fbLogin', function(){
		FB.getLoginStatus(function(response){
			if (response.status === 'connected'){
				console.log('logged in and authorized')
				$scope.fbState = 2;
				$scope.fbProcess();
			} else if (response.status === 'not_authorized') {
				console.log('logged in not authorized')
				$scope.fbState = 1;
			} else {
				console.log('not logged in to facebook');
				$scope.fbState = 0;
			}
		});
	});

	$scope.fbProcess = function(){
		if ($scope.fbState === 2) {
			$scope.updateUserFromFB(function(){
				if ($scope.fbMode() === true) {
					$scope.order();
				} else if ($scope.fbMode() === false){
					$scope.Rest.save({collection: 'order'}, $scope.formData, function(response){
						$scope.uploading = true;
						FB.api('/me/photos', 'post', { message: 'test', url: 'http:' + $scope.host + '/Resources/Printings/' + response.downloadUrl.split('=')[1]}, function(resp){
							if(resp.id != undefined){
								//FB.api('/'+ resp.id +'/tags','post', {to: $scope.formData.user.fbUid }, function(){
									$scope.uploading = false;
									$scope.$emit('photofinish', {id: resp.id, downloadUrl: response.downloadUrl});
									$scope.$apply(function(){
										$('#loginDialog').dialog('close');
										$('#thankyouDialog').dialog('open');
									});
								//});
							}
						});
					});
				}
			});
		} else if ($scope.fbState === 1) {
			FB.login(function(response) {
				if (response.authResponse) {
					$scope.$emit('fbLogin');
				}
			}, {scope:'email,publish_stream,user_photos'});
		}
	}

	$scope.order = function(type){
		$scope.$apply(function(){
			$('#loginDialog').dialog('close');
			$('#orderDialog').dialog('open');
		});
	}
}


function GalleryCtrl($scope, $resource) {
	$scope.currentImage = {};
	$scope.Gallery = $resource($scope.host + '/resources/images', {});
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

function OrderCtrl($scope, $location, $window){
	$scope.showSizes = function(){
		if ($scope.formData != undefined && $scope.formData.order.type === 'Shirt') {
			return false;
		} else {
			return true;
		}
	}

	$scope.encQuery = function(data) {
		var ret = [];
		for (var d in data)
		ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
		return ret.join("&");
	}

	$scope.register = function(){
		if ($scope.config.development === false) {
			$scope.orderForm.$invalid = true;
			$scope.Rest.save({collection: 'order'}, $scope.formData, function(response){
				$('#orderDialog').dialog('close');
				var sendObj = {
					p_IDNumber: $scope.formData.user.personId,
					p_amount_agorot: $scope.formData.user.amount * 100,
					p_payment_purpose: 'donate_campaign',
					p_redirect: $location.$$absUrl,
					p_title: 'תרומה למפלגת העבודה',
					p_payments_enabled: 1,
					p_payments_number:  $scope.formData.user.payments,
					p_OrderID: response.orderId
				}
				var urlParams = $scope.encQuery(sendObj);
				var payHost  = ($scope.config.production) ? $scope.config.payHost.production : $scope.config.payHost.dev;
				var redirectUrl = payHost + urlParams;
				$window.location = redirectUrl;
				$scope.reset();

			});
		}
		else {
			$scope.$apply(function(){
				$('#orderDialog').dialog('close');
				$('#thankyouDialog').dialog('open');
			});
			$scope.reset();
		}
	}

	$scope.checkOrderType = function(){
		if ($scope.formData != undefined && $scope.formData.order.type === 'FacebookCover') {
			return true;
		} else {
			return false;
		}
	}
	$scope.reset = function(){
		$scope.validState = $scope.orderForm.$invalid;
		$scope.step(1);
		$scope.toggleEditMode('text');
		$scope.$emit('reset');
	}
}