// ---------------------- script Nuevosmedios ------------------------------

var app = angular.module('App', ['ngRoute','ngAnimate','ui.bootstrap']);

// -- rutas en Angular

app.config(function($routeProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html'
		})
		.when('/profile', {
			templateUrl: 'views/profile.html'
		})
		.when('/allCoursesPublic', {
			templateUrl: 'views/allCoursesPublic.html'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
});