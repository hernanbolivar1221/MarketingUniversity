// Scope Goblal

app.run(function($rootScope) {
  	$rootScope.btnSingUp = true;
	$rootScope.btnLogout = false;
});

// config JSON

// Api profile
app.controller("profile_api",function($scope, $http){

	if(localStorage.dataUser){
		$scope.dataUser = JSON.parse(localStorage.dataUser);
	}else{
		location.href = "#/";
	}



});

// Api Login
var user = null;
app.controller("login_api", function($scope, $http){
	if(localStorage.dataUser){
		location.href = "#/profile";
	}
	
	// URL Constant
	jsonData = config;

	$scope.singUp = function(){

		// Fields
		var userName = $scope.userName,
			userPassword = $scope.userPassword;

		// validation fields	
		$scope.alertFields = false;	

		if(userName == undefined || userPassword == undefined || userName == "" || userPassword == ""){
			$scope.alertFields = true;	
			$scope.alertData = false;
		}else{

		// ajax for authentication	
			ajaxAuth($http, $scope,userName, userPassword);
		}
	}

	$scope.createAccount = function(){
		// Fields
		var userNameNew = $scope.userNameNew,
			userPasswordNew = $scope.userPasswordNew,
			userEmail = $scope.userEmail;

		// ajax for create account
		ajaxAuth($http, $scope, userNameNew, userPasswordNew,userEmail);
	}

});

// functions 

function ajaxAuth($http, $scope, username, userpassword, email){
	url = ( !email ? config.SERVICE_SERVER +"/api/json/json_login_dare/?callback=JSON_CALLBACK&username=" + username + "&password=" + userpassword : config.SERVICE_SERVER+"/api/json/json_login_dare/?callback=JSON_CALLBACK&name=" + username + "&password=" + userpassword + "&email="+ email )
	$http.jsonp(url).success(function(response){
		if(response.status == "ok"){
			$http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username).success(function(respuesta){
					//console.log(JSON.stringify(respuesta));
					location.reload();
					localStorage.dataUser = JSON.stringify(respuesta);
					$(".modal--ingreso").modal("show").toggle();
					location.href = "#/profile";

				});
		}else{
			$scope.alertData = true;	
		}
	});
}

// controllers additionals

app.controller("navbar_functions", function($scope, $http){
	$scope.menuOpen = false;
	$scope.showMenu = function(){
		$scope.menuOpen = $scope.menuOpen ? false : true;
	}

	if(localStorage.dataUser){
		$scope.btnSingUp = false;
		$scope.btnLogout = true;
	}

	$scope.logout = function(){
		localStorage.clear();
		location.reload();
		//
		//TODO: create on KME a service to logout
		/**
		$http.post("http://kmelx.com/api/json_logout/").success(function(response){
			console.log(response);
		});*/
	}

});




