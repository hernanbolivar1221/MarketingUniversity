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

function getPublicCourses($http, limit){
    var url = config.SERVICE_SERVER + '/api/getPublicCourses/?callback=JSON_CALLBACK&limit='+(limit ? limit : 4);
    $http.jsonp(encodeURI(url)).success(function(response){
        //console.log(response);
    })
    .error(function(data, status, headers, config){
        //console.log(data, status, headers, config);
    });
}
function getAllCourses($http){
    var url = config.SERVICE_SERVER+'"/lms/courses/json/fetch_available_courses/?callback=JSON_CALLBACK';
    $http.jsonp(url).success(function(response){
    })
    .error(function(data, status, headers, config){
        console.log("GET ERROR", data, status, headers, config);
    })
    
}


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

function getMyCourses(){

}

function getCourseDetails(uuid){

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
				$scope.dataSessionDates.push(init.toDateString() + " - " + end.toDateString());
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
    response.success(function(data){
        $scope.dataSimpleCourse = data;
        console.log(data);
    });
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



app.controller('aPiFake', ['$scope', function ($scope) {
	$scope.val = "Hola Mundo";
	$scope.dataFake = [
					{
						name: 'Semana 1: Estrategia Digital',
						submodule: [
								{
									name: "content 1", 
									content:  [
												{
													name: "content 1.1", 
													subcontent: ""
												}, 
												{
													name: "content 1.2", 
													subcontent: ""
												}, 
												{
													name: "content 1.3", 
													subcontent: ""
												} 
										]
								},
								{
									name: "content 2", 
									content:  [
												{
													name: "content 2.1", 
													subcontent: ""
												}, 
												{
													name: "content 2.2", 
													subcontent: ""
												}, 
												{
													name: "content 2.3", 
													subcontent: ""
												} 
										]
								},
								{
									name: "content 3", 
									content:  [
												{
													name: "content 3.1", 
													subcontent: ""
												}, 
												{
													name: "content 3.2", 
													subcontent: ""
												}, 
												{
													name: "content 3.3", 
													subcontent: ""
												} 
										]
								}
						],
						score: 50
						
					},
					{
						name: 'Semana 2: TI y CIO en el mundo digital',
						submodule: [
								{
									name: "content 1", 
									content:  [
												{
													name: "content 1.1", 
													subcontent: ""
												}, 
												{
													name: "content 1.2", 
													subcontent: ""
												}, 
												{
													name: "content 1.3", 
													subcontent: ""
												} 
										]
								},
								{
									name: "content 2", 
									content:  [
												{
													name: "content 2.1", 
													subcontent: ""
												}, 
												{
													name: "content 2.2", 
													subcontent: ""
												}, 
												{
													name: "content 2.3", 
													subcontent: ""
												} 
										]
								}
						],
						score: 80
						
					},
					{
						name: 'Semana 3: Dirigir el Balance',
						submodule: [
								{
									name: "content 1", 
									content:  [
												{
													name: "content 1.1", 
													subcontent: ""
												}, 
												{
													name: "content 1.2", 
													subcontent: ""
												}, 
												{
													name: "content 1.3", 
													subcontent: ""
												} 
										]
								}
						],
						score: 20
						
					}
	];

}]);


/////////////////////////////////////// -- DIRECTIVES --- ///////////////////////////////////////

app.directive('cDetails', [function () {
	return {
		restrict: 'EA',
		template :  '<p class="text text--gris" id="courseAbout">{{about}}</p>',
		link: function (scope, element, attrs) {
                  scope.$watch("data", function(){
                    
		      document.querySelector("#courseAbout").innerHTML = scope.data;
                  });
		},
		scope:{
		  data: '@about',
		}

	};
}]);

app.directive('cGoals', [function () {
	return {
		restrict: 'EA',
		template :  '<p id="dataGoals">{{about}}</p>',
		link: function (scope, element, attrs) {
                  scope.$watch("goals", function(){
		      document.querySelector("#dataGoals").innerHTML = scope.goals;
                  });
		},
		scope:{
                  goals : "@goals",
		}

	};
}]);
app.directive('cDuration', [function(){
    return {
        restrict : 'EA',
        template : '<p id="courseDuration"></p>',
        link : function(scope, element, attrs){
            collection = [scope.initial, scope.final];
            scope.$watchCollection('collection', function(newValue, oldValue){
                date1 = new Date(scope.initial);
                date2 = new Date(scope.final);
                Date.daysBetween = function( date1, date2 ) {
                    //Get 1 day in milliseconds
                    var one_day=1000*60*60*24;
                    // Convert both dates to milliseconds
                    var date1_ms = date1.getTime();
                    var date2_ms = date2.getTime();
                    // Calculate the difference in milliseconds
                    var difference_ms = date2_ms - date1_ms;
                    // Convert back to days and return
                    return Math.round(difference_ms/one_day); 
                }
                duration = Date.daysBetween(date1, date2);
                //date1 = date1.toLocaleString().split(",")[0].split("/");
                //date2 = date2.toLocaleString().split(",")[0].split("/");
                text = duration > 7 ? { 'value' : Math.round(duration/7,0), 'text' : 'Semanas'} :  { 'value' : duration, 'text' : 'Días'};
                document.querySelector("#courseDuration").innerHTML = text.value + " " + text.text;
            });
        },
        scope : {
            initial : '@initial',
            final : '@final',
            
        }
    }    
}]);
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
app.directive("buttonCourse", ['sessionsFactory', function(sessionsFactory){
    return {
        restrict : "EA",
        template : '<a href="" class="btn btn--academy2 btn-rojo btn-xlg text--upper margin--t1 margin--b1"  id="buttonCourse"></a>',
        link : function(scope, element, attrs){
            scope.$watch("sessions", function(){

                sessions = scope.sessions
                try{
                    has_session = false;
                    sessions = JSON.parse(sessions);
                    button = document.querySelector("#buttonCourse");
                    for(session of sessions){
                        if(session.score != null){
                            has_session = true;
                        }
                    }
                    if(has_session){
                        button.href = '#/course/'+scope.uuid+'/simple';
                        button.classList.add('btn-success');
                        button.classList.remove('btn-rojo');
                        button.innerHTML = "Ingresar";
                    }else{
                        uuid = scope.uuid;
                        session_available = sessionsFactory.firstAvailable(sessions);
                        if(!session_available){
                            button.classList.add("hidden");
                        }
                        console.log(session_available);
                        username = dataUser.username;
                        button.innerHTML = "Inscribete";
                        button.onclick = function(){
                            sessionsFactory.inscribe(uuid, dataUser.username, session_available); 
                        }
                        
                        
                    }

                }catch(err){
                    //console.log(sessions);
                }
            });
        },
        scope : {
            sessions : '@sessions',
            uuid : '@uuid',
            username : '@username',
        }
    }        
}]);

app.directive('tabsCustomVertical', [function () {
	return {
		restrict: 'EA',
		template: '<div>' +
					'<div class="col-md-2 sidebar-contenidoCurso sidebar-add__montainR margin--b5">' + 
						'<ul class="list-unstyled menuTab">' + 
							'<li ng-repeat="items in tabs" ng-class="{tabActive: items.active}">' + 
								'<i class="{{items.icon}} "></i>' + 
								'<a href="" ng-click="items.active = true">{{items.name}}</a>' +
							'</li>' + 
						'</ul>' + 
					'</div>' + 
					'<div class="col-md-10">' + 
						'<tabset>' + 
							'<tab ng-repeat="tab in tabs" heading="" active="tab.active">' +
								'<ng-include src="tab.template"></ng-include>' + 
							'</tab>' + 
						'</tabset>' + 
					'</div>' + 
				  '</div>',
		link: function (scope, element, attrs) {

			var urlTemplate = 'views/simpleCourse/';

			scope.tabs = [
							{
								name: ' Salón de Clase', 
								icon: 'fa fa-desktop fa-fw', 
								active:true, 
								template: urlTemplate + 'tab1.html' 
							},
							{
								name: ' Sobre el Curso',
								icon: 'fa fa-book fa-fw', 
								active:false, 
								template: urlTemplate + 'tab2.html'
							}, 
							{
								name: ' Recursos', 
								icon: 'fa fa-bars fa-fw fa-rotate-90', 
								active:false, 
								template: urlTemplate + 'tab3.html'
							}, 
							{
								name: ' Foros', 
								icon: 'fa fa-comments-o fa-fw', 
								active:false, 
								template: urlTemplate + 'tab4.html'
							}, 
							{
								name: ' Evaluaciones',
								icon: 'fa fa-check-square-o fa-fw', 
								active:false, 
								template: urlTemplate + 'tab5.html'
							}, 
							{
								name: ' Profesores',
								icon: 'fa fa-user fa-fw', 
								active:false, 
								template: urlTemplate + 'tab6.html'
							}
                         ];   
                         
            var loadBar = setInterval(function(){
            	var nav = document.querySelector("ul.nav-tabs");
            	nav.remove();  
            	if(nav.length == null){
            		clearInterval(loadBar);
            	}
            },100);       	
 			
                  
		}
	};
}]);


app.directive('descriptionTab', [function () {
	return {
		restrict: 'AE',
		link: function (scope, element, attrs) {

			scope.$watch("description", function(newValue, oldValue){
				if(newValue != ""){

					var contentDescription = "<br><span class='descriptionSmall'>" + scope.description + "</span>";
					// using Jquery
					element.find("ul:first").find("a").append(contentDescription);
				}
			});				
		},	
		scope: {
			description: '@'
		}
	}
}]);

app.directive('tabsCustomHorizontal', [function () {
	return {
		restrict: 'EA',
		transclude: true,
		template:   '<tabset justified="true" type="pills">' +
    					'<tab ng-repeat="subItem in item.submodule" heading="">' +
                            '<div class="col-md-8"></div>'+
                            '<div class="col-md-4 sidebar-right text-center">' +
                               	'<p class="text text--lite text--gris margin--b1 margin--t05 text--xbold"> Progreso Lección {{dataFake.length}} </p>' +
                                    '<div class="c100 center p{{item.score}} center-block">' +
                                        '<span>{{item.score}}%</span>' +
                                        '<div class="slice">' +
                                            '<div class="bar"></div>' +
                                            '<div class="fill"></div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="clearfix"></div>' +
                                    '<p class="text text--lite text--gris text--upper margin--b0 margin--t2"> Puntos de marketing ninja: </p>' +
                                    '<p class="text text--xbold text--xxlg text--gris text--upper margin--b0 margin--t0"> 80 </p>' +
                                    '<div class="clearfix"></div>' +
                                    '<a class="btn btn-verde btn-lg margin--t1 typeform-share" href="https://andresescobar.typeform.com/to/emTKCV" data-mode="1" target="_blank">' +
                                        'Realizar Evaluación' +
                                    '</a>' +
                            '</div>' +
    					'</tab>' +
  					'</tabset>',

        link: function(scope, element, attrs){

        	var ulElement = element.find("ul");

        	var timeLoadElement = setInterval(function(){
        		if(ulElement.length != 0 ){
        			ulElement.addClass("nav-pills--setps");
        			clearInterval(timeLoadElement);
        		}
        	});

        }
	}	
}]);

