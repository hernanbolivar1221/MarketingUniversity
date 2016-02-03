/**
*   @author     Henry Arnulfo Gomez Montenegro
*   @brief      function calculate days amount between two dates
*   @input      params  :   json with all necesary data for make calcs, initial_date, final_date
*   @output     days    :   days value
*   @date       created 01-02-2016 - updated 01-02-2016
*   @version    0.1
*/
function amountOfDays(params){
    if(!params){
        throw NullParamatersException();    
    }
    date1 = new Date(params.initial_date);
    date2 = new Date(params.final_date);
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
    var duration = Date.daysBetween(date1, date2);
    return duration;
} 

/**
*   @author     Henry Arnulfo Gomez Montenegro
*   @brief      change values on template date and duration related
*   @input      params  :   json with all necesary data for make calcs, initial_date, final_date, hours
*   @output     integer    :   1 - success | 2 - failure
*   @date       created 01-02-2016 - updated 01-02-2016
*   @version    0.1
*/
function changeTimeValues(params){
    if(!params){
        throw new NullParamatersException();   
    }else if(typeof(params) != "object"){
        throw new WrongTypeException("JSON");
    }else if(params["initial_date"] == "" || params["final_date"] == "" || params["hours"] == ""){
        throw  new EmptyParametersException();
    }else if(params["initial_date"] == undefined || params["final_date"] == undefined || params["hours"] == undefined){
        throw new UndefinedParamtersException(JSON.stringify(params));
    }else{
        var days = null;
        days = amountOfDays(params);
    } 
}

/**
*   @author     Henry Arnulfo Gomez Montenegro
*   @brief      get public courses from kme instance
*   @input      $http & limit : value which represent max elements to get
*   @output     null
*   @date       created 01-02-2016 - updated 01-02-2016
*   @version    0.1
*/
function getPublicCourses($http, limit){
    var url = config.SERVICE_SERVER + '/api/getPublicCourses/?callback=JSON_CALLBACK&limit='+(limit ? limit : 4);
    $http.jsonp(encodeURI(url)).success(function(response){
        //console.log(response);
    })
    .error(function(data, status, headers, config){
        //console.log(data, status, headers, config);
    });
}

/**
*   @author     Henry Arnulfo Gomez Montenegro
*   @brief      change values on template date and duration related
*   @input      $http
*   @output     null
*   @date       created 01-02-2016 - updated 01-02-2016
*   @version    0.1
*/
function getAllCourses($http){
    var url = config.SERVICE_SERVER+'"/lms/courses/json/fetch_available_courses/?callback=JSON_CALLBACK';
    $http.jsonp(url).success(function(response){
    })
    .error(function(data, status, headers, config){
        console.log("GET ERROR", data, status, headers, config);
    })
    
}

/**
*   @author     Henry Arnulfo Gomez Montenegro
*   @brief      function to send email from kme instance
*   @input      $http & email : destination
*   @output     null
*   @date       created 01-02-2016 - updated 01-02-2016
*   @version    0.1
*/
function sendRegisterNotification($http,email){
    subject = config.TEMPLATES.registerTemplate.subject;
    template = config.TEMPLATES.registerTemplate.template;
    body = config.TEMPLATES.registerTemplate.body;
    from = config.TEMPLATES.registerTemplate.from; 
    url = config.SERVICE_SERVER + "/api/send_email/?callback=JSON_CALLBACK&subject="+subject+"&body="+body+"&from="+from+"&email="+email+";&template="+template;
    $http.jsonp(url).success(function(respuesta){
    });

}

//TODO: writte comments
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
            $http.jsonp(config.SERVICE_SERVER +"/api/get_profile_data/?callback=JSON_CALLBACK&username=" + username)
                .success(function(respuesta){
                    //console.log(JSON.stringify(respuesta));
                    localStorage.dataUser = JSON.stringify(respuesta);
                    $(".modal--ingreso").modal("show").toggle();
                    location.href = "#/profile";
                    location.reload();

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
}


