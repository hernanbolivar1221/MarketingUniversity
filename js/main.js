// ---------------------- script Nuevosmedios ------------------------------

var app = angular.module('App', ["ngRoute"]);

// -- rutas en Angular

app.config(function($routeProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html'
		})
		.when('/profile', {
			templateUrl: 'views/profile.html'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
});