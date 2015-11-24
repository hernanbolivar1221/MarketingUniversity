// Scope Goblal

app.run(function($rootScope) {
  	$rootScope.btnSingUp = true;
	$rootScope.btnLogout = false;
});

var counter = 0;

// controller view profile
app.controller("service", function($scope, serviceEmpty){
	$scope.info = serviceEmpty.data();
});

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
	$scope.singUp = function(){

		// Fields
		var userName = $scope.userName,
			userPassword = $scope.userPassword;

		// validation fields	
		$scope.alertFields = false;	

		if(userName == undefined || userPassword == undefined){
			$scope.alertFields = true;	
		}

		// ajax for authentication	
		ajaxAuth($http, userName, userPassword);
	}

	$scope.createAccount = function(){
		// Fields
		var userNameNew = $scope.userNameNew,
			userPasswordNew = $scope.userPasswordNew,
			userEmail = $scope.userEmail;

		// ajax for create account
		ajaxAuth($http, userNameNew, userPasswordNew,userEmail);
	}

});

// functions 

function ajaxAuth($http, username, userpassword, email){
	url = ( !email ? "http://kmelx.com/api/json/json_login_dare/?callback=JSON_CALLBACK&username=" + username + "&password=" + userpassword : "http://kmelx.com/api/json/json_login_dare/?callback=JSON_CALLBACK&username=" + username + "&password=" + userpassword + "&email="+ email )
	$http.jsonp(url).success(function(response){
		if(response.status == "ok"){
			$http.jsonp("http://kmelx.com/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username).success(function(respuesta){
					//console.log(JSON.stringify(respuesta));
					location.reload();
					localStorage.dataUser = JSON.stringify(respuesta);
					$(".modal--ingreso").modal("show").toggle();
					location.href = "#/profile";

				});
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




