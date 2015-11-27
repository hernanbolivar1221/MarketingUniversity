// Scope Goblal
app.run(function($rootScope, $location, $route) {
  	$rootScope.btnSingUp = true;
	$rootScope.btnLogout = false;
	/*
	* TODO: Remove next code when update is ready
	*/
	$rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
    });        

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
        	location.href = "#/profile";
        }
    });
   /*
   * END TODO
   */
});

// config JSON

// Api profile
app.controller("profile_api",function($scope, $http){

	if(localStorage.dataUser){
		dataUser = JSON.parse(localStorage.dataUser);
		dataUser.photo == "" ? dataUser.photo = "images/bullet3.png" : dataUser.photo;
		$scope.dataUser = dataUser;
	}else{
		location.href = "#/";
	}

    // Jquery
    	setTimeout(function(){
       		$(".nav-tabs").find("ul").addClass("nav-perfil");
    	});


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
	 $scope.FBLogin = function (register) {
	 	FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
        FB.api('/me?fields=name,email', function (response) {
        	        username=response.email;
          	        username=username.replace("@","");
          	        username=username.replace(".","");
          	        if (register){
                    ajaxRegister($http, $scope,username, response.email,response.email);
          	        }else{
          	        ajaxAuth($http, $scope,username, response.email);	
          	        }
                    
                    });
        }
        else {
        FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me?fields=name,email', function (response) {
                        console.log(response);
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            },{scope: 'email'});
        }
        });




            
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
function sendRegisterNotification($http,email){
    subject = config.TEMPLATES.registerTemplate.subject;
    template = config.TEMPLATES.registerTemplate.template;
    body = config.TEMPLATES.registerTemplate.body;
    from = config.TEMPLATES.registerTemplate.from; 
    url = config.SERVICE_SERVER + "/api/send_email/?callback=JSON_CALLBACK&subject="+subject+"&body="+body+"&from="+from+"&email="+email+";&template="+template;
    $http.jsonp(url).success(function(respuesta){
    	console.log(respuesta);
    });

}
// functions 
function ajaxAuth($http, $scope, username, userpassword, email){
	if(!email){
	    url = config.SERVICE_SERVER + "/api/json/json_login_dare/?calback=JSON_CALLBACK&username="+username+"&password="+userpassword;
	    console.log(url);
	    register=false;
	}else{

	    url =  config.SERVICE_SERVER+"/api/registerNew/?callback=JSON_CALLBACK&username=" + username + "&password=" + userpassword + "&email="+ email;
	    register = true;
	}
	$http.jsonp(url).success(function(response){
		
		if(response.status == "ok"){
			$http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username).success(function(respuesta){
					//console.log(JSON.stringify(respuesta));
					//location.reload();
					localStorage.dataUser = JSON.stringify(respuesta);
					$(".modal--ingreso").modal("show").toggle();
					location.href = "#/profile";

				});
		    if(register){
                        sendRegisterNotification($http,email);
                        register = false;
		    }else{
                    }

		}else{
			if(response.error != undefined){
				$("#errorLogin").html(" Nombre de usuario o correo ya existen. <br> + <br>"+ response.error);
				$scope.alertError = true;
			}else{
				$scope.alertData = true;	
			}	
		}
		});
}
function ajaxRegister($http, $scope, username, userpassword, email){
	    url =  config.SERVICE_SERVER+"/api/registerNew/?callback=JSON_CALLBACK&username=" + username + "&password=" + userpassword + "&email="+ email;
	    register = true;
	$http.jsonp(url).success(function(response){
		if(response.status == "ok"){
			$http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username).success(function(respuesta){
					//console.log(JSON.stringify(respuesta));
					location.reload();
					localStorage.dataUser = JSON.stringify(respuesta);
					$(".modal--ingreso").modal("show").toggle();
					location.href = "#/profile";

				});
		    if(register){
                        sendRegisterNotification($http,email);
                        register = false;
		    }else{
                    }

		}else{
			if(response.error != undefined){
				$("#errorLogin").html(" Nombre de usuario o correo ya existen. <br> + <br>"+ response.error);
				$scope.alertError = true;
			}else{
				$scope.alertData = true;	
			}	
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
		$scope.hideMenu = true;
		
	}else{
		$scope.hideMenu = false;
	}
	

	$scope.logout = function(){
		
		
		$http.jsonp("http://kmelx.com/api/json_logout/").success(function(response){
			console.log(response);
		});
		localStorage.clear();
		location.href = "#/";
		location.reload();
	}


});


app.controller("footer", function($scope){

	if(localStorage.dataUser){	
		$scope.subscription = false;
	}else{
		$scope.subscription = true;
	}
});









