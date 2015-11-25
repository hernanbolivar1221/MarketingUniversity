$(window).load(function () {
    $('#status').fadeOut();
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow':'visible'});
})

$(document).ready(function () {
	"use strict"

	//Not supported by IE9>. 
	
    if (!Array.prototype.indexOf){
	  Array.prototype.indexOf = function(elt /*, from*/){
	    var len = this.length >>> 0;

	    var from = Number(arguments[1]) || 0;
	    from = (from < 0)
	         ? Math.ceil(from)
	         : Math.floor(from);
	    if (from < 0)
	      from += len;

	    for (; from < len; from++){
	      if (from in this &&
	          this[from] === elt)
	        return from;
	    }
	    return -1;
	  };
	}
    
    var bgImg = [], img = [], count=0, percentage = 0;

    //Busca y revisa todas las imagenes del site y las agrega a un array

    $('*').filter(function() {
	    var val = $(this).css('background-image').replace(/url\(/g,'').replace(/\)/,'').replace(/"/g,'');
	    var imgVal = $(this).not('script').attr('src');

	    if(val !== 'none' && !/linear-gradient/g.test(val) && bgImg.indexOf(val) === -1){
	    	bgImg.push(val)
	    }

	    if(imgVal !== undefined && img.indexOf(imgVal) === -1){
	    	img.push(imgVal)
	    }
 	});

    var imgArray = bgImg.concat(img); 

    $.each(imgArray, function(i,val){ //Adding load and error event
		$("<img />").attr("src", val).bind("load", function () {
            completeImageLoading();
        });

        $("<img />").attr("src", val).bind("error", function () {
            imgError(this);
        });
    })

    function completeImageLoading(){
    	count++;
    	percentage = Math.floor(count / imgArray.length * 100);
    	$('#status').html('<span>'+percentage + '%'+'</span>');
    	if(percentage === 100){
    		$('#status').html('<span>100%</span>')
    	}
    }

    //Error Al cargar, se ejecuta cada que una imagen no carga completamente
    function imgError (arg) {
        // console.log(arg);
    }
});