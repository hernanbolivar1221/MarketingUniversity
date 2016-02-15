// Scope Goblal
app.run(['$rootScope','$location','$route', '$http',function($rootScope, $location, $route, $http) {
    $rootScope.template ='views/courses/content_user_opt.html';
  	$rootScope.btnSingUp = true;
	$rootScope.btnLogout = false;
  
    $rootScope.displayMenu_0 = true;
    $rootScope.displayMenu_1 = false;
    $rootScope.displayMenu_2 = false;

    $rootScope.menuCourse = false;
    $rootScope.dataUser = null;
	if(localStorage.dataUser){
		dataUser = JSON.parse(localStorage.dataUser);
		dataUser.photo == "" ? dataUser.photo = "images/bullet3.png" : dataUser.photo;
		$rootScope.dataUser= dataUser;
	}else{
		location.href = "#/";
	}

    $rootScope.$watch("dataUser", function(newValue, oldValue){
        if(newValue != undefined && newValue){
            console.log("ingreso");   
            $rootScope.btnSingUp = false;
            $rootScope.btnLogout = true;
            $rootScope.hideMenu = true;
            if(location.hash == '#/profile'){
                $rootScope.menuCourse = true;
            }

        }else{
            $rootScope.btnSingUp = true;
            $rootScope.btnLogout = false;
		    $rootScope.hideMenu = false;
        }
    });
	$rootScope.showMenu = function(){
		$rootScope.menuOpen = $rootScope.menuOpen ? false : true;
	}

	/*
	* TODO: Remove next code when update is ready
	*/
	$rootScope.$on('$locationChangeSuccess', function() {
        var routeActual = $rootScope.actualLocation;
        $rootScope.actualLocation = $location.path();
        if(location.hash != "#/profile"){
            $rootScope.menuCourse = false;
        }else{
            $rootScope.menuCourse = true;
        }
    });        

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
        	location.href = "#/profile";
        }
    });

    $rootScope.courseId = null;
    $rootScope.studentId = null;
    $rootScope.moduleId = null;
    $rootScope.contentId = null;
    $rootScope.actual_position = null;
    $rootScope.isTutorReview = "{{isTutorReview}}";
    $rootScope.isReview = "{{isReview}}";
    $rootScope.review_course = "{{reviewing}}";
    $rootScope.max_grade = "{{max_grade}}";
    $rootScope.weight_question="";
    $rootScope.hasOpenQuestion="{{hasOpQ}}";
    $rootScope.type_view = "{{course.view_type}}";
    $rootScope.show_test = false; 
    $rootScope.examData;
    $rootScope.EXAM_REFRESH_FAILURES = 0;
    $rootScope.choices = {};
    $rootScope.last_viewed_position = 0;

    //
    //
    $rootScope.ajax_fetch_user_slide = function(options) {
        console.log(options);
        $http.jsonp(config.SERVICE_SERVER + '/api/contents/json_fetch_user_slide/?callback=JSON_CALLBACK&exam='+$rootScope.examData.pk)
            .success(function(response) {
                options.success(response);
            })
            .error(function(err){
                console.log(err);
            })
        
    };

    $rootScope.init_userSlideContainer = function(position, cb){
        $rootScope.actual_position = 0;
        var dict_choices = JSON.stringify($rootScope.choices);
        already_graded=false;
        $rootScope.ajax_fetch_user_slide({
            data: {
                course_id: $rootScope.courseId,
                module_id: $rootScope.moduleId,
                content_id: $rootScope.contentId,
                exam_id: $rootScope.examData.pk,
                position: position,
                choices: dict_choices,
                actual_position: $rootScope.actual_position
            },
            success: function(response){			
                choices={};
                var slide = response[0];
                $rootScope.examSlide = slide;
            }
        })

    };
    //
    $rootScope.ajax_fetch_exam = function(options) {
        console.log(options)
        var data = options.data;
        if (!data) data ={};

        var params = "";
        for(key in options ){
            if(key == 'exam' || key == "contentId"){
                params += ("&"+key+"="+options[key]);
            }

        }
        $http.jsonp( config.SERVICE_SERVER + '/api/contents/json_fetch_exam/?callback=JSON_CALLBACK'+params)
            .success(function(response){
                options.success(response);
            })

    }


    $rootScope.updateExam = function(custom_opts){
        
     	ajax_options = {
		error: function() {
			$rootScope.EXAM_REFRESH_FAILURES = $rootScope.EXAM_REFRESH_FAILURES + 1;
		},

		success: function(response){

			$rootScope.EXAM_REFRESH_FAILURES = 0;

			var first_load = ($rootScope.examData == undefined);
			var modalTimeOut = $("#modalTimeOut");
			$rootScope.examData = response[0];

            $rootScope.init_userSlideContainer();
			if ($rootScope.isReview){
				$rootScope.examData.time_test_begins = new Date();
				if ($rootScope.examData.extras.seconds_left) {
					$rootScope.examData.time_test_ends = new Date();
					$rootScope.examData.time_test_ends.setTime($rootScope.examData.time_test_begins.getTime() + ($rootScope.examData.extras.seconds_left*1000));
		
					secondsTickerCallbacks["exam_counter"] = function(){
						draw_countDown(countDownDiv, $rootScope.examData.time_test_ends, modalTimeOut)
					};
				}
			}else {
				first_load=false;
			}
		}

	}
	
	$.extend(ajax_options, custom_opts || {});

	if ($rootScope.examData && $rootScope.examData.fields.end_date&& $rootScope.isTutorReview) {
		//$.jqlog.info("no need to update exam since it's closed");
		return false;
	}

    	$rootScope.ajax_fetch_exam(ajax_options);


    }
    $rootScope.start_exam = function(){
        params = 'course='+$rootScope.courseId+"&ubs="+$rootScope.studentId+'&module='+$rootScope.moduleId+'&content='+$rootScope.contentId;
        $http.jsonp(config.SERVICE_SERVER + '/api/contents/take_test/?callback=JSON_CALLBACK&'+params)
            .success(function(response){
                if(response.status == 'ok'){
                   $rootScope.updateExam(response); 
                }
            })
    }
    $rootScope.open_test = function(){
        $rootScope.show_test = true;
        $rootScope.start_exam();
    }

    $rootScope.close_test = function(){
        
        $rootScope.show_test = false;    
    }
 
   /*
   * END TODO
   */
}]);

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
app.controller("profile_api",function($scope, $http, $rootScope, coursesGet){

	if(localStorage.dataUser){
		dataUser = JSON.parse(localStorage.dataUser);
		dataUser.photo == "" ? dataUser.photo = "images/bullet3.png" : dataUser.photo;
		$rootScope.dataUser= dataUser;
	}else{
		location.href = "#/";
	}

    // Jquery
    	setTimeout(function(){
       		$(".nav-tabs").find("ul").addClass("nav-perfil");
    	});

    // Variables Globales    

    $rootScope.displayMenu_0 = true;
    $rootScope.displayMenu_1 = false;
    $rootScope.displayMenu_2 = false;

    //Api of Course

    coursesGet.getData('me').success(function(response){
        $scope.course_in_progres = [];
        $scope.completed_courses = []; 
        for(course of response){
            max_percentage = 0;
            for(session of course.sessions){
                max_percentage = session.score;
            }
            max_percentage < 100 ? $scope.course_in_progres.push(course) : $scope.completed_courses.push(course);
            
        }
        $scope.dataProfileCourse = $scope.course_in_progres;

    });
});

// Api Login
var user = null;
app.controller("login_api", function($scope, $http, $rootScope){
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

app.controller("navbar_functions", ['$scope','$http','$rootScope', function($scope, $http, $rootScope){

	$scope.menuOpen = false;
	$scope.logout = function(){
		$http.jsonp(config.SERVICE_SERVER+"/api/json_logout/?callback=JSON_CALLBACK").success(function(response){

		});
        $rootScope.dataUser = undefined;
		localStorage.clear(); 
		location.href = "#/"; 
	}

	$scope.activeMenu = function(event){
		$(event.target).parent().siblings().removeClass("active");
		$(event.target).parent().addClass("active");

	}

    $rootScope.displayMenu_0 = true;
    $rootScope.displayMenu_1 = false;
    $rootScope.displayMenu_2 = false;

    $scope.menuActive_0 = 'active';
    $scope.menuActive_1 = '';
    $scope.menuActive_2 = '';

    $scope.changeItem = function(index){
        switch(index) {
            case 0: 
                $rootScope.displayMenu_0 = true; 
                $rootScope.displayMenu_1 = false; 
                $rootScope.displayMenu_2 = false;
                $scope.menuActive_0 = 'active';
                $scope.menuActive_1 = ''; 
                $scope.menuActive_2 = '';
                break;
            case 1:
                $rootScope.displayMenu_0 = false; 
                $rootScope.displayMenu_1 = true; 
                $rootScope.displayMenu_2 = false;
                $scope.menuActive_0 = '';
                $scope.menuActive_1 = 'active'; 
                $scope.menuActive_2 = '';
                break;
            case 2:
                $rootScope.displayMenu_0 = false; 
                $rootScope.displayMenu_1 = false; 
                $rootScope.displayMenu_2 = true;
                $scope.menuActive_0 = '';
                $scope.menuActive_1 = '';
                $scope.menuActive_2 = 'active';
                break;    
        }
    }
}]);

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

app.controller("certificates",['$scope','scrolltop','coursesGet','$sce',function($scope, scrolltop, coursesGet,$sce){
	scrolltop();
    coursesGet.getData('public').success(function(response){
        $scope.certificateAll = response;
        console.log($scope.certificateAll);
    }); 

    $scope.parseHtml =  function(html){
        return $sce.trustAsHtml(html);
    }


    $scope.active = function(index){
        $scope.activePos = index;
    }

}]);

// controller My Courses ---------------------------------------------------------------------

app.controller("myCourses", function($scope, coursesGet){

	coursesGet.getData('me').success(function(response){
        $scope.course_in_progres = [];
        $scope.completed_courses = []; 
        for(course of response){
            max_percentage = 0;
            for(session of course.sessions){
                max_percentage = session.score;
            }
            max_percentage < 100 ? $scope.course_in_progres.push(course) : $scope.completed_courses.push(course);
            
        }
        //cope.dataProfileCourse = response;

		$scope.dataMyCourses = $scope.course_in_progres;
	}); 
});

app.controller('simpleCourse', ['$http','$scope', '$routeParams', 'getCourse','$modal','$sce', '$rootScope', function ($http, $scope, $routeParams, getCourse, $modal,$sce, $rootScope) {
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

    // paginador Recursos    
    $scope.uuid = $routeParams.uuid;
    $scope.pag = 0;
    $scope.modulePosition = 0;
    $scope.submodulePosition= 0 ;
    $scope.exam_score = 0;
    $scope.upSubmodule = function(){
        $scope.submodulePosition++;   
        console.log("Module: "+ $scope.modulePosition);
        console.log("Submodule: "+$scope.submodulePosition);
    }
    

    $scope.downSubmodule = function(){
        if($scope.submodulePosition > 0){
            $scope.submodulePosition--;    
        }
        console.log("Module: "+ $scope.modulePosition);
        console.log("Submodule: "+$scope.submodulePosition);
    }
    
    $scope.$watch("modulePosition",function(_new,_old){
        $scope.submodulePosition = 0;

        $scope.$watch("submodulePosition", function(newValue, oldValue){
            try{
                submodule_old = $scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].module_pk;
                $scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].has_seen = true;
                var url = config.SERVICE_SERVER +'/api/course/markSubmodule/?callback=JSON_CALLBACK&module='+submodule_old;
                $http.jsonp(encodeURI(url)).success(function(response){
                    if(response.status == "success"){
                        console.log("submodule with pk : "+ $scope.modules[$scope.modulePosition].submodules[newValue].module_pk + " has marked as seen");
                    }else{
                        console.log("An error has ocurred - " + response.message);    
                    }
                })
                .error(function(data, status, headers, config){
                    //console.log(data, status, headers, config);
                });    
            }catch(err){
                
            }
            var intervalEmbed = setInterval(function(){
                if(document.querySelectorAll("#embedVideo").length > 0 && $scope.dataSimpleCourse ){
                
                    clearInterval(intervalEmbed);
                    embed = document.querySelector("#embedVideo");
                    embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;


                }
            },100);   
        });


    });
    

    $scope.jumpSubmodulePosition = function(pos){
        $scope.submodulePosition = pos;   
        console.log("Module: "+ $scope.modulePosition);
        console.log("Submodule: "+$scope.submodulePosition);

    }
    $scope.jumpModulePosition = function(pos){
        $scope.modulePosition = pos;    
        console.log("Module: "+ $scope.modulePosition);
        console.log("Submodule: "+$scope.submodulePosition);
    }
    $scope.packItemPosition = 0;
    $scope.upPackItem = function(){
        $scope.packItemPosition++;    
    }
    $scope.downPackItem = function(){
        console.log(456);
        $scope.packItemPosition--;    
    }
    $scope.$watch("packItemPosition", function(){
        $scope.modulePosition = $scope.packItemPosition * 4;
        console.log($scope.modulePosition);
    });

    response.success(function(data){
        $rootScope.courseId = data.course.pk;
        $rootScope.studentId = data.course.ubs;
        //modules

        $scope.dataSimpleCourse = data;
        $scope.$watch("embed", function(_new, _old){
            if($scope.embed != null){
                console.log(embed);
            }
        });
        $scope.$watch("modulePosition",function(){
            try{
                $scope.submodulePosition = 0;
                $scope.exam_score = $scope.modules[$scope.modulePosition].contents[0].content_button_info.exam_score;
                if($scope.modules[$scope.modulePosition].contents[0].content_button_info.passed){

                    $scope.exam_score = 100;    
                }
                $scope.$watch("submodulePosition", function(){
                    var intervalEmbed = setInterval(function(){
                        if(document.querySelectorAll("#embedVideo").length > 0 && $scope.dataSimpleCourse ){
                        
                            clearInterval(intervalEmbed);
                            embed = document.querySelector("#embedVideo");
                            embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;
                        }
                    },100);   
                });

                $scope.exam_url = config.SERVICE_SERVER + '/lms/course/' + $scope.uuid + '/module/' + $scope.modules[$scope.modulePosition].module_pk+'/content/' + $scope.modules[$scope.modulePosition].contents[0].content_pk+ '/sit/';
            }catch(err){
                
            }
        });
        $scope.$watch("submodulePosition", function(){
            var intervalEmbed = setInterval(function(){
                if(document.querySelectorAll("#embedVideo").length > 0){
                    clearInterval(intervalEmbed);
                    embed = document.querySelector("#embedVideo");
                    embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;

                }
            },100);    

        });

        // submodules
        dataModules = $scope.dataSimpleCourse.modules;
        $scope.modules = dataModules;
        $scope.simpleItems = split_array_for_slides(dataModules,4);

        $rootScope.moduleId = $scope.modules[$scope.modulePosition].module_pk;
        $rootScope.contentId = $scope.modules[$scope.modulePosition].contents[0].content_pk;
        $scope.$watch("simpleItems", function(_new, _old){
            console.log(_new); 
        });


        // Evaluations

        var AllEvaluations = [];

        for(index in dataModules){
            AllEvaluations.push(data.modules[index].contents);
        }

        $scope.evaluations = AllEvaluations;
        console.log(AllEvaluations);

        // resources  

        var resources = [];
        var resourcesModule = [];
        var resourcesSubmodule = [];

        $scope.resourcesSubmodule = resourcesSubmodule;

        for(module of data.modules ){
            resources.push(module);
        } 

        for(item in resources){
            for(contents of resources[item].submodules){
                resourcesSubmodule.push(contents.contents);
            }
        }
        $scope.is_disabled = function(){
            module = $scope.modules[$scope.modulePosition];
            for(submodule of module.submodules){
                if(!submodule.has_seen){
                    return true;
                }    
            }
            return false;
        }
    });


    // navigation for Resources of the Course

    $scope.posLesson = 1;

    $scope.functionRun = function(){
        var tableFirst = $("#recursos").find(">table:first").hasClass("ng-hide");
        if(tableFirst === false){
            $(".btn--prev").hide();
        }
        var loadItem = setInterval(function(){
            var tableEnd = $("#recursos").find(">table:last");
            tableEnd.addClass("posLast");
            if(tableEnd.length != 0){
                clearInterval(loadItem);
            }
        },500);
    }


    function checkResources(){
        var textInEle = $(".resourceTable").not(".ng-hide").find("tr").eq(1).find("td");

        if(textInEle.length == 0){
            $(".alertContent").show();
        }else{
            $(".alertContent").hide();
        }
    }

    $scope.nextResource = function(){
        var table_End = $("#recursos").find(">table:last");
        $scope.posLesson += 1;
        $(".btn--prev").show();
        $(".resourceTable").not('.ng-hide').addClass("hideBack");
        $(".resourceTable").not('.ng-hide').next().removeClass("ng-hide");
        $(".hideBack").addClass("ng-hide").removeClass("hideBack");
        if($(".posLast").hasClass("ng-hide") === false){
            $(".btn--next").hide();
        }

        checkResources();
    }

    $scope.prevResource = function(){
        $scope.posLesson -= 1;
        var tableFirst = $("#recursos").find(">table:first").hasClass("ng-hide");
        if(tableFirst === true && $scope.posLesson === 1){
            $(".btn--prev").hide();
        }
        $(".resourceTable").not('.ng-hide').addClass("showBack");
        $(".resourceTable").not('.ng-hide').prev().removeClass("ng-hide");
        $(".showBack").addClass("ng-hide").removeClass("showBack");
        if($(".posLast").hasClass("ng-hide") === true){
            $(".btn--next").show();
        }

        checkResources();

    }



    // carousel
	$scope.intervalTime = 0;

    //modal

    $scope.modalOpen = function(size){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'myModalTest.html',
            controller: 'modalInstanceCtrl',
            size: size,
            resolve:{
                items: function(){
                    return "Mi modal";
                }
            }
        });
    }

    $scope.parseHtml =  function(html){
        return $sce.trustAsHtml(html); 
    }

}]);


app.controller('modalInstanceCtrl', ['$scope','$modalInstance', 'items', function ($scope, $modalInstance, items) {
    
    $scope.text2 = items;

}]);

// controller Evaluations ---------------------------------------------------------------------


app.controller('jsonEvaluation',['$scope','$http',function($scope,$http){
    $http({url: 'js/test.js'}).then(function(response){
        $scope.dataTest = response.data;
        var data_Slides = response.data[0].extras.json_user_answers;
        $scope.dataSlides = angular.fromJson(data_Slides)
    });

}]);

// controller Tribes ---------------------------------------------------------------------

app.controller('tribes',['$scope','getCourse','$routeParams','$http',function($scope,getCourse,$routeParams,$http){
    var response = getCourse.dataStudent($routeParams.uuid);

    response.success(function(data){
        console.log(data);
        var topics = [];
        for(tribes_modules of data.modules){
            topics.push(tribes_modules.objects[0]);
        }
        console.log(topics);
        
        $scope.tribesModule = topics;


    });

    $http.jsonp( 'http://marketing.kmelx.com/api/tribes/get_tribe/?callback=JSON_CALLBACK&tribe_id=2')
        .success(function(response){
            console.log(response);
            $scope.tribesDetails = response;
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

app.controller("tutors",['$scope','$routeParams','coursesGet',function ($scope,$routeParams,coursesGet){
    var response = coursesGet.getData("uuid="+$routeParams.uuid+"&me");
    response.success(function(data){
       $scope.tutorsData = data[0].tutors;   
    });
      
}]);



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

