'use strict';

/*
 * Main Controller
 * create a global scope with routing information
**/
function MainCtrl($scope, $route, $routeParams, $location, $window) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.route = $route;
	$scope.config = {
		production: false,
		hosts: {
			dev: '//node.mmdev.co.il:8080',
			staging: '//gi.mediamagic.co.il/clients/avoda/printingCreator',
			production: '//www.myshelly.org.il'
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

	if ($location.$$host == 'node.mmdev.co.il')
		$scope.config.production = 'dev';
	else if ($location.$$host == 'gi.mediamagic.co.il')
		$scope.config.production = 'staging';
	else 
		$scope.config.production = 'production';

	if ($scope.config.production === 'dev')
		$scope.host = $scope.config.hosts.staging;
	else if ($scope.config.production === 'staging')
		$scope.host = $scope.config.hosts.staging;
	else 
		$scope.host = $scope.config.hosts.production;

	$scope.zoom = function(order){
		$scope.currentItem = order;
		setTimeout(function(){
			$('#imageDialog').dialog('open');
		},100);
	}
}

function GeneralCtrl($scope, $location, $resource){
	$scope.Rest = $resource($scope.host + '/admin/resources/:action', {});
	$scope.token = $scope.Rest.get({action:'getToken'}, function(resp){
		$scope.rest = $resource($scope.host + '/admin/resources/orders', {token:resp.token}, {update:{method:'PUT', token: resp.token}});
		$scope.rest.query({}, function(resp){
			$scope.orders = resp;
			$scope.search = {
				limit: 3,
				filter: {
					status: ''
				}
			};
		});
	});

	$scope.toggleStatus = function(order){
		var _status = !order.status;
		var obj = { id:order.id, status : _status }
		$scope.rest.update(obj, function(response){
			order.status = response.status;
		});
	}

	$scope.tooltip = false;
	$scope.toggleTooltip = function(){
		$scope.tooltip = !$scope.tooltip;
	}
}