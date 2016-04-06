app.controller('courseContentController', ['$http','$scope', '$routeParams', 'courses','$modal','$sce', '$rootScope',"$location", function ($http, $scope, $routeParams, courses, $modal,$sce, $rootScope, $location) {
    var response = courses.dataStudent(null,$routeParams.slug);

    if(!$rootScope.authenticated){
        $location.path("/");
    }
    // paginador Recursos   
    $scope.slug = $routeParams.slug;
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
    
    $scope.isModuleComplete = function(module){
    
        return $http.jsonp(config.SERVICE_SERVER+ "/api/courses/isModuleComplete/?module="+module+"&slug="+$routeParams.slug+"&callback=JSON_CALLBACK");
            
    }

    $scope.$watch("modulePosition",function(_new,_old){
        Pace.restart();
        $scope.submodulePosition = 0;
        $scope.markContentAsSeen = function(content, module){
            $http.jsonp(config.SERVICE_SERVER+"/api/contents/take_test/?content="+content+"&module="+module+"&callback=JSON_CALLBACK")
                .success(function(response){
                    exam = response.exam;
                    $http.jsonp(config.SERVICE_SERVER+"/api/contents/json_finish_exam/?content="+content+"&module="+module+"&exam="+exam+"&callback=JSON_CALLBACK")
                        .success(function(response){
                            console.log(response);
                        })
                })
                .error(function(a,b,c,d){
                    console.log(b,d);
                
                })
        
        }

        $scope.$watch("submodulePosition", function(newValue, oldValue){
            /**try{
                submodule_old = $scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].module_pk;
                $scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].has_seen = true;
                var url = config.SERVICE_SERVER +'/api/course/isModuleComplete/?callback=JSON_CALLBACK&module='+submodule_old+"&slug="+$routeParams.slug;
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
                
            }*/
            var intervalEmbed = setInterval(function(){
                try{
                    if(document.querySelectorAll("#embedVideo").length > 0 && $scope.dataSimpleCourse ){
                    
                        embed = document.querySelector("#embedVideo");
                        embed.innerHTML = $scope.dataSimpleCourse.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].text;
                        if($scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].contents[0].obligatory){
                            $scope.markContentAsSeen(submodule.contents[0].content_pk, submodule.contents[0].module);

                        }else{
                        
                        }
                        try{
                            $scope.isModuleComplete(submodule.contents[0].module).success(function(response){
                                if(response.is_complete){
                                
                                    $scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].has_seen = true;
                                }
                            });
                            console.log("success");
                        }catch(err){
                            console.log(err);
                        }
                        //$scope.markContentAsSeen(submodule.contents[0].content_pk, submodule.contents[0].module);
                        //$scope.isModuleComplete(submodule.contents[0].module);

                        //$scope.modules[$scope.modulePosition].submodules[$scope.submodulePosition].has_seen = true;
                         
                    }

                        clearInterval(intervalEmbed);
                }catch(err){
                    console.log(err);    
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
        $scope.packItemPosition--;    
    }
    $scope.$watch("packItemPosition", function(){
        $scope.modulePosition = $scope.packItemPosition * 4;
    });

    response.success(function(data){
        $rootScope.courseId = data.course.pk;
        $rootScope.studentId = data.course.ubs;
        //modules

        $scope.dataSimpleCourse = data;
        $scope.$watch("embed", function(_new, _old){
            if($scope.embed != null){
            }
        });
        $scope.$watch("modulePosition",function(){
            //TODO: check all submodule for complete
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
        $scope.moduleStatus = {};
        dataModules = $scope.dataSimpleCourse.modules;
        $scope.modules = dataModules;
        $scope.$watch("modules", function(){

        })
        $scope.simpleItems = split_array_for_slides(dataModules,4);

        $rootScope.moduleId = $scope.modules[$scope.modulePosition].module_pk;

        $rootScope.contentId = $scope.modules[$scope.modulePosition].contents[0].content_pk;
        $scope.$watch("simpleItems", function(_new, _old){
        });
        $scope.markAsSeen = function(module_pk){
            for(var i=0; i< $scope.modules.length; i++){
                exam_available = true; 
                for(var j=0; j< $scope.modules[i].submodules.length; j++){
                    if($scope.modules[i].submodules[j].module_pk == module_pk){
                        $scope.modules[i].submodules[j].has_seen = true;
                        console.log($scope.modules[i].submodules[j]);
                    }
                   
                    exam_available = exam_available && $scope.modules[i].submodules[j].has_seen;
                }
                $scope.modules[i].can_open = exam_available;
            }
        }
        for(var i=0; i< $scope.modules.length; i++){

            for(var j=0; j<$scope.modules[i].submodules.length;j++){

                $scope.isModuleComplete($scope.modules[i].submodules[j].module_pk).success(function(response){
                    Pace.restart();
                    if(response.is_complete){
                        $scope.markAsSeen(response.module);
                    }
                })

            }
        }


        // Evaluations

        var AllEvaluations = [];

        for(index in dataModules){
            AllEvaluations.push(data.modules[index].contents);
        }

        $scope.evaluations = AllEvaluations;

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

app.controller('tribes',['$scope','courses','$routeParams','$http', '$rootScope','$sce','$timeout', function($scope,courses,$routeParams,$http, $rootScope,$sce,$timeout){
    var response = courses.dataStudent(null,$routeParams.slug);

    response.success(function(data){
        $scope.tribesModule = data.tribes;
        try{
            $scope.tribeId = data.tribes[0].id;
        }catch(err){
            $scope.tribeId = null;
        }

        $http.jsonp( config.SERVICE_SERVER + '/api/tribes/get_tribe/?callback=JSON_CALLBACK&tribe_id=' + $scope.tribeId)
            .success(function(response){
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
                        topic = null;
                        for(var i=0; i<$scope.tribesDetails.topics.length; i++){
                            if($scope.tribesDetails.topics[i].id == pos){
                                $scope.topicDescription = $scope.tribesDetails.topics[i].description; 
                                $scope.topicName = $scope.tribesDetails.topics[i].name; 
                                $scope.open == true ?  $scope.open = false : $scope.open = true;  
    
                            }
                        }
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
                                })  
                                .error(function(a,b,c,d){
                                    console.log(b,d);
                                });
                            for(var i=0; i<$scope.tribesDetails.topics.length; i++){
                                console.log($scope.tribesDetails.topics, position);
                                if(position == $scope.tribesDetails.topics[i].id){
                                    $scope.topicId = position;
                                    $scope.topicDescription = $scope.tribesDetails.topics[i].description; 
                                    $scope.topicName = $scope.tribesDetails.topics[i].name; 
                                    $scope.open == true ?  $scope.open = false : $scope.open = true;  
                                   
                                }
                            }
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

app.controller("tutors",['$scope','$routeParams','courses',function ($scope,$routeParams,courses){
    var response = courses.get(null,$routeParams.slug);
    response.success(function(data){
       $scope.tutorsData = data[0].tutors;   
    });
      
}]);


app.controller("courseDetails", ["$http", "$scope", "$routeParams", "scrolltop", "$location", "$rootScope","courses",function($http, $scope, $routeParams, scrolltop, $location, $rootScope, courses){
    $scope.inscribeUserOnCOurse = function(){
        console.log(123);
        courses.inscribe($routeParams.slug).success(function(response){
            if(response.status == "ok"){
                $location.path("#/course/"+$routeParams.slug);
            }
        });
    }

	scrolltop();
    $scope.slug=  $routeParams.slug;
    $rootScope.detailGetInCourse = false;
    $rootScope.detailRegisterCourse = false;
    $scope.url = "#/course/"+$routeParams.slug;
    $rootScope.$watch("detailGetInCourse", function(){
        $scope.showGetInButton = $rootScope.detailGetInCourse;
        console.log("ingresar", $scope.showGetInButton);
    });
    $rootScope.$watch("detailRegisterCourse", function(){
        $scope.showRegisterButton = $rootScope.detailRegisterCourse;

        console.log("registrar", $scope.showRegisterButton);
    })
	var dataSessionInitial,
		dataSessionFinal;

	var url = config.SERVICE_SERVER + '/api/courses/get/?callback=JSON_CALLBACK&slug=' + $routeParams.slug;
		$http.jsonp(encodeURI(url)).success(function(response){
			$scope.dataDetails = response[0];
			$scope.dataSessionDates = []
            console.log(response);
            if(response.length > 0){
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
            };
		})
    	.error(function(data, status, headers, config){
            console.log(data, status, headers, config);
    	});	
}]);

app.factory('scrolltop', [function () {
	
	return function scrollTop(){
		$('html,body').animate({scrollTop: 0}, 1000);
	};
}])

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
app.controller("comments", function($scope, $http, $routeParams){
    var url = config.SERVICE_SERVER + '/api/community/?uuid='+$routeParams.uuid+'&callback=JSON_CALLBACK';
    $http.jsonp(encodeURI(url)).success(function(response){
        $scope.commentsForCourse= JSON.stringify(response);
    })
    .error(function(data, status, headers, config){
        //console.log(data, status, headers, config);
    });

});

