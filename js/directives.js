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

app.directive('tabsCustomHorizontal', ['$sce',function ($sce) {
	return {
		restrict: 'EA',
		template:   '<tabset justified="true" type="pills">' +
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
                                                '<a target="_blank" value="{{itemResource.file}}" >Descargar</a>'+
                                            
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
                                    '<a class="btn btn-verde btn-lg margin--t1 typeform-share" ng-disabled="btnDisableTest" href="" ng-click="modalOpen()">' +
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
                    for(link in links){
                        try{
                            links[link].href = config.SERVICE_SERVER + '/' +links[link].getAttribute("value");    
                        }catch(err){
                                
                        }
                    }


                }

            },500);


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
                $(this).parent().parent().addClass("parentItemCheck");
                var listItem = $(".parentItemCheck").find("li a");

                var nItems = [];

                listItem.each(function(){
                    var linkItem = $(this).filter(".itemCheck");
                    nItems.push(linkItem.length);
                });

                for(i=0; i < nItems.length; i++){
                    if(nItems[i] == 0){
                        console.log('incompleto');
                    }else{
                        console.log('Completo');
                    }
                }

                console.log(nItems);
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
                                        <img src="{{value.avatar}}" alt="" class="img-circle sidebar-imageCurso__image img-responsive" pagespeed_url_hash="155287408" onload="pagespeed.CriticalImages.checkImageForCriticality(this);">
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


            /**
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
            */
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

