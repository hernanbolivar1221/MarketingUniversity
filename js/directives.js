app.directive("buttonCourse", ['sessionsFactory','$rootScope','$routeParams', function(sessionsFactory, $rootScope, $routeParams){
    return {
        restrict : "EA",
template : '<a href="{{url}}" class="btn btn--academy2 btn-xlg text--upper margin--t1 margin--b1" ng-class="{btnRojo:registerCourse, btnSuccess: showCourseButton}" id="buttonCourse" ng-if="showCourseButton"><span ng-if="getInCourse">Ingresar</span><span ng-if="registerCourse">Registrate</span></a>',
link : function(scope, element, attrs){
    scope.$watch("sessions", function(){
        scope.getInCourse = false;
        scope.registerCourse = false;
        sessions = scope.sessions;
        try{
            if(scope.sessions != ""){
                has_session = false;
                console.log(sessions);
                sessions = JSON.parse(sessions);
                console.log(sessions);
                button = document.querySelector("#buttonCourse");
                for(session of sessions){
                    if(session.score != null){
                        has_session = true;
                    }
                }
                
                if(has_session){
                    scope.getInCourse = true;
                    scope.url = '#/course/'+$routeParams.slug;
                }else{
                    uuid = scope.uuid;
                    session_available = sessionsFactory.firstAvailable(sessions);
                    if(!session_available){
                        scope.showCourseButton = false;
                    }
                    console.log(session_available);
                    username = JSON.parse(sessionStorage.dataUser).username;
                    scope.registerCourse = true;
                    scope.url = '';
                    //button.innerHTML = "Inscribete";
                    //button.onclick = function(){
                    //    sessionsFactory.inscribe(uuid, dataUser.username, session_available); 
                    //}
                }

                scope.showCourseButton = true;
            }

        }catch(err){
            console.log(err);
            //console.log(sessions);
            scope.showCourseButton = false;
        }
    });
},
    scope : {
        sessions : '@sessions',
        slug : '@slug',
        username : '@username',
    }
}        
}]);

app.directive('tabsCustomVertical', ["$rootScope",function ($rootScope) {
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
        scope.template = $rootScope.template;

        scope.tabs = [
        {
            name: ' Salón de Clase', 
                icon: 'fa fa-desktop fa-fw', 
                active:true, 
                template: 'views/courses/courseContents.html' 
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
        $rootScope.$watch("show_test", function(){
            if($rootScope.show_test){
                scope.tabs[0].active = true;
            }
        })
        var loadBar = setInterval(function(){
            var nav = document.querySelector("ul.nav-tabs");
            try{
                nav.remove();  
            
                if(nav.length == null){
                clearInterval(loadBar);
                }
            }catch(err){
                Pace.restart();
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

                var timeInterval = setInterval(function(){
                    var elementFind =  $(".description-module").find("ul:first").find("a");    
                    if($(".descriptionSmall").length != 0){
                        clearInterval(timeInterval);
                    }else{
                        elementFind.append(contentDescription);      
                    }
                },500);


            }
        });				
    },	
    scope: {
        description: '@'
    }
    }
}]);
app.directive("tabsCustomHorizontal", ['$routeParams', function($routeParams){
    return {
        restrict : 'EA',
    templateUrl : 'views/courses/courseContents.html',
    link : function(scope, element, attrs){
    },
    scope : {

    }
    } 
}]);

app.directive("iframeContent", [function(){
    return {
        restrict : 'EA',
    template : '<div class="submoduleVideo"></div>',
    link : function(scope, element, attrs) {
        video = document.querySelector(".submoduleVideo");
        scope.path != "" || scope.path != null  ? video.innerHTML = scope.path : null ;
    },
    scope : {
        path : "@",
    subPos : "@"
    }
    }
}]);

app.directive('tabsCustomHorizontalOri', ['$sce', '$routeParams',function ($sce, $routeParams) {
    return {
        restrict: 'EA',
    template:   '<tabset justified="true" type="pills" > ' +
    '<tab class="linkItem" ng-repeat="subItem in item.submodules" heading="">' +
    '<div class="col-md-8">'+
    '<div ng-bind-html="parseHtml(subItem.contents[0].text)"></div>'+
    '<table class="table table--recursos margin--t2">'+
    '<tbody>'+
    '<tr>'+
    '<th>Recursos: Lecturas Recomendadas</th>'+
    '<th>Autor</th>'+
    '<th>Acción</th>'+
    '</tr>'+
    '<tr ng-repeat="itemResource in subItem.contents">'+
    '<td ng-hide="$first">{{itemResource.content_name}}</td>'+ 
    '<td ng-hide="$first">{{itemResource.content_description}}</td>'+ 
    '<td ng-hide="$first" class="linkResource">'+
    '<a target="_blank"  module="{{itemResource.module}}" content="{{itemResource.content_pk}}" download  data-name="{{itemResource.content_name}}">Descargar</a>'+

    '</td>'+ 
    '</tr>'+
    '</tbody>'+
    '</table>'+    
    '</div>'+    
    '<div class="col-md-4 sidebar-right text-center">' +
    '<p class="text text--lite text--gris margin--b1 margin--t05 text--xbold"> Progreso Lección {{item.position + 1}} </p>' +
    '<div class="c100 center p{{item.percentage_done}} center-block">' +
    '<span>{{item.percentage_done}}%</span>' +
    '<div class="slice">' +
    '<div class="bar"></div>' +
    '<div class="fill"></div>' +
    '</div>' +
    '</div>' +
    '<div class="clearfix"></div>' +
    '<p class="text text--lite text--gris text--upper margin--b0 margin--t2"> Puntos de marketing ninja: </p>' +
    '<p class="text text--xbold text--xxlg text--gris text--upper margin--b0 margin--t0"> {{item.percentage_done}} </p>' +
    '<div class="clearfix"></div>' +
    '<a class="btn btn-verde btn-lg margin--t1 typeform-share" ng-disabled="btnDisableTest" href="" module="{{item.module_pk}}" content="{{item.contents[0].content_pk}}"ng-click="modalOpen()">' +
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

        var intervalLoad = setInterval(function(){
            var linkA = $(".linkResource").find("a");
            linkA.text("Ver Recurso").addClass("btn btn-gosh btn-xsm btn-gosh--verde pull-right text--upper");
            if(linkA.length != 0){
                clearInterval(intervalLoad);
                links = document.querySelectorAll(".linkResource>a");
                for(var link = 0; link < links.length; link++){
                    try{
                        module = links[link].getAttribute("module");
                        content = links[link].getAttribute("content");
                        name = links[link].getAttribute("data-name");
                        uuid = $routeParams.uuid;
                        //links[link].href = config.SERVICE_SERVER + '/' +links[link].getAttribute("value");    
                        links[link].href = config.SERVICE_SERVER + '/lms/course/' + uuid +'/module/' + module + '/content/' + content +'/sit/files/'; 
                    }catch(err){
                        console.log(links[link]);    
                    }
                }

                submodules= document.querySelectorAll(".linkItem");
                function is_submodule_active(element, index, array){
                    if(element == 'active'){
                        return true;    
                    }        
                }
                console.log(submodules);
                if(submodules.length == 1){
                    scope.btnDisableTest = false;   
                    console.log("? no way");
                }else if(submodules.length > 1){
                    last_submodule = submodules[submodules.length - 1];
                    is_active = false;
                    for(var i=0; i<last_submodule.classList.length; i++){
                        if(last_submodule.classList[i] == 'active'){
                            is_active = true;
                        }
                    }
                    scope.btnDisableTest = is_active;
                    console.log("test");


                }

            }

        },100);


        scope.parseHtml =  function(html){
            return $sce.trustAsHtml(html);
        }
        scope.openHref = function(url){
            return config.SERVICE_SERVER + url;
        }


        // button Test

        var btnTestElement = $(".linkItem").find("a");

        btnTestElement.on('click',function(){
            $(this).addClass("itemCheck");
        }); 

        scope.btnDisableTest = true;
    }
    }
}]);

app.directive('commentsOnCourse', ['$http','$routeParams',function($http, $routeParams){
    return {
        restrict : 'EA',
    template : `<div class="row" ng-repeat='value in values | limitTo:3'>
    <div class="col-xs-12 sidebar-blanco sidebar-section" data="{{value}}" test="value">
    <div class="col-xs-12">
    <div class="row">
    <div class="col-xs-3 vertical-middle">
    <img src="{{value.avatar}}" alt="" class="img-circle sidebar-imageCurso__image img-responsive"  onload="">
    </div>
    <div class="col-xs-9 vertical-middle">
    <p class="text text--azul margin--t1">
{{value.username}}
<br>
<span class="text--gris">{{ value.jobtitle }}</span>
</p>
</div>
</div
</div>
<div class="col-xs-12 margin--t1">
<p class="text text--lite text--sm">
{{value.comment}}
</p>
</div>  
</div>
</div>`,
    link : function(scope, element, attrs){
        $http.jsonp(config.SERVICE_SERVER + '/api/community/?callback=JSON_CALLBACK&uuid='+$routeParams.uuid).success(function(response){
            scope.values = response;    
        });
    },
    scope : {
        data : '@'    
    }
}    
}])
app.directive('competenciesList', [function(){
    return {
        restrict : 'EA',
    template : '<ol id="competenciesList" class="list-normal text text--gris margin--t1"></ol>',
    link : function(scope, element, attrs){

        competencies = [];
        list = document.querySelector("#competenciesList");
        for(competence in scope.data){
            competencies[competence] = document.createElement("li");
            competencies[competence].innerHTML = scope.data[competence].description;
            list.appendChild(compentecies[competence]);
        }

    },
    scope : {
        data : '@'    
    }
    }   
}])
app.directive('cDetails', [function () {
    return {
        restrict: 'EA',
template :  '<p class="text text--gris" id="courseAbout">{{about}}</p>',
link: function (scope, element, attrs) {
    scope.$watch("data", function(){

        document.querySelector("#courseAbout").innerHTML = scope.data;
        classList = "list-normal text text--gris margin--t1";
        classList = classList.split(" ");

        list = document.querySelector("#courseAbout>ul");
        for(var i=0; i< classList.length; i++){
            if(list != null){
                list.classList.add(classList[i]);
            }
        }
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
            cgoals = document.querySelector("#dataGoals>ol");
            classList = "list-normal text text--gris margin--t1";
            classList = classList.split(" ");
            for(var i=0; i<classList.length; i++){
                if(cgoals != null){
                    cgoals.classList.add(classList[i]);
                }
            }
        });
    },
    scope:{
        goals : "@goals",
    }

    };
}]);
app.directive("totalDuration", function(){
    return {
        restrict : "EA",
        template : '<span>{{time}}</span>',
        link : function(scope){
            value = parseInt(scope.seconds) / 604800;
            if(value > 1){
                scope.time = value.toFixed() + " Semanas";
            }else{

                scope.time = (parseInt(scope.seconds) / 86400).toFixed() + " Días";
            }
        },
        scope: {
            seconds : "@"
        }
    }
});
app.directive('cDuration', [function(){
    return {
        restrict : 'EA',
    template : '<p id="courseDuration"></p>',
    link : function(scope, element, attrs){
        if(!scope.details){
            collection = [scope.initial, scope.final, scope.hours];
            scope.$watchCollection('collection', function(newValue, oldValue){
                changeTimeValues({
                    "initial_date" : scope.initial, 
                    "final_date" : scope.final, 
                    "hours" : scope.hours
                });
            });
        }else{
            scope.$watch('data', function(){
                console.log(scope.data);   
            }); 
        }


    },
    scope : {
        initial : '@initial',
        final : '@final',
        data :  '@',
        details : '@',
        hours : '@'

    }
    }    
}]);

app.directive("userTest",["$rootScope",function($rootScope){
    return  {
        restrict: 'EA',
        templateUrl : 'views/courses/user_test.html',
        link : function(scope, element, attrs ){
        },
        scope : {

        }
    }    
}]);

app.directive('bookmarklet',["$rootScope", function ($rootScope) {

    return {
        restrict: 'A',
    scope: {},
    link: function($scope, element, attrs) {
        if (element[0].tagName !== 'A') {
            return;  // simply do nothing (or raise an error)
        }
        if($rootScope.authenticated){
            element[0].href = 
        `javascript:(function()%7Bfunction%20callback()%7B(function(%24)%7Bvar%20jQuery%3D%24%3Bstatement%20%3D%20%7B%22actor%22%3A%20%7B%22name%22%3A%20`+`"`+$rootScope.dataUser.username+`"`+`%2C%22mbox%22%3A%20%22mailto%3A%22%2B`+`"`+$rootScope.dataUser.email+`"`+`%7D%2C%22verb%22%3A%20%7B%22id%22%3A%20%22http%3A%2F%2Fadlnet.gov%2Fexpapi%2Fverbs%2Fexperienced%22%2C%22display%22%3A%20%7B%20%22en-US%22%3A%20%22experienced%22%20%7D%7D%2C%22object%22%3A%20%7B%22id%22%3A%20%22http%3A%2F%2Fexample.com%2Factivities%2Fhang-gliding-test%22%2C%22definition%22%3A%20%7B%22type%22%3A%20%22http%3A%2F%2Fadlnet.gov%2Fexpapi%2Factivities%2Fassessment%22%2C%22name%22%3A%20%7B%20%22en-US%22%3A%20%22Hang%20Gliding%20Test%22%20%7D%2C%22description%22%3A%20%7B%22en-US%22%3A%20%22The%20Solo%20Hang%20Gliding%20test%2C%20consisting%20of%20a%20timed%20flight%20from%20the%20peak%20of%20Mount%20Magazine%22%7D%2C%22extensions%22%3A%20%7B%7D%7D%2C%7D%2C%22result%22%3A%20%7B%22completion%22%3A%20true%2C%22success%22%3A%20true%2C%22extensions%22%3A%20%7B%7D%7D%2C%22context%22%3A%20%7B%22extensions%22%3A%20%7B%7D%7D%7D%3Bimage%20%3D%20document.querySelector(%22meta%5Bproperty%3D'og%3Aimage'%5D%22)%3Btitle%20%3D%20document.querySelector(%22meta%5Bproperty%3D'og%3Atitle'%5D%22)%3Bdescription%20%3D%20document.querySelector(%22meta%5Bproperty%3D'og%3Adescription'%5D%22)%3Btype%20%3D%20document.querySelector(%22meta%5Bproperty%3D'og%3Atype'%5D%22)%3Bconsole.log(type)%3Bsite_name%20%3D%20document.querySelector(%22meta%5Bproperty%3D'og%3Asite_name'%5D%22)%3Burl%20%3D%20location.href%3Bkeywords%20%3D%20document.querySelector(%22meta%5Bname%3D'keywords'%5D%22)%3Bauthor%20%3D%20document.querySelector(%22meta%5Bname%3D'author'%5D%22)%3Btwitter%20%3D%20document.querySelector(%22meta%5Bname%3D'twitter%3Asite'%5D%22)%3Bnews_keywords%20%3D%20document.querySelector(%22meta%5Bname%3D'news_kewywords'%5D%22)%3Bhtml%20%3D%20'%3Cdiv%20class%3D%22col-md-12%22%20id%3D%22containerBmlet%22%3E%20%3Ch3%20class%3D%22text-center%22%3EAgregar%20a%20Favoritos%3C%2Fh3%3E%20%3Cdiv%20class%3D%22col-md-4%20col-sm-4%22%3E%20%3Cdiv%20class%3D%22form-group%20text-center%22%3E%20%3Clabel%20for%3D%22imageBookmarlet%22%3EImagen%3C%2Flabel%3E%20%3Cinput%20type%3D%22image%22%20name%3D%22imageBookmarlet%22%20class%3D%22form-control%20form-image%22%20placeholder%3D%22Search%22%20src%3D%22http%3A%2F%2Fkmelx.com%2Fstatic%2Fimages%2Fno-thumbnail.jpg%22%3E%20%3C%2Fdiv%3E%3Cdiv%20class%3D%22form-group%20text-center%22%3E%20%3Cdiv%20class%3D%22stars%22%3E%20%3Clabel%20for%3D%22scoreBookmarlet%22%3EPuntaje%3C%2Flabel%3E%20%3Cform%20action%3D%22%22%20id%3D%22scoreBookmarlet%22%3E%20%3Cinput%20class%3D%22star%20star-5%22%20data-value%3D%225%22%20id%3D%22star-5%22%20type%3D%22radio%22%20name%3D%22star%22%3E%20%3Clabel%20class%3D%22star%20star-5%22%20for%3D%22star-5%22%3E%3C%2Flabel%3E%20%3Cinput%20class%3D%22star%20star-4%22%20id%3D%22star-4%22%20data-value%3D%224%22%20type%3D%22radio%22%20name%3D%22star%22%3E%20%3Clabel%20class%3D%22star%20star-4%22%20for%3D%22star-4%22%3E%3C%2Flabel%3E%20%3Cinput%20class%3D%22star%20star-3%22%20id%3D%22star-3%22%20type%3D%22radio%22%20data-value%3D%223%22%20name%3D%22star%22%3E%20%3Clabel%20class%3D%22star%20star-3%22%20for%3D%22star-3%22%3E%3C%2Flabel%3E%20%3Cinput%20class%3D%22star%20star-2%22%20id%3D%22star-2%22%20type%3D%22radio%22%20data-value%3D%222%22%20name%3D%22star%22%3E%20%3Clabel%20class%3D%22star%20star-2%22%20for%3D%22star-2%22%3E%3C%2Flabel%3E%20%3Cinput%20class%3D%22star%20star-1%22%20id%3D%22star-1%22%20type%3D%22radio%22%20data-value%3D%221%22%20name%3D%22star%22%3E%20%3Clabel%20class%3D%22star%20star-1%22%20for%3D%22star-1%22%3E%3C%2Flabel%3E%20%3C%2Fform%3E%20%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cdiv%20class%3D%22form-group%20text-center%22%3E%20%3Clabel%20for%3D%22typeBookmarlet%22%3ETipo%3C%2Flabel%3E%20%3Cinput%20type%3D%22text%22%20name%3D%22typeBookmarlet%22%20class%3D%22form-control%20form-image%22%3E%20%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cdiv%20class%3D%22col-md-8%20col-sm-8%20text-center%22%3E%20%3Cdiv%20class%3D%22form-group%22%3E%20%3Clabel%20for%3D%22titleBookmarlet%22%3ET%C3%ADtulo%3C%2Flabel%3E%20%3Cinput%20type%3D%22text%22%20name%3D%22titleBookmarlet%22%20class%3D%22form-control%22%20placeholder%3D%22Search%22%3E%20%3C%2Fdiv%3E%3Cdiv%20class%3D%22form-group%22%3E%20%3Clabel%20for%3D%22descriptionBookmarlet%22%3EDescripci%C3%B3n%3C%2Flabel%3E%20%3Ctextarea%20rows%3D%223%22%20name%3D%22descriptionBookmarlet%22%20class%3D%22form-control%22%3E%3C%2Ftextarea%3E%20%3C%2Fdiv%3E%3Cdiv%20class%3D%22form-group%22%3E%20%3Clabel%20for%3D%22reviewBookmarlet%22%3ENota%3C%2Flabel%3E%20%3Ctextarea%20rows%3D%223%22%20name%3D%22reviewBookmarlet%22%20class%3D%22form-control%22%20placeholder%3D%22Escribe%20un%20comentario%20sobre%20este%20marcador%22%3E%3C%2Ftextarea%3E%20%3C%2Fdiv%3E%3Cdiv%20class%3D%22form-group%20%22%3E%20%3Clabel%20for%3D%22tagsBookmarlet%22%3EEtiquetas%3C%2Flabel%3E%20%3Cinput%20class%3D%22tags%20form-control%22%20name%3D%22tagsBookmarlet%22%20type%3D%22text%22%20submit%3D%22%22%20placeholder%3D%22%22%3E%20%3Cbr%3E%3Cdiv%20class%3D%22well%20misEtiquetas%22%20name%3D%22tagsAdded%22%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3Ca%20href%3D%22%23%22%20class%3D%22btn%20btnEnviar%20btn-lg%20text-center%22%20id%3D%22sendStatement%22%3E%20%3Cspan%20class%3D%22icon%20icon-bookmark%20text-center%22%20aria-hidden%3D%22true%22%3E%20Guardar%20en%20marcadores%3C%2Fspan%3E%20%3C%2Fa%3E%20%3C%2Fdiv%3E'%3Bcontainer%20%3D%20document.createElement(%22div%22)%3Bcontainer.style.background%20%3D%20%22%23000%22%3Bcontainer.style.width%20%3D%20%22100%25%22%3Bcontainer.style.minHeight%20%3D%20%22100%25%22%3Bcontainer.style.position%20%3D%20'fixed'%3Bcontainer.style.top%20%3D%20%220%22%3Bcontainer.style.zIndex%20%3D%20%221000%22%3Bcontainer.style.opacity%20%3D%20%220.85%22%3Bdocument.body.appendChild(container)%3BbookmarkletContainer%20%3D%20document.createElement(%22div%22)%3BbookmarkletContainer.innerHTML%20%3D%20html%3BbookmarkletContainer.style.background%20%3D%20%22%23FFF%22%3BbookmarkletContainer.style.position%20%3D%20%22fixed%22%3BbookmarkletContainer.style.top%20%3D%20%225%25%22%3BbookmarkletContainer.style.zIndex%20%3D%20%221100%22%3BbookmarkletContainer.style.marginLeft%20%3D%20%2210%25%22%3BbookmarkletContainer.style.width%20%3D%20%2280%25%22%3BbookmarkletContainer.style.height%20%3D%20%22550px%22%3Bdocument.body.appendChild(bookmarkletContainer)%3Bimg%20%3D%20document.querySelector(%22input%5Bname%3D'imageBookmarlet'%5D%22)%3BtypeB%20%3D%20document.querySelector(%22input%5Bname%3D'typeBookmarlet'%5D%22)%3Bs%20%3D%20document.createElement('link')%3Bs.setAttribute('href'%2C%20'https%3A%2F%2Fmaxcdn.bootstrapcdn.com%2Fbootstrap%2F3.3.6%2Fcss%2Fbootstrap.min.css')%3Bs.setAttribute('rel'%2C%20'stylesheet')%3Bs.setAttribute('type'%2C%20'text%2Fcss')%3Bdocument.body.appendChild(s)%3Ba%20%3D%20document.createElement('link')%3Ba.setAttribute('href'%2C%20'https%3A%2F%2Fkmelx.com%2Fstatic%2Fcss%2Ftools.css')%3Ba.setAttribute('rel'%2C%20'stylesheet')%3Ba.setAttribute('type'%2C%20'text%2Fcss')%3Bdocument.body.appendChild(a)%3Bb%20%3D%20document.createElement('link')%3Bb.setAttribute('href'%2C%20'https%3A%2F%2Fmaxcdn.bootstrapcdn.com%2Ffont-awesome%2F4.5.0%2Fcss%2Ffont-awesome.min.css')%3Bb.setAttribute('rel'%2C%20'stylesheet')%3Bb.setAttribute('type'%2C%20'text%2Fcss')%3Bdocument.body.appendChild(b)%3Bswal_css%20%3D%20document.createElement(%22link%22)%3Bswal_css.setAttribute('href'%2C%20'https%3A%2F%2Fkmelx.com%2Fstatic%2Fcss%2Fsweetalert.css')%3Bswal_css.setAttribute('rel'%2C%20'stylesheet')%3Bswal_css.setAttribute('type'%2C%20'text%2Fcss')%3Bdocument.body.appendChild(swal_css)%3Bswal_js%20%3D%20document.createElement(%22script%22)%3Bswal_js.setAttribute('src'%2C%20'https%3A%2F%2Fkmelx.com%2Fstatic%2Fjs%2Fsweetalert.min.js')%3Bdocument.body.appendChild(swal_js)%3BsecondBookmarketContainer%20%3D%20document.querySelector(%22%23containerBmlet%22)%3BsecondBookmarketContainer.style.height%20%3D%20%22500px%22%3BsecondBookmarketContainer.style.overflow%20%3D%20%22auto%22%3BstarCounter%20%3D%200%3Betiquetas%20%3D%20%5B%5D%3BiconTag%20%3D%20%22%3Ci%20class%3D'glyphicon%20glyphicon-tag'%3E%3C%2Fi%3E%22%3B%24(%22.tags%22).on(%22change%22%2Cfunction()%7BmyEtiqueta%20%3D%20%24(this).val()%3Bvalue%20%3D%20etiquetas.indexOf(myEtiqueta)%3Bif(value%20%3C%200)%7B%24(%22.misEtiquetas%22).append(iconTag%20%2B%20%22%20%22%20%2B%20myEtiqueta%20%2B%20%22%20%2C%20%22)%3Betiquetas.push(myEtiqueta)%3B%7D%24(%22.tags%22).val(%22%22)%3B%7D)%3BcloseIMG%20%3D%20'%3Ci%20class%3D%22fa%20fa-times%22%3E%3C%2Fi%3E'%3BcloseButton%20%3D%20document.querySelector(%22a%22)%3BcloseButton.style.position%20%3D%20%22fixed%22%3BcloseButton.style.top%20%3D%20%223.5%25%22%3BcloseButton.style.right%20%3D%20%225%25%22%3BcloseButton.innerHTML%20%3D%20closeIMG%3BcloseButton.href%20%3D%20%22%22%3Bdocument.body.appendChild(closeButton)%3Bclose%20%3D%20document.querySelector(%22.fa-times%22)%3Bclose.style.color%20%3D%20%22%23FFF%22%3BcloseButton.style.zIndex%20%3D%20%221200%22%3BcloseButton.onclick%20%3D%20function()%7BcloseButton.remove()%3Ba.remove()%3Bb.remove()%3Bs.remove()%3BsecondBookmarketContainer.remove()%3BbookmarkletContainer.remove()%3Bcontainer.remove()%3Breturn%20false%3B%7D%3BtypeBookmarlet%20%3D%20document.querySelector(%22input%5Bname%3D'typeBookmarlet'%5D%22)%3Btry%7BtypeBookmarlet.value%20%3D%20type.content%3B%7Dcatch(err)%7Bconsole.log(err)%3B%7D%3BtitleBookmarlet%20%3D%20document.querySelector(%22input%5Bname%3D'titleBookmarlet'%5D%22)%3Btry%7BtitleBookmarlet.value%20%3D%20title.content%3B%7Dcatch(err)%7Bconsole.log(err)%3B%7D%3BdescriptionBookmarlet%20%3D%20document.querySelector(%22textarea%5Bname%3D'descriptionBookmarlet'%5D%22)%3Btry%7BdescriptionBookmarlet.value%20%3D%20description.content%3B%7Dcatch(err)%7Bconsole.log(err)%3B%7Dfunction%20addTag(value)%7BmyEtiqueta%20%3D%20value%3Bvalue%20%3D%20etiquetas.indexOf(myEtiqueta)%3Bif(value%20%3C%200)%7B%24(%22.misEtiquetas%22).append(iconTag%20%2B%20%22%20%22%20%2B%20myEtiqueta%20%2B%20%22%20%2C%20%22)%3Betiquetas.push(myEtiqueta)%3B%7D%24(%22.tags%22).val(%22%22)%3B%7Dif(keywords)%7Bfor(var%20i%3D0%3Bi%3Ckeywords.content.split('%2C').length%3Bi%2B%2B)%7BaddTag(keywords.content.split('%2C')%5Bi%5D)%3B%7D%3B%7D%3Bif(news_keywords)%7Bfor(var%20i%3D0%3Bi%3Cnews_keywords.content.split('%2C').length%3Bi%2B%2B)%7BaddTag(news_keywords.content.split('%2C')%5Bi%5D)%3B%7D%3B%7D%3Bif(image)%7Bimg.src%20%3D%20image.content%3B%7Dscore%20%3D%200%3Bstars%20%3D%20%24(%22.star%22)%3Bstars.click(function()%7Bscore%20%3D%20%24(this).data(%22value%22)%3B%7D)%3BbuttonSend%20%3D%20document.querySelector(%22%23sendStatement%22)%3BbuttonSend.onclick%20%3D%20function()%7Bstatement%5B%22object%22%5D%5B%22id%22%5D%20%3D%20url%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22type%22%5D%20%3D%20typeBookmarlet.value%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22name%22%5D%5B%22en-US%22%5D%20%3D%20titleBookmarlet.value%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22name%22%5D%5B%22es-ES%22%5D%20%3D%20titleBookmarlet.value%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22description%22%5D%5B%22en-US%22%5D%20%3D%20descriptionBookmarlet.value%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22description%22%5D%5B%22es-ES%22%5D%20%3D%20descriptionBookmarlet.value%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22image%22%5D%20%3D%20img.src%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22site_name%22%5D%20%3D%20site_name%20%3F%20site_name.content%20%3A%20null%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22author%22%5D%20%3D%20author%20%3F%20author.content%20%3A%20null%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22tags%22%5D%20%3D%20keywords%20%3F%20keywords.content%20%3A%20null%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22news_tags%22%5D%20%3D%20news_keywords%20%3F%20news_keywords.content%20%3A%20null%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22twitter%22%5D%20%3D%20twitter%20%3F%20twitter.content%20%3A%20null%3Bstatement%5B%22object%22%5D%5B%22definition%22%5D%5B%22extensions%22%5D%5B%22score%22%5D%20%3D%20score%3BbuttonSend.innerHTML%20%3D%20%22Espere%20unos%20momentos...%22%3Bjson%20%3D%20JSON.stringify(statement)%3B%24.ajax(%7Burl%20%3A%20`+`"`+$rootScope.endpoint+`"`+`%2B%22%2Fapi%2Fshare%2FinsertStatement%2F%22%2CdataType%20%3A%20'jsonp'%2Cdata%20%3A%20%7B'statement'%20%3A%20json%2C'user'%20%3A%20`+`"`+JSON.parse(sessionStorage.dataUser).username+`"`+`%7D%2Csuccess%20%3Afunction(data)%7Bif(data.status%20%3D%3D%20'ok')%7Bswal(%7B%22title%22%20%3A%20%22Proceso%20exitoso%22%2C%22text%22%20%3A%20%22El%20marcador%20se%20ha%20guardado%20exitosamente.%22%2C%22type%22%20%3A%20%22success%22%2C%22confirmButton%22%20%3A%20%22Cerrar%22%7D%2Cfunction()%7BcloseButton.remove()%3Ba.remove()%3Bb.remove()%3Bs.remove()%3BsecondBookmarketContainer.remove()%3BbookmarkletContainer.remove()%3Bcontainer.remove()%3Breturn%20false%3B%7D)%3B%7Delse%7Bswal(%7B%22title%22%20%3A%20%22Proceso%20fallido%22%2C%22text%22%20%3A%20%22El%20marcador%20no%20se%20ha%20podido%20guardar%2C%20comunicate%20con%20el%20area%20de%20soporte.%22%2C%22type%22%20%3A%20%22error%22%2C%22confirmButton%22%20%3A%20%22Cerrar%22%7D%2Cfunction()%7BcloseButton.remove()%3Ba.remove()%3Bb.remove()%3Bs.remove()%3BsecondBookmarketContainer.remove()%3BbookmarkletContainer.remove()%3Bcontainer.remove()%3Breturn%20false%3B%7D)%3B%7D%7D%7D)%7D%7D)(jQuery.noConflict(true))%7Dvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Fajax.googleapis.com%2Fajax%2Flibs%2Fjquery%2F1.7.1%2Fjquery.min.js%22%3Bif(s.addEventListener)%7Bs.addEventListener(%22load%22%2Ccallback%2Cfalse)%7Delse%20if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3B%7D)()`;
            
            }else{
                element[0] = "#";
            }
        }
    };

}]);
app.directive("navbar", [function(){
    return {
        restrict : "EA",
    templateUrl : "views/navbar.html",
    link : function(){
        console.log("navbar"); 
    }, 
    scope : {

    }
    }

}]);

app.directive("coursesList", ["courses","$http", "$rootScope","$routeParams", function(courses, $http, $rootScope, $routeParams){
    return {
        restrict : "EA",
        templateUrl : 'views/courses_list.html',
        link : function(scope){
            switch(scope.filter){
                case "public":
                    courses.public(scope.limit).success(function(response){
                        scope.listCourses = response;
                    });
                    break;
                case "completed":
                    courses.completed().success(function(response){
                        scope.listCourses = response;
                        $rootScope.completed_courses = scope.listCourses;
                    });
                    break;
                case "available":
                    courses.available().success(function(response){
                        scope.listCourses =response;
                    });
                    break;
                case "me":
                    courses.myCourses().success(function(response){
                        scope.dataCourses = response;
                    });
                    break;
                case "all_public":
                    courses.public().success(function(response){
                        scope.listCourses = split_array_for_slides(response, 4);
                    });
                    break;
                case "related":
                    scope.slug = $routeParams.slug;                    
                    courses.related(scope.slug).success(function(response){
                        scope.listCourses = split_array_for_slides(response, 4);
                    })
                    break;
                case "absolute":
                    courses.absolute().success(function(response){
                        scope.listCourses = split_array_for_slides(response, 4);
                        if(response.length == 0){
                            courses.public().success(function(response){
                                scope.listCourses = split_array_for_slides(response, 4);
                            });

                        }
                    }).error(function(){
                        courses.public().success(function(response){
                            scope.listcourses = response;
                        });
                    });
                    break;
                default:
                    console.log("[DEBUG] - error with filter :"+scope.filter);
                    break;
            }
        },
        scope : {
            filter : "@",
            limit : "=",
            slug : "@",
        }
    } 
}]);

app.directive("coursesCatalog", ["$rootScope", "courses",  function($rootScope, courses){
    return {
        restrict :  "EA",
    templateUrl : 'views/courses/blockCourses.html',
    link : function(scope){
        switch(scope.type){
            case "me":
                courses.myCourses().success(function(response){
                    scope.dataMyCourses = response;
                    $rootScope.dataMyCourses = response;
                    console.log(response);
                }).error(function(a,b,c,d){
                    console.log("[DEBUG] - error: "+b+" track:"+d );
                })
                break;
            default:
                break;

        }
    },
    scope : {
        type : "@"
    },

    }  

}]);

app.directive("userInfo", ["$rootScope", function($rootScope){
    return {
        restrict : "EA",
        template : "<span id='user_info'><span>",
        link : function(scope){
            str = $rootScope.dataUser.name + " " + $rootScope.dataUser.lastname;
            info = document.querySelector("#user_info");
            info.innerHTML = str;
        },
        scope:{
        
        }
        
        
    }
}]);
app.directive("certifications",["courses",function(courses){
    return {
        restrict : "EA",
        templateUrl : "views/certificates/catalogCertificate.html",
        link : function(scope){

            courses.certifications("?"+scope.type+"=true").success(function(response){
              scope.items = response;
              scope.in_progress = (scope.type == "in_progress");
              console.log([scope.type, scope.in_progress]);
              scope.remove == undefined ? scope.showPanel = true: scope.showPanel = false;

            });
        },
        scope :{
            type : "@" ,
            remove : "@"
        }
    } 

}]);

app.directive("getTutors", function(tutors){
    return{
        restrict : "EA",
        templateUrl : "views/tutors_list.html",
        link : function(scope){
            tutors.onCourse(scope.slug).success(function(response){
                scope.tutors = response.tutors;
                
            })
        },
        scope :{
            slug : "@"
        }
    }
})
