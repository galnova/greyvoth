var gItems = angular.module('globalItems', []);

var app = angular.module('app', ['globalItems']);



gItems.controller('globalItemController', function($scope) {
	
$scope.globalItems = [
	
{
	
	id: 10
	
},{
	
	id: 8
	
	}

	];

});