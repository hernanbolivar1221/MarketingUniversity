app.factory("auth", ["$rootScope","$location",function($rootScope, $location){
    return {
        kme: function ($http, $scope,username,name,email,register,access_token,provider) {
            var uri=config.SERVICE_SERVER+'/api/login_kmeadmin/?callback=JSON_CALLBACK&username='+email+'&name='+ name +'&password='+username;
            $http.jsonp(encodeURI(uri)).success(function(response){
                if(response.status == "logged"){
                    $http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username)
                .success(function(respuesta){
                    //console.log(JSON.stringify(respuesta));
                    sessionStorage.dataUser = JSON.stringify(respuesta);
                    $rootScope.dataUser = respuesta;
                    if (provider){
                    $http.jsonp(config.SERVICE_SERVER +"/api/get_social_tokens/?callback=JSON_CALLBACK&email=" + email +"&provider="+provider+"&token="+access_token)
                    .success(function(respuesta){
                    console.log(JSON.stringify(respuesta));
                    })
                    .error(function(data,b, status,d) {
                     console.log(b,d);
                     });
                    }
                    //aqui acaba

                    $(".modal--ingreso").modal("show").toggle();

                });
            if(register){
                sendRegisterNotification($http,email);
                register = false;
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
        },


        ajax : function($http, $scope, username, userpassword, email){
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
                        $rootScope.dataUser = respuesta;
                        sessionStorage.dataUser = JSON.stringify(respuesta);
                        $(".modal--ingreso").modal("show").toggle();
                        $location.url("/profile");
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
    }
}]);
app.factory("tutors", ["$http", function($http){
    return {
        onCourse : function(slug){
            return $http.jsonp(config.SERVICE_SERVER + "/api/course/getTutors/?slug="+slug+"&callback=JSON_CALLBACK");
        },
    }   
}]);
app.factory('courses', ['$http',function($http) {
    return {
        dataStudent : function(uuid, slug){
            if(slug != undefined){
                
                var url = config.SERVICE_SERVER + '/api/course/dataStudent/?slug='+slug+'&callback=JSON_CALLBACK&';
            }else{
                var url = config.SERVICE_SERVER + '/api/course/'+ uuid +'/dataStudent/?callback=JSON_CALLBACK&';
            }
            var response = $http.jsonp(encodeURI(url));
            return response;    
        },
        public : function(limit){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?public=True&limit="+limit+"&callback=JSON_CALLBACK");
        },
        get : function(uuid, slug){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?uuid="+uuid+"&slug="+slug); 
        },
        completed : function(){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?completed=true&callback=JSON_CALLBACK");
        },
        available : function(){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?available=true&callback=JSON_CALLBACK");
        },
        myCourses : function(){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?in_progress=True&callback=JSON_CALLBACK");
        },
        certifications : function(params){
            return $http.jsonp(config.SERVICE_SERVER+"/api/certifications/"+params+"&callback=JSON_CALLBACK");
        },
        related : function(related){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?related="+related+"&callback=JSON_CALLBACK");
        },
        absolute : function(){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/?absolute=true&callback=JSON_CALLBACK");
        },
        inscribe : function(slug){
            return $http.jsonp(config.SERVICE_SERVER+"/api/courses/inscribeUser/?course="+slug+"&callback=JSON_CALLBACK");
        }

    }
}]);

app.factory('coursesGet', ['$http',function($http) {
	var objData = {};
	var url = config.SERVICE_SERVER + '/api/courses/?callback=JSON_CALLBACK&';
	objData.getData = function(parameter){
		return $http.jsonp(encodeURI(url + parameter + '=1'));
	}

	return objData;

}]);

app.factory("contentService", ["$http",function($http){
    return {
        getURL : function(content_pk){
            return $http.jsonp(config.SERVICE_SERVER + "/api/course/getFile/?content="+content_pk+"&callback=JSON_CALLBACK");
        }
    }

} ]);
