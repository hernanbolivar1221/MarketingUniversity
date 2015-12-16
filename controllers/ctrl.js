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
                    kmeAPI($http, $scope,username,response.name,response.email,register);
          	        
                    
                    });
        }
        else {
        FB.login(function (response) {
                if (response.authResponse) {
                    FB.api('/me?fields=name,email', function (response) {
                       username=response.email;
          	           username=username.replace("@","");
          	           username=username.replace(".","");
                       kmeAPI($http, $scope,username,response.name,response.email,register);
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
    });

}
// functions 
function ajaxAuth($http, $scope, username, userpassword, email){
	if(!email){
	    url = config.SERVICE_SERVER + "/api/json/json_login_dare/?callback=JSON_CALLBACK&username="+username+"&password="+userpassword;
	    register=false;
	}else{

	    url =  config.SERVICE_SERVER+"/api/registerNew/?callback=JSON_CALLBACK&username=" + username + "&password=" + userpassword + "&email="+ email;
	    register = true;
	}
	$http.jsonp(url).success(function(response){
		
		if(response.status == "ok"){
			$http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username).success(function(respuesta){
					//console.log(JSON.stringify(respuesta));

					localStorage.dataUser = JSON.stringify(respuesta);
					$(".modal--ingreso").modal("show").toggle();
   					location.href = "#/profile";
					location.reload();

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


  function kmeAPI($http, $scope,username,name,email,register) {
      var uri=config.SERVICE_SERVER+'/api/login_kmeadmin/?callback=JSON_CALLBACK&username='+email+'&name='+ name +'&password='+username;
      $http.jsonp(encodeURI(uri)).success(function(response){
		if(response.status == "logged"){
			$http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username).success(function(respuesta){
					//console.log(JSON.stringify(respuesta));
					localStorage.dataUser = JSON.stringify(respuesta);
					$(".modal--ingreso").modal("show").toggle();
   					location.href = "#/profile";
					location.reload();

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
		
		
		$http.jsonp(config.SERVICE_SERVER+"/api/json_logout/").success(function(response){
			
		});
		    localStorage.clear();
		    location.href = "#/";
		    location.reload();
	}


	$scope.activeMenu = function(event){
		$(event.target).parent().siblings().removeClass("active");
		$(event.target).parent().addClass("active");

	}


});


app.controller("footer", function($scope){

	if(localStorage.dataUser){	
		$scope.subscription = false;
	}else{
		$scope.subscription = true;
	}
});


// controller  for Courses 

app.controller("coursesPublic", function($scope, $timeout){

	$scope.seeCoursePublic = function(){

		$timeout(function(){
			$('html,body').animate({scrollTop: 0}, 1000);
		},100);
	}

	var jsonCoursePublic = [
	{ 
		nameCourse: "Intro al Marketing Digital",
		description: "Aprende e Interioriza los 10 principales conceptos básicos del Marketing y la Comunicación Digital.",
		imageCourse: "images/Marketing-Digital-101.png",
		timeDuration: "10 Horas",
		previwLink: "",
		tutor: "Nathalia Plaza",
		imageTutor: "images/profesor-nathalia-plaza.jpg",
		score: 5
	},
	{
		nameCourse: "Estrategia Digital",
		description: "Aprende a planear una estrategia de Marketing Digital partiendo de los objetivos estratégicos de tu negocio.",
		imageCourse: "images/Estrategia-Marketing-Digital.png",
		timeDuration: "20 Horas",
		previwLink: "",
		tutor: "Alexander Londoño",
		imageTutor: "images/profesor-alex-londono.jpg",
		score: 5

	},
	{
		nameCourse: "Facebook Marketing",
		description: "Aprende a usar Facebook como herramienta para incrementar las ventas y retener tus clientes.",
		imageCourse: "images/Facebook-Marketing.png",
		timeDuration: "40 Horas",
		previwLink: "",
		tutor: "Guillermo Enciso",
		imageTutor: "images/profesor-juan-diaz.jpg",
		score: 5

	},
	{
		nameCourse: "Google Adwords",
		description: "Aprende a crear campañas de manera profesional en 8 pasos en la plataforma de Google Adwords",
		imageCourse: "images/googleAdw.jpg",
		timeDuration: "40 Horas",
		previwLink: "",
		tutor: "Andrés Escobar",
		imageTutor: "images/avatar.jpg",
		score: 5

	},
	{
		nameCourse: "Email Marketing",
		description: "Aprende e interioriza los 10 principales conceptos y estrateguas básicas del Marketing Digital.",
		imageCourse: "images/Email-Marketing.png",
		timeDuration: "45 Minutos",
		previwLink: "",
		tutor: "Andrés Escobar",
		imageTutor: "images/avatar.jpg",
		score: 5

	},
	{
		nameCourse: "E-Commerce",
		description: "Aprende e interioriza los 10 principales conceptos y estrateguas básicas del Marketing Digital.",
		imageCourse: "images/e-commerce-2.png",
		timeDuration: "45 Minutos",
		previwLink: "",
		tutor: "Juan Díaz",
		imageTutor: "images/profesor-juan-diaz.jpg",
		score: 5

	},
	{
		nameCourse: "Analítica Web",
		description: "Aprende a crear campañas de manera profesional en 8 pasos en la plataforma de Google Adwords",
		imageCourse: "images/Web-Analytics-2.png",
		timeDuration: "45 minutos",
		previwLink: "",
		tutor: "Sergio Arboleda",
		imageTutor: "images/profesor-manuel-bolanos.jpg",
		score: 5

	},
	{
		nameCourse: "Video Marketing",
		description: "Aprende a crear campañas de manera profesional en 8 pasos en la plataforma de Google Adwords",
		imageCourse: "images/Video-Marketing-2.png",
		timeDuration: "20 Horas",
		previwLink: "",
		tutor: "Vanessa Galvis",
		imageTutor: "images/profesor-vanessa-galvis.jpg",
		score: 5

	}];


	$scope.dataCoursesPublic = jsonCoursePublic ;

});

app.controller("certificates", function($scope, $timeout){
	$scope.seeCertificate = function(){
		$timeout(function(){
			$('html,body').animate({scrollTop: 0}, 1000);
		},100);
	}
});


app.controller("detailsJobs", function($scope, $timeout){

	$scope.scrollAnchorBtn = function(event){
		var value = $(event.target).attr("value");
		$('html, body').animate({scrollTop: $("#"+value).offset().top}, 1000);

	}


	$scope.seeDeatailsJobs = function(){
		$timeout(function(){
			$('html,body').animate({scrollTop: 0}, 1000);
		},100);
	}
});








