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
		.when('/courseDetails', {
			templateUrl: 'views/courseDetail.html'
		})
		.when('/allCertificates', {
			templateUrl: 'views/allCertificates.html'
		})
		.when('/allCertificates', {
			templateUrl: 'views/allCertificates.html'
		})
		.when('/jobs', {
			templateUrl: 'views/bagJobs.html'
		})
		.when('/detailsJobs', {
			templateUrl: 'views/detailsJobs.html'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
});