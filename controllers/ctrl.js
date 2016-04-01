// Scope Gobla/
//

app2.run(['$rootScope','$location','$route', '$http', "$window", function($rootScope, $location, $route, $http, $window) {

    $rootScope.template ='views/courses/content_user_opt.html';
  	$rootScope.btnSingUp = true;
	$rootScope.btnLogout = false;
    $rootScope.testXAPI = function(){
        $http({
            "method" : 'jsonp',
            "url" : config.SERVICE_SERVER + '/api/xapi/statements/?callback=JSON_CALLBACK',
            "headers" : {
                'X-Experience-API-Version' : '1.0.0'
            }
        }).success(function(response){
            console.log(response);
        })
    }  
    $rootScope.displayMenu_0 = true;
    $rootScope.displayMenu_1 = false;
    $rootScope.displayMenu_2 = false;
    $rootScope.menuCourse = false;
    $rootScope.dataUser = null;
    $rootScope.endpoint = config.SERVICE_SERVER;
    $rootScope.$watch("dataUser", function(){
        try{
            username = $rootScope.dataUser.username;
            email = $rootScope.dataUser.email;
        }catch(err){
            console.log("[DEBUG] - There is not user data");
        }
    })
    $rootScope.question_choices = {};
	if(localStorage.dataUser){
		dataUser = JSON.parse(localStorage.dataUser);
		dataUser.photo == "" ? dataUser.photo = "images/bullet3.png" : dataUser.photo;
		$rootScope.dataUser= dataUser;
	}

    $rootScope.$watch("dataUser", function(newValue, oldValue){
        if(newValue != undefined && newValue){
            console.log("ingreso");   
            $rootScope.btnSingUp = false;
            $rootScope.btnLogout = true;
            $rootScope.hideMenu = true;

        }else{
            $rootScope.btnSingUp = true;
            $rootScope.btnLogout = false;
		    $rootScope.hideMenu = false;
        }
    });;
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
    $rootScope.exam_percentage = 0;
    $rootScope.disableChoices = false;
    $rootScope.endpoint = config.SERVICE_SERVER;
    $rootScope.loader = true;

    //
    //
    $rootScope.saveAnswer = function(val){
        for(key in $rootScope.question_choices){

            $rootScope.question_choices[key] = null;
        }
        $rootScope.question_choices[""+val] = val; 
        console.log($rootScope.question_choices);

        //styles
        $(".letter").each(function(){
            $(this).removeClass("activeAnswer");
        });
        $(".letterId-" + val).addClass("activeAnswer");
        $(".btnFinish").removeClass("not-active-button");

        //percentage

        $rootScope.exam_percentage = (100 * $rootScope.numberQuestion) / $rootScope.numberAllslide;

    }
    $rootScope.options ={
        data: {
            course_id: $rootScope.courseId,
            module_id: $rootScope.moduleId,
            content_id: $rootScope.contentId,
            exam_id: ($rootScope.examData ? $rootScope.examData.pk : null),
            position: ($rootScope.prev_position ? $rootScope.prev_position : null),
            choices: $rootScope.question_choices,
            actual_position: $rootScope.actual_position -1 
        },
        success: function(response){			
            choices={};
            var slide = response[0];
            $rootScope.examSlide = slide;
            console.log($rootScope.examSlide);
            $rootScope.user_answers = JSON.parse(slide.extras.json_user_answers);
            $rootScope.disableChoices = false;
            for(choice in $rootScope.user_answers){

                if($rootScope.user_answers[choice].selected){
                   $rootScope.disableChoices = true;
                }
            }
            try{
                img = document.querySelector("#questionImage");
                src = $rootScope.examSlide.fields.question.extras.get_image_data.split(",")[0];
                img.src =config.SERVICE_SERVER+ "/content/question/images/"+ $rootScope.examSlide.fields.question.pk+"/"+src;
                img.style.border = "8px solid #ccc"; 
            }catch(err){

            }
            for(val in $rootScope.user_answers){
                $rootScope.question_choices[$rootScope.user_answers[val].id] = null;
            }
        },
        success_slide : function(response, params){
            $http.jsonp( config.SERVICE_SERVER + '/api/contents/json_fetch_exam/?callback=JSON_CALLBACK'+params)
                .success(function(data){
                    choices={};
                    var slide = response[0];
                    $rootScope.examSlide = slide;
                    $rootScope.user_answers = JSON.parse(slide.extras.json_user_answers);
                    for(val in $rootScope.user_answers){
                        $rootScope.question_choices[$rootScope.user_answers[val].id] = null;
                    }

                })
            
        }

    } 
    $rootScope.ajax_fetch_user_slide = function(options, params) {
        $rootScope.loader = true;
        $rootScope.numberQuestion = 1;
        $rootScope.arrowLeft = false;
        $rootScope.arrowRight = true;
        $rootScope.finish = false;
        $rootScope.confirmFinish = false;
        prev_choices = $rootScope.question_choices;
        prev_position = $rootScope.actual_position;
        prev_position = $rootScope.actual_position;
        $rootScope.question_choices = {};
        if(params == undefined){
            params = ""
        }
        $rootScope.user_answers = null;
        $http.jsonp(config.SERVICE_SERVER + '/api/contents/json_fetch_user_slide/?callback=JSON_CALLBACK&exam='+$rootScope.examData.pk+params)
            .success(function(response) {
                options.success(response, params);
                $rootScope.loader = false;
            });
        
    };
    $rootScope.nextSlide = function(){
        /**prev_position = $rootScope.actual_position;
        $rootScope.options_exam["position"] = $rootScope.actual_position;
        $rootScope.options_exam["actual_position"] = prev_position;
        prev_position = $rootScope.actual_position;
        params= "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId+"&content="+$rootScope.contentId;
        params += '&course='+$rootScope.courseId+"&ubs="+$rootScope.studentId+'&module='+$rootScope.moduleId+'&contentId='+$rootScope.contentId+"&exam="+$rootScope.examData.pk+"&choices="+JSON.stringify($rootScope.question_choices);
        $rootScope.actual_position +=1;
        $rootScope.ajax_fetch_user_slide($rootScope.options, "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId);**/
        

        prev_choices = $rootScope.question_choices;
        prev_position = $rootScope.actual_position;


        $rootScope.actual_position +=1;
        $rootScope.question_choices = {};
        params += "&exam="+$rootScope.examData.pk+"&contentId="+$rootScope.contentId;
        $http.jsonp( config.SERVICE_SERVER + '/api/contents/json_fetch_exam/?callback=JSON_CALLBACK&'+params)
             .success(function(response){
                console.log(response);
                $rootScope.user_answers = null;
                $rootScope.ajax_fetch_user_slide($rootScope.options, "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId+"&choices="+JSON.stringify(prev_choices));
                $rootScope.arrowLeft = true;
                $rootScope.numberQuestion = 1 + $rootScope.actual_position;
                if($rootScope.numberAllslide == $rootScope.numberQuestion){
                    $rootScope.arrowRight = false;
                    $rootScope.finish = true;
                }
             });
        //TODO: create in options JSON success functions for nextSlide, prevSlide and finishExam 
        
     }

    $rootScope.finishExam = function(){
        $rootScope.confirmFinish = true;
        prev_position = $rootScope.actual_position;

        params= "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId+"&content="+$rootScope.contentId;

        params += '&course='+$rootScope.courseId+"&ubs="+$rootScope.studentId+'&module='+$rootScope.moduleId+'&contentId='+$rootScope.contentId+"&exam="+$rootScope.examData.pk+"&choices="+JSON.stringify($rootScope.question_choices);
         $http.jsonp( config.SERVICE_SERVER + '/api/contents/json_fetch_exam/?callback=JSON_CALLBACK'+params)
            .success(function(response){
                $http.jsonp(config.SERVICE_SERVER + '/api/contents/json_finish_exam/?callback=JSON_CALLBACK&exam='+$rootScope.examData.pk+params)
                    .success(function(response) {
                        $(".BlockTest").css({"background":"gray","pointer-events":"none"});
                        $rootScope.examData = undefined;
                        $rootScope.show_test = false;   
                    })
                    .error(function(err){
                    })

        
 
            })
    }
            
    $rootScope.prevSlide = function(){
        //$rootScope.numberQuestion = 1 - $rootScope.actual_position;
        //prev_position = $rootScope.actual_position;
        //$rootScope.actual_position -=1;
        //$rootScope.ajax_fetch_user_slide($rootScope.options, "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId);
        
        prev_choices = $rootScope.question_choices;
        prev_position = $rootScope.actual_position;

        $rootScope.actual_position -=1;
        $rootScope.question_choices = {};
        params += "&exam="+$rootScope.examData.pk+"&contentId="+$rootScope.contentId;
        $http.jsonp( config.SERVICE_SERVER + '/api/contents/json_fetch_exam/?callback=JSON_CALLBACK&'+params)
             .success(function(response){
                console.log(response);

                $rootScope.ajax_fetch_user_slide($rootScope.options, "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId+"&choices="+JSON.stringify(prev_choices));
                $rootScope.arrowLeft = true;
                $rootScope.numberQuestion = 1 + $rootScope.actual_position;
                if($rootScope.numberQuestion == 1){
                    $rootScope.arrowLeft = false;
                }
             })
    }


    /**
     *  CONTENTS
     * */
    // This function start the exam
    $rootScope.init_userSlideContainer = function(position, cb){
        $rootScope.actual_position = 0;
        var dict_choices = JSON.stringify($rootScope.choices);
        already_graded=false;
        $rootScope.ajax_fetch_user_slide($rootScope.options);

    };

    $rootScope.updateExam = function(custom_opts){
        console.log("update/??");
        
     	ajax_options = {
            error: function() {
                $rootScope.EXAM_REFRESH_FAILURES = $rootScope.EXAM_REFRESH_FAILURES + 1;
            },

            success: function(response){

                $rootScope.EXAM_REFRESH_FAILURES = 0;

                var first_load = ($rootScope.examData == undefined);
                var modalTimeOut = $("#modalTimeOut");
                $rootScope.examData = response[0];
                $rootScope.numberAllslide = $rootScope.examData.extras.nr_slides;
                console.log($rootScope.numberAllslide);
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
        $rootScope.options_exam = ajax_options;
	    if($rootScope.examData && $rootScope.examData.fields.end_date&& $rootScope.isTutorReview) {
		    return false;
	    }
        $rootScope.ajax_fetch_exam(ajax_options);


    }
    $rootScope.start_exam = function(){
        console.log("start exam");
        params = 'course='+$rootScope.courseId+"&ubs="+$rootScope.studentId+'&module='+$rootScope.moduleId+'&content='+$rootScope.contentId;
        if($rootScope.examData!=undefined){
            params += '&exam='+$rootScope.examData.pk;
        }
        $http.jsonp(config.SERVICE_SERVER + '/api/contents/take_test/?callback=JSON_CALLBACK&'+params)
            .success(function(response){
                console.log(response);
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
 
    // This function update exam status
    $rootScope.ajax_fetch_exam = function(options) {
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


	
}]);

// config JSON

// Api profile
app2.controller("comments", function($scope, $http, $routeParams){
    var url = config.SERVICE_SERVER + '/api/community/?uuid='+$routeParams.uuid+'&callback=JSON_CALLBACK';
    $http.jsonp(encodeURI(url)).success(function(response){
        $scope.commentsForCourse= JSON.stringify(response);
    })
    .error(function(data, status, headers, config){
        //console.log(data, status, headers, config);
    });

});
app2.controller("profile_api",function($scope, $http, $rootScope, coursesGet){

	if(localStorage.dataUser){
		dataUser = JSON.parse(localStorage.dataUser);
		dataUser.photo == "" ? dataUser.photo = "images/bullet3.png" : dataUser.photo;
		$rootScope.dataUser= dataUser;
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
app2.controller("login_api", function($scope, $http, $rootScope){
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

app2.factory('coursesGet', ['$http',function($http) {

	var objData = {};
	var url = config.SERVICE_SERVER + '/api/courses/?callback=JSON_CALLBACK&';
	objData.getData = function(parameter){
		return $http.jsonp(encodeURI(url + parameter + '=1'));
	}

	return objData;

}]);

app2.factory('getCourse', ['$http',function($http) {
    return {
        dataStudent : function(uuid){
            var url = config.SERVICE_SERVER + '/api/course/'+ uuid +'/dataStudent/?callback=JSON_CALLBACK&';
            var response = $http.jsonp(encodeURI(url));
            return response;    
        }
    }    
}]);
// Factory for Animation Top ---------------------------------------------------------------------


/////////////////////////////////////// -- CONTROLLERS --- ///////////////////////////////////////
    
// controller  Navbar  ---------------------------------------------------------------------

app2.controller("navbar_functions", ['$scope','$http','$rootScope', function($scope, $http, $rootScope){

	$scope.menuOpen = false;
	$scope.logout = function(){
		$http.jsonp(config.SERVICE_SERVER+"/api/json_logout/?callback=JSON_CALLBACK").success(function(response){

		});
        $rootScope.dataUser = undefined;
		localStorage.clear(); 
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

app2.controller("footer", function($scope){

	if(localStorage.dataUser){	
		$scope.subscription = false;
	}else{
		$scope.subscription = true;
	}
});

// controller  Login ---------------------------------------------------------------------

app2.controller("main", function($scope, coursesGet){

	coursesGet.getData('public').success(function(response){
		$scope.dataCoursesPublic = response;
	});    
});

// controller All Courses ---------------------------------------------------------------------

app2.controller("allCourses", function($scope, scrolltop, coursesGet){
	scrolltop();
	coursesGet.getData('public').success(function(response){
		$scope.coursesall = response;
	});  
});


// controller for Details Courses --------------------------------------------------------

app2.controller("courseDetails", function($http, $scope, $routeParams, scrolltop){
	
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

app2.controller("certificates",['$scope','scrolltop','coursesGet','$sce',function($scope, scrolltop, coursesGet,$sce){
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

app2.controller("myCourses", function($scope, coursesGet){

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

app2.controller('simpleCourse', ['$http','$scope', '$routeParams', 'getCourse','$modal','$sce', '$rootScope', function ($http, $scope, $routeParams, getCourse, $modal,$sce, $rootScope) {
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
                try{
                    if(document.querySelectorAll("#embedVideo").length > 0 && $scope.dataSimpleCourse ){
                    
                        clearInterval(intervalEmbed);
                        embed = document.querySelector("#embedVideo");
                        embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;


                    }
                }catch(err){
                
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
                        try{
                            if(document.querySelectorAll("#embedVideo").length > 0 && $scope.dataSimpleCourse ){
                            
                                clearInterval(intervalEmbed);
                                embed = document.querySelector("#embedVideo");
                                embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;
                            }
                        }catch(err){
                        
                        }
                    },100);   
                });

                $scope.exam_url = config.SERVICE_SERVER + '/lms/course/' + $scope.uuid + '/module/' + $scope.modules[$scope.modulePosition].module_pk+'/content/' + $scope.modules[$scope.modulePosition].contents[0].content_pk+ '/sit/';
            }catch(err){
                
            }
        });
        $scope.$watch("submodulePosition", function(){
            var intervalEmbed = setInterval(function(){
                try{
                    if(document.querySelectorAll("#embedVideo").length > 0){
                        clearInterval(intervalEmbed);
                        embed = document.querySelector("#embedVideo");
                        embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;

                    }
                }catch(err){
                
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


app2.controller('modalInstanceCtrl', ['$scope','$modalInstance', 'items', function ($scope, $modalInstance, items) {
    
    $scope.text2 = items;

}]);

// controller Tribes ---------------------------------------------------------------------

app2.controller('tribes',['$scope','getCourse','$routeParams','$http', '$rootScope','$sce','$timeout', function($scope,getCourse,$routeParams,$http, $rootScope,$sce,$timeout){
    var response = getCourse.dataStudent($routeParams.uuid);

    response.success(function(data){
        $scope.tribesModule = data.tribes;
        $scope.tribeId = data.tribes[0].id;

        $http.jsonp( config.SERVICE_SERVER + '/api/tribes/get_tribe/?callback=JSON_CALLBACK&tribe_id=' + $scope.tribeId)
            .success(function(response){
                console.log(response);
                $scope.tribesDetails = response;

                $scope.open = false;
                $scope.showTopics = true;

                $scope.loaderTribe = true;
                $scope.commentsVisible = false;
                $scope.alertComment = false;


                $scope.openTopic = function(position){
                    $scope.positionTopic = position;
                    $timeout(function(){
                        $scope.loaderTribe = false;
                        $scope.commentsVisible = true;
                        $scope.alertComment = true;
                    }, 2000);
                    if(position != undefined){
                        $scope.showTopics = false;
                        var pos = position - 1; 
                        $http.jsonp(config.SERVICE_SERVER + '/api/tribes/get_topic/?callback=JSON_CALLBACK&topic_id=' + position)
                            .success(function(response){
                                $scope.comments = response.comments;
                                $scope.parseHtml =  function(html){
                                    return $sce.trustAsHtml(html); 
                                }
                            });
                        $scope.topicDescription = $scope.tribesDetails.topics[pos].description; 
                        $scope.topicName = $scope.tribesDetails.topics[pos].name; 
                        $scope.open == true ?  $scope.open = false : $scope.open = true;  
                    }else{
                        $scope.comments = null;
                        $scope.loaderTribe = true;
                        $scope.commentsVisible = false;
                        $scope.alertComment = false;
                        $scope.showTopics = true;
                        $scope.open == true ?  $scope.open = false : $scope.open = true;
                    } 

                    $scope.idTopic = position;
                }    

            });
        if(data.tribes.length > 0){
            $scope.tribeId = data.tribes[0].id;

            $http.jsonp( config.SERVICE_SERVER + '/api/tribes/get_tribe/?callback=JSON_CALLBACK&tribe_id=' + $scope.tribeId)
                .success(function(response){
                    console.log(response);
                    $scope.tribesDetails = response;

                    $scope.open = false;
                    $scope.showTopics = true;

                    $scope.loaderTribe = true;
                    $scope.commentsVisible = false;
                    $scope.alertComment = false;


                    $scope.openTopic = function(position){
                        $timeout(function(){
                            $scope.loaderTribe = false;
                            $scope.commentsVisible = true;
                            $scope.alertComment = true;
                        }, 2000);
                        if(position != undefined){
                            $scope.showTopics = false;
                            var pos = position - 1; 
                            $http.jsonp(config.SERVICE_SERVER + '/api/tribes/get_topic/?callback=JSON_CALLBACK&topic_id=' + position)
                                .success(function(response){
                                    $scope.comments = response.comments;
                                    $scope.parseHtml =  function(html){
                                        return $sce.trustAsHtml(html); 
                                    }
                                });
                            $scope.topicDescription = $scope.tribesDetails.topics[pos].description; 
                            $scope.topicName = $scope.tribesDetails.topics[pos].name; 
                            $scope.open == true ?  $scope.open = false : $scope.open = true;  
                        }else{
                            $scope.comments = null;
                            $scope.loaderTribe = true;
                            $scope.commentsVisible = false;
                            $scope.alertComment = false;
                            $scope.showTopics = true;
                            $scope.open == true ?  $scope.open = false : $scope.open = true;
                        } 
                    }    

                });
        }
        $scope.post = '';
        $scope.confirm_post = false;
        $scope.alert_post = false;
        $scope.addPost = function(post,id){
            if(post != ''){
                $http.jsonp( config.SERVICE_SERVER + '/api/tribes/send_post/?callback=JSON_CALLBACK&topic=' + id + '&message=' + post)
                    .success(function(response){
                        $scope.confirm_post = true;
                        $http.jsonp(config.SERVICE_SERVER + '/api/tribes/get_topic/?callback=JSON_CALLBACK&topic_id=' + $scope.positionTopic)
                            .success(function(response){
                                $scope.comments = response.comments;
                                $scope.parseHtml =  function(html){
                                    return $sce.trustAsHtml(html); 
                                }
                            });
                    });
                $(".boxPost").toggleClass("paddingNone");
            }else{
                $(".boxPost").toggleClass("paddingNone");
                $scope.alert_post = true;
            }
        }
        $scope.closeAlert = function(){
            $(".boxPost").toggleClass("paddingNone");
            $scope.post = '';
            $scope.confirm_post = false;
            $scope.alert_post = false;
        }
    });
}]);

// controller Jobs ---------------------------------------------------------------------

app2.controller("detailsJobs", function($scope, scrolltop){
	scrolltop();
	// scroll from tab 
	$scope.scrollAnchorBtn = function(event){
		var value = $(event.target).attr("value");
		$('html, body').animate({scrollTop: $("#"+value).offset().top}, 1000);

	}
});

app2.controller("tutors",['$scope','$routeParams','coursesGet',function ($scope,$routeParams,coursesGet){
    var response = coursesGet.getData("uuid="+$routeParams.uuid+"&me");
    response.success(function(data){
       $scope.tutorsData = data[0].tutors;   
    });
      
}]);



/////////////////////////////////////// -- DIRECTIVES --- ///////////////////////////////////////
app2.factory('sessionsFactory', function(){
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

