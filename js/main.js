// ---------------------- script Nuevosmedios ------------------------------

var app = angular.module('App', ['ngRoute','ngAnimate','ui.bootstrap','dibari.angular-ellipsis','truncate']);

// -- rutas en Angular

app.config(function($routeProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'main'
		})
		.when('/profile', {
			templateUrl: 'views/profile.html'
		})
		.when('/course/:uuid/details', {
			templateUrl: 'views/courseDetail.html',
			controller : "courseDetails"
		})
		.when('/certificate/:uuid/details', {
			templateUrl: 'views/certificates/detailCertification.html',
			controller : "certificates"
		})
		.when('/allCourses', {
			templateUrl: 'views/allCoursesPublic.html',
			controller: "allCourses"
		})
		.when('/allCertificates', {
			templateUrl: 'views/certificates/allCertificates.html',
			controller: "certificates"
		})
		.when('/jobs', {
			templateUrl: 'views/bagJobs.html'
		})
		.when('/detailsJobs', {
			templateUrl: 'views/detailsJobs.html'
		})
		.when('/course/:uuid/simple', {
			templateUrl: 'views/courses/simpleCourse.html',
			controller: 'simpleCourse'
		})
		.otherwise({ 
			redirectTo: '/' 
		});
});
