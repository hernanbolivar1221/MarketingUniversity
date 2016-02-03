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
app.controller("comments", function($scope, $http, $routeParams){
    var url = config.SERVICE_SERVER + '/api/community/?uuid='+$routeParams.uuid+'&callback=JSON_CALLBACK';
    $http.jsonp(encodeURI(url)).success(function(response){
        $scope.commentsForCourse= JSON.stringify(response);
    })
    .error(function(data, status, headers, config){
        //console.log(data, status, headers, config);
    });

});
app.controller("profile_api",function($scope, $http){

	if(localStorage.dataUser){
		dataUser = JSON.parse(localStorage.dataUser);
		dataUser.photo == "" ? dataUser.photo = "images/bullet3.png" : dataUser.photo;
		$scope.dataUser= dataUser;
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
       // getPublicCourses($http);	
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
// functions 
function getMyCourses(){

}

function getCourseDetails(uuid){

}


/////////////////////////////////////// -- SERVICES --- ///////////////////////////////////////

// Factory for Ajax Courses ---------------------------------------------------------------------

app.factory('coursesGet', ['$http',function($http) {

	var objData = {};
	var url = config.SERVICE_SERVER + '/api/courses/?callback=JSON_CALLBACK&';
	objData.getData = function(parameter){
		return $http.jsonp(encodeURI(url + parameter + '=1'));
	}

	return objData;

}]);

app.factory('getCourse', ['$http',function($http) {
    return {
        dataStudent : function(uuid){
            var url = config.SERVICE_SERVER + '/api/course/'+ uuid +'/dataStudent/?callback=JSON_CALLBACK&';
            var response = $http.jsonp(encodeURI(url));
            return response;    
        }
    }    
}]);
// Factory for Animation Top ---------------------------------------------------------------------

app.factory('scrolltop', [function () {
	
	return function scrollTop(){
		$('html,body').animate({scrollTop: 0}, 1000);
	};
}])


/////////////////////////////////////// -- CONTROLLERS --- ///////////////////////////////////////
    
// controller  Navbar  ---------------------------------------------------------------------

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

// controller  Footer  ---------------------------------------------------------------------

app.controller("footer", function($scope){

	if(localStorage.dataUser){	
		$scope.subscription = false;
	}else{
		$scope.subscription = true;
	}
});

// controller  Login ---------------------------------------------------------------------

app.controller("main", function($scope, coursesGet){

	coursesGet.getData('public').success(function(response){
		$scope.dataCoursesPublic = response;
	});    
});

// controller All Courses ---------------------------------------------------------------------

app.controller("allCourses", function($scope, scrolltop, coursesGet){
	scrolltop();
	coursesGet.getData('public').success(function(response){
		$scope.coursesall = response;
	});  
});


// controller for Details Courses --------------------------------------------------------

app.controller("courseDetails", function($http, $scope, $routeParams, scrolltop){
	
	scrolltop();

	var dataSessionInitial,
		dataSessionFinal;

	var url = config.SERVICE_SERVER + '/api/courses/?callback=JSON_CALLBACK&public=1&uuid=' + $routeParams.uuid;
		$http.jsonp(encodeURI(url)).success(function(response){
			$scope.dataDetails = response[0];
			$scope.dataSessionDates = []
			for (var i = 0; i < response[0].sessions.length; i++) {
				session = response[0].sessions[i];
				init = new Date(session.initial_date);
				end = new Date(session.final_date);
				$scope.dataSessionDates.push({
                    "dates" : init.toDateString() + " - " + end.toDateString(),
                    "initial_date" : session.initial_date,
                    "final_date" : session.final_date
                });

		};
		})
    	.error(function(data, status, headers, config){
          console.log(data, status, headers, config);
    	});	
});

// controller all Certificates ---------------------------------------------------------------------

app.controller("certificates", function($scope, scrolltop){
	scrolltop();
});

// controller My Courses ---------------------------------------------------------------------

app.controller("myCourses", function($scope, coursesGet){

	coursesGet.getData('me').success(function(response){
		$scope.dataMyCourses = response;
	}); 
});

app.controller('simpleCourse', ['$http','$scope', '$routeParams', 'getCourse', function ($http, $scope, $routeParams, getCourse) {
    var response = getCourse.dataStudent($routeParams.uuid);

    // - - - - -

        function split_array_for_slides(array, n){
        	response = [];
        	aux_array = [];
        	for(var i = 0; i <  array.length; i++){
        		if(aux_array.length < n){
        			aux_array.push(array[i]);
        		}else{
        			response.push(aux_array);
        			aux_array = [];
        			aux_array.push(array[i])
        		}
        	}
        	if(aux_array.length > 0){
        		response.push(aux_array);
        	}
        	return response;
        }


    response.success(function(data){
        $scope.dataSimpleCourse = data;
        console.log($scope.dataSimpleCourse);

        dataModules = $scope.dataSimpleCourse.modules;
       	$scope.simpleItems = split_array_for_slides(dataModules,4);
       	console.log($scope.simpleItems);
    });

    // carousel
	$scope.intervalTime = 0;

}]);


// controller Jobs ---------------------------------------------------------------------

app.controller("detailsJobs", function($scope, scrolltop){
	scrolltop();
	// scroll from tab 
	$scope.scrollAnchorBtn = function(event){
		var value = $(event.target).attr("value");
		$('html, body').animate({scrollTop: $("#"+value).offset().top}, 1000);

	}
});



/////////////////////////////////////// -- DIRECTIVES --- ///////////////////////////////////////
app.factory('sessionsFactory', function(){
    return {
        inscribe : function(uuid, user_id, session_id){
            console.log(uuid, username, session_id); 
                   
        },
        firstAvailable : function(sessions){
            _aux = null;
            now = new Date();
            for(session of sessions){
                    
                if(now < session.initial_date){
                    if(_aux && session.initial_date < _aux.initial_date){
                        _aux = session;
                    }
                }
            }
            return _aux;
        }
    }     
});

