// controller view profile
app.controller("service", function($scope, serviceEmpty){
	$scope.info = serviceEmpty.data();
});

// Api profile
app.controller("profile_api",function($scope, $http){
	if(localStorage.dataUser){
		console.log(localStorage.dataUser);
		$scope.dataUser = JSON.parse(localStorage.dataUser);
	}else{
		location.href = "#/";
	}


});

// Api Login
var user = null;
app.controller("login_api", function($scope, $http){

	$scope.singUp = function(){
		var userName = $scope.userName,
			userPassword = $scope.userPassword;


		$http.jsonp("http://kmelx.com/api/json/json_login_dare/?callback=JSON_CALLBACK&username=" + userName + "&password=" + userPassword).success(function(response){
			if(response.status == "ok"){
				$http.jsonp("http://kmelx.com/api/get_profile_data/?callback=JSON_CALLBACK&username=hbolivar").success(function(respuesta){
					//console.log(JSON.stringify(respuesta));
            		localStorage.dataUser = JSON.stringify(respuesta);
            		$(".modal--ingreso").modal("show").toggle();
            		location.href = "#/profile";
        		});
			}
		});
	}

});

// functions 

app.controller("navbar_functions", function($scope){
	$scope.menuOpen = false;
	$scope.showMenu = function(){
		$scope.menuOpen = $scope.menuOpen ? false : true;
	}
});




