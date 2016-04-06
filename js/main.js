// ---------------------- script Nuevosmedios ------------------------------

var app = angular.module('App', ['ngRoute','ngAnimate','ui.bootstrap','dibari.angular-ellipsis','truncate']);

// -- rutas en Angular

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html',
		})
		.when('/profile', {
			templateUrl: 'views/profile.html'
		})
		.when('/course/:slug/details', {
			templateUrl: 'views/courseDetail.html',
			controller : "courseDetails"
		})
		.when('/certificate/:uuid/details', {
			templateUrl: 'views/certificates/detailCertification.html',
			controller : "certificates"
		})
		.when('/allCourses', {
			templateUrl: 'views/allCoursesPublic.html',
		})
		.when('/allCertificates', {
			templateUrl: 'views/certificates/allCertificates.html',
			//controller: "certificates"
		})
		.when('/jobs', {
			templateUrl: 'views/bagJobs.html'
		})
		.when('/detailsJobs', {
			templateUrl: 'views/detailsJobs.html'
		})
		.when('/course/:slug', {
			templateUrl: 'views/courses/simpleCourse.html',
			controller: 'courseContentController'
		})
		.otherwise({ 
			redirectTo: '/' 
		});

        //$locationProvider.html5Mode(true);
}]);

app.run(["$rootScope","$location", "$http", "$window", function($rootScope, $location, $http, $window){
    $window.onunload = function(){
        sessionStorage.locate = $location.path();
        sessionStorage.location_state = 1;
    }
    $rootScope.contents_url = [];
    $rootScope.template ='views/courses/content_user_opt.html';
    $rootScope.dataUser = null;
    $rootScope.random = function(){
            return 0.5 - Math.random();
    };

    //Evaluations
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
                console.log(err);
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
                console.log("12123123123");
                $rootScope.user_answers = null;
                $rootScope.ajax_fetch_user_slide($rootScope.options, "&position="+$rootScope.actual_position+"&actual_position="+prev_position+'&course_id='+$rootScope.courseId+"&choices="+JSON.stringify(prev_choices));
                $rootScope.arrowLeft = true;
                $rootScope.numberQuestion = 1 + $rootScope.actual_position;
                console.log($rootScope.numberQuestion);
                if($rootScope.numberAllslide == $rootScope.numberQuestion){
                    $rootScope.arrowRight = false;
                    $rootScope.finish = true;
                }
             }).error(function(){
                console.log("error: fetch exam");
             })
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

                if($rootScope.numberAllslide == $rootScope.numberQuestion){
                    console.log(1123);
                }
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
        params = 'course='+$rootScope.courseId+"&ubs="+$rootScope.studentId+'&module='+$rootScope.moduleId+'&content='+$rootScope.contentId;
        if($rootScope.examData!=undefined){
            params += '&exam='+$rootScope.examData.pk;
        }
        $http.jsonp(config.SERVICE_SERVER + '/api/contents/take_test/?callback=JSON_CALLBACK&'+params)
            .success(function(response){
                if(response.status == 'ok'){
                   $rootScope.updateExam(response); 
                }
            }).error(function(a,b,c,d){
                console.log(b,d);
            
            });
    }
    $rootScope.open_test = function(module, content, item){
        $rootScope.moduleId = module;
        $rootScope.contentId = content;
        $rootScope.modulePosition = 0;
        $rootScope.submodulePosition = 0;
        $rootScope.packItemPosition = 0;
        $rootScope.show_test = true;
        $rootScope.start_exam();
        courseContent = $(".menuTab>li")[0];
        $(courseContent).addClass("active");
        
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



    //end Evaluations
}])

var funciones =
{
    tabs_internos_perfil_cursos : function ()
    {
        $('#accordContenidos a[data-toggle="tab"]').on('shown.bs.tab', function (e)
        {
            $('#accordContenidos .panel-heading a').removeClass('active');
            $(e.target).addClass('active');
        });

        $('#tabsLecciones').on('show.bs.tab', function ()
        {
            $(this).find('li[role="presentation"]').removeClass('active');
        });
    },

    tabs_internos_detalle_especializacion : function ()
    {

        $('#detalleModulos a[data-toggle="tab"]').on('shown.bs.tab', function (e)
        {
            $('#detalleModulos .panel-heading a').removeClass('active');
            $(e.target).addClass('active');
        });

    },

    menu_top : function ()
    {
        $('.js-funtionMenu').click( function (e)
        {
            e.preventDefault();
            $('.js-menuInit').toggleClass('disabled');

        });

        $(".js-scrollTo").on('click', function(e)
        {
            e.preventDefault();
            var hash = this.hash;

            $('html, body').animate(
            {
                scrollTop: $(hash).offset().top
            }, 300);

        });
    }
}

funciones.menu_top();



