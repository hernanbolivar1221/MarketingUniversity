app.controller("footer", function($scope){

    if(sessionStorage.dataUser){  
        $scope.subscription = false;
    }else{
        $scope.subscription = true;
    }
});
app.controller("navbarController", ['$scope','$http','$rootScope', "$location", function($scope, $http, $rootScope, $location){

    $rootScope.showMenu =false;
    $rootScope.$watch("dataUser", function(){
        $scope.user_avatar = $rootScope.dataUser != null ? $rootScope.dataUser.photo : "";
    })
    $scope.seeMenu = false;
    $scope.toggleMenuNavbar = function(){

        $scope.seeMenu = !$scope.seeMenu;


    }

    $rootScope.$on("$locationChangeSuccess", function(_new, old){
        console.log(_new);
        scrollTo(0,0); 
        Pace.restart();
        path = $location.path();
        if(path == "/profile"){
            $scope.showMenu = false;
            $rootScope.showMenu = false;
        }else{
            $scope.showMenu = true;
            $rootScope.showMeny =true;
        }
    });



    $rootScope.$watch("dataUser", function(){

        if($rootScope.dataUser == null){
            $rootScope.authenticated = false;
            $scope.authenticated_navbar = false;
        }else{
            $rootScope.authenticated = true;
            $scope.authenticated_navbar = true;
            $rootScope.first_name = $rootScope.dataUser.name;
            $rootScope.last_name = $rootScope.dataUser.lastname;
            if(sessionStorage.locate != undefined){
                $location.path(sessionStorage.locate);
                sessionStorage.removeItem("locate");
                sessionStorage.removeItem("location_state");
            }else{
                $location.path("/profile");
            }
        }
    })
    if(sessionStorage.dataUser != undefined){
        $rootScope.dataUser = JSON.parse(sessionStorage.dataUser);
    }
    $scope.showCourses = function(){
        $rootScope.display_menu = 1;
        courseView = document.querySelector("#courseView");
        certificationsView = document.querySelector("#certificationsView");
        toolsView = document.querySelector("#toolsView");
        courseView.classList.add("active");
        certificationsView.classList.remove("active");
        toolsView.classList.remove("active");
        $location.path("/profile");
    }
    $scope.showTools = function(){
        $rootScope.display_menu = 3;
        courseView = document.querySelector("#courseView");
        certificationsView = document.querySelector("#certificationsView");
        toolsView = document.querySelector("#toolsView");
        courseView.classList.remove("active");
        certificationsView.classList.remove("active");
        toolsView.classList.add("active");

        $location.path("/profile");
    }
    $scope.showCertifications = function(){

        $rootScope.display_menu = 2;
        courseView = document.querySelector("#courseView");
        certificationsView = document.querySelector("#certificationsView");
        toolsView = document.querySelector("#toolsView");
        courseView.classList.remove("active");
        certificationsView.classList.add("active");
        toolsView.classList.remove("active");
        $location.path("/profile");
    }

    $scope.menuOpen = false;
    $scope.logout = function(){
        $http.jsonp(config.SERVICE_SERVER+"/api/json_logout/?callback=JSON_CALLBACK").success(function(response){

            $rootScope.dataUser = undefined;
            sessionStorage.clear(); 
        });
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
app.controller("loginController", ["auth","$scope","$http","$rootScope", "$location", function(auth, $scope, $http, $rootScope, $location){
    $rootScope.$watch("dataUser", function(){

        if($rootScope.dataUser == null){
            $rootScope.authenticated = false;
            $scope.authenticated = false;
        }else{
            $rootScope.authenticated = true;
            $scope.authenticated_navbar = true;
            $rootScope.first_name = $rootScope.dataUser.name;
            $rootScope.last_name = $rootScope.dataUser.lastname;
        }
    })
    if(sessionStorage.dataUser != undefined){
        $rootScope.dataUser = JSON.parse(sessionStorage.dataUser);
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
            auth.ajax($http, $scope,userName, userPassword);
        }
    }
    $scope.FBLogin = function (register) {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var access_token =   FB.getAuthResponse()['accessToken'];
                FB.api('/me?fields=name,email', function (response) {
                    username=response.email;
                    username=username.replace("@","");
                    username=username.replace(".","");
                    auth.kme($http, $scope,username,response.name,response.email,register,access_token,"facebook");
                });
            }
            else {
                FB.login(function (response) {
                    if (response.authResponse) {
                        var access_token =   FB.getAuthResponse()['accessToken'];
                        FB.api('/me?fields=name,email', function (response) {
                            username=response.email;
                            username=username.replace("@","");
                            username=username.replace(".","");
                            auth.kme($http, $scope,username,response.name,response.email,register,access_token,"facebook");
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
        auth.ajax($http, $scope, userNameNew, userPasswordNew,userEmail);
    }
}]);

