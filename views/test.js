    statement = {
        "actor": {
            "name": username,
            "mbox": "mailto:"+email
        },
        "verb": {
            "id": "http://adlnet.gov/expapi/verbs/experienced",
            "display": { "en-US": "experienced" }
        },
        "object": {
            "id": "http://example.com/activities/hang-gliding-test",
            "definition": {
                "type": "http://adlnet.gov/expapi/activities/assessment",
                "name": { "en-US": "Hang Gliding Test" },
                "description": {
                    "en-US": "The Solo Hang Gliding test, consisting of a timed flight from the peak of Mount Magazine"
                },
                "extensions": {

                }
            },
        },
        "result": {
            "completion": true,
            "success": true,
            "extensions": {
                
            }
        },
        "context": {
            "extensions": {
                
            }
        }
        
    };
    image = document.querySelector("meta[property='og:image']");

    title = document.querySelector("meta[property='og:title']");

    description = document.querySelector("meta[property='og:description']");

    type = document.querySelector("meta[property='og:type']");
    console.log(type);
    site_name = document.querySelector("meta[property='og:site_name']");
    url = location.href;
    keywords = document.querySelector("meta[name='keywords']");
    author = document.querySelector("meta[name='author']");
    twitter = document.querySelector("meta[name='twitter:site']");
    news_keywords = document.querySelector("meta[name='news_kewywords']");
    html = '<div class="col-md-12" id="containerBmlet"> <h3 class="text-center">Agregar a Favoritos</h3> <div class="col-md-4 col-sm-4"> <div class="form-group text-center"> <label for="imageBookmarlet">Imagen</label> <input type="image" name="imageBookmarlet" class="form-control form-image" placeholder="Search" src="http://kmelx.com/static/images/no-thumbnail.jpg"> </div><div class="form-group text-center"> <div class="stars"> <label for="scoreBookmarlet">Puntaje</label> <form action="" id="scoreBookmarlet"> <input class="star star-5" data-value="5" id="star-5" type="radio" name="star"> <label class="star star-5" for="star-5"></label> <input class="star star-4" id="star-4" data-value="4" type="radio" name="star"> <label class="star star-4" for="star-4"></label> <input class="star star-3" id="star-3" type="radio" data-value="3" name="star"> <label class="star star-3" for="star-3"></label> <input class="star star-2" id="star-2" type="radio" data-value="2" name="star"> <label class="star star-2" for="star-2"></label> <input class="star star-1" id="star-1" type="radio" data-value="1" name="star"> <label class="star star-1" for="star-1"></label> </form> </div></div><div class="form-group text-center"> <label for="typeBookmarlet">Tipo</label> <input type="text" name="typeBookmarlet" class="form-control form-image"> </div></div><div class="col-md-8 col-sm-8 text-center"> <div class="form-group"> <label for="titleBookmarlet">Título</label> <input type="text" name="titleBookmarlet" class="form-control" placeholder="Search"> </div><div class="form-group"> <label for="descriptionBookmarlet">Descripción</label> <textarea rows="3" name="descriptionBookmarlet" class="form-control"></textarea> </div><div class="form-group"> <label for="reviewBookmarlet">Nota</label> <textarea rows="3" name="reviewBookmarlet" class="form-control" placeholder="Escribe un comentario sobre este marcador"></textarea> </div><div class="form-group "> <label for="tagsBookmarlet">Etiquetas</label> <input class="tags form-control" name="tagsBookmarlet" type="text" submit="" placeholder=""> <br><div class="well misEtiquetas" name="tagsAdded"></div></div></div><a href="#" class="btn btnEnviar btn-lg text-center" id="sendStatement"> <span class="icon icon-bookmark text-center" aria-hidden="true"> Guardar en marcadores</span> </a> </div>';
    container = document.createElement("div");
    container.style.background = "#000";
    container.style.width = "100%";
    container.style.minHeight = "100%";
    container.style.position = 'fixed';
    container.style.top = "0";
    container.style.zIndex = "1000";
    container.style.opacity = "0.85";
    document.body.appendChild(container);
    bookmarkletContainer = document.createElement("div");
    bookmarkletContainer.innerHTML = html;
    bookmarkletContainer.style.background = "#FFF";
    bookmarkletContainer.style.position = "fixed";
    bookmarkletContainer.style.top = "5%";
    bookmarkletContainer.style.zIndex = "1100";
    bookmarkletContainer.style.marginLeft = "10%";
    bookmarkletContainer.style.width = "80%";
    bookmarkletContainer.style.height = "550px";

    document.body.appendChild(bookmarkletContainer);
    
    img = document.querySelector("input[name='imageBookmarlet']");
    typeB = document.querySelector("input[name='typeBookmarlet']");

    s = document.createElement('link');
    s.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('type', 'text/css');
    document.body.appendChild(s); 


    a = document.createElement('link');
    a.setAttribute('href', 'https://kmelx.com/static/css/tools.css');
    a.setAttribute('rel', 'stylesheet');
    a.setAttribute('type', 'text/css');
    document.body.appendChild(a); 
    b = document.createElement('link');
    b.setAttribute('href', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
    b.setAttribute('rel', 'stylesheet');
    b.setAttribute('type', 'text/css');
    document.body.appendChild(b); 

    swal_css = document.createElement("link");
    swal_css.setAttribute('href', 'https://kmelx.com/static/css/sweetalert.css');
    swal_css.setAttribute('rel', 'stylesheet');
    swal_css.setAttribute('type', 'text/css');
    document.body.appendChild(swal_css); 

    swal_js = document.createElement("script");
    swal_js.setAttribute('src', 'https://kmelx.com/static/js/sweetalert.min.js');
    document.body.appendChild(swal_js);

    secondBookmarketContainer = document.querySelector("#containerBmlet");
    secondBookmarketContainer.style.height = "500px";
    secondBookmarketContainer.style.overflow = "auto";

    starCounter = 0;
    etiquetas = []; 
    iconTag = "<i class='glyphicon glyphicon-tag'></i>";



    $(".tags").on("change",function(){

       myEtiqueta = $(this).val();

       value = etiquetas.indexOf(myEtiqueta);

       if(value < 0){

            $(".misEtiquetas").append(iconTag + " " + myEtiqueta + " , ");

            etiquetas.push(myEtiqueta);

        }

        $(".tags").val("");    

    });

    closeIMG = '<i class="fa fa-times"></i>';
    closeButton = document.querySelector("a");
    closeButton.style.position = "fixed";
    closeButton.style.top = "3.5%";
    closeButton.style.right = "5%";
    closeButton.innerHTML = closeIMG;
    closeButton.href = "";

    document.body.appendChild(closeButton); 
    close = document.querySelector(".fa-times");
    close.style.color = "#FFF";
    closeButton.style.zIndex = "1200";

    closeButton.onclick = function(){
        closeButton.remove();
        a.remove();
        b.remove();
        s.remove();
        secondBookmarketContainer.remove();
        bookmarkletContainer.remove();
        container.remove();
        return false;
    };

    typeBookmarlet = document.querySelector("input[name='typeBookmarlet']");
    try{
        typeBookmarlet.value = type.content;
    }catch(err){
        console.log(err);
    };
    
    titleBookmarlet = document.querySelector("input[name='titleBookmarlet']");
    try{
        titleBookmarlet.value = title.content;
    
    }catch(err){
        console.log(err);
    };
    descriptionBookmarlet = document.querySelector("textarea[name='descriptionBookmarlet']");
    try{
        descriptionBookmarlet.value = description.content;
    }catch(err){
        console.log(err);
    }
    function addTag(value){
        myEtiqueta = value;

       value = etiquetas.indexOf(myEtiqueta);

       if(value < 0){

            $(".misEtiquetas").append(iconTag + " " + myEtiqueta + " , ");

            etiquetas.push(myEtiqueta);

        }

        $(".tags").val("");    
    }
    if(keywords){

        for(var i=0;i<keywords.content.split(',').length;i++){
            addTag(keywords.content.split(',')[i]);
        };
    };
    if(news_keywords){

        for(var i=0;i<news_keywords.content.split(',').length;i++){
            addTag(news_keywords.content.split(',')[i]);
        };
    };

    if(image){
        img.src = image.content;
    }
    score = 0;
    stars = $(".star");
    stars.click(function(){
        score = $(this).data("value");
    });

    buttonSend = document.querySelector("#sendStatement");
    buttonSend.onclick = function(){

        statement["object"]["id"] = url;
        statement["object"]["definition"]["type"] = typeBookmarlet.value;
        statement["object"]["definition"]["name"]["en-US"] = titleBookmarlet.value;
        statement["object"]["definition"]["name"]["es-ES"] = titleBookmarlet.value;
        statement["object"]["definition"]["description"]["en-US"] = descriptionBookmarlet.value;
        statement["object"]["definition"]["description"]["es-ES"] = descriptionBookmarlet.value;
        statement["object"]["definition"]["extensions"]["image"] = img.src;
        statement["object"]["definition"]["extensions"]["site_name"] = site_name ? site_name.content : null;
        statement["object"]["definition"]["extensions"]["author"] = author ? author.content : null;
        statement["object"]["definition"]["extensions"]["tags"] = keywords ? keywords.content : null;

        statement["object"]["definition"]["extensions"]["news_tags"] = news_keywords ? news_keywords.content : null;
        statement["object"]["definition"]["extensions"]["twitter"] = twitter ? twitter.content : null;
        statement["object"]["definition"]["extensions"]["score"] = score;
        buttonSend.innerHTML = "Espere unos momentos...";
        json = JSON.stringify(statement);
        $.ajax({
            url : endpoint+"/api/share/insertStatement/",
            dataType : 'jsonp',
            data : {
                'statement' : json,
                'user' : username
            }, 
            success :function(data){
                if(data.status == 'ok'){    

                    swal({
                        "title" : "Proceso exitoso",
                        "text" : "El marcador se ha guardado exitosamente.",
                        "type" : "success",
                        "confirmButton" : "Cerrar"

                    }, 
                    function(){
                        closeButton.remove();
                        a.remove();
                        b.remove();
                        s.remove();
                        secondBookmarketContainer.remove();
                        bookmarkletContainer.remove();
                        container.remove();
                        return false;
                    });

                }else{
                    swal({
                        "title" : "Proceso fallido",
                        "text" : "El marcador no se ha podido guardar, comunicate con el area de soporte.",
                        "type" : "error",
                        "confirmButton" : "Cerrar"

                    }, 
                    function(){
                        closeButton.remove();
                        a.remove();
                        b.remove();
                        s.remove();
                        secondBookmarketContainer.remove();
                        bookmarkletContainer.remove();
                        container.remove();
                        return false;
                    });
                }
            }
        })
    };