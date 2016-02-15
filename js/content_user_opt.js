var userSlideContainer;
var csrf_token ;
var examData;
var examSlide;
var updateExamThread;
var countQuestionTimerThread;
var countDownDiv;
var secondsTickerCallbacks = {};
var EXAM_REFRESH_FAILURES = 0;
var actual_position=0;
var navBar;
var choices = {};
var t=null;
var already_graded= false;
var tempText="";
var hideMessage = false;
function template_url(content_template_id) {
	return "content_image/" + content_template_id + "/?course_id="+courseId+"&module_id="+moduleId+"&content_id="+contentId+"&exam_id="+examData.pk;
}
var open_questions_dict={}
var student_choices =[];

function refresh_slide(position) {
	//$.jqlog.info("refresh position: " + position);
	actual_position = check_pos($(".currentSlideNr").first().text());
	if (position == undefined) {
		if (examSlide)
			position = examSlide.fields.position;
		else
			position = examData.extras.last_viewed_position || 0;
	}
    	
	if (examSlide && examSlide.fields.position == position)
		// Nothing to do, we're already there.
		return;

	//$.jqlog.info("requesting position: " + position);

	navBar.hide();
	tempText="";
	init_userSlideContainer(position, function(slideData){
		setup_oneclick_buttons();
		navBar.slideDown("fast");
		$("#correct_answer").addClass("hidden");
		$("#incorrect_answer").addClass("hidden");
		student_choices =[];
		/*setTimeout(function(){
			
		}, 1000);*/
		
	});
}

function finish_exam(){

	clearTimeout (updateExamThread);
	var dict_choices = JSON.stringify(choices);
	ajax_finish_exam({
		data: {
			course_id: courseId,
			module_id: moduleId,
			content_id: contentId,
			exam_id: examData.pk,
			choices: dict_choices,
			actual_position: actual_position,
			"csrfmiddlewaretoken": csrf_token
		},
		success: function(response){

			if (!isStudent) {
				//$.jqlog.info("This was just a preview, no need to show the popup");
				window.location = homeURL + "lms/course/" + courseUUID + "/";
				return false;
			}

			// Manually set end_date as we're not fetching the exam anymore.
			examData.fields.end_date = new Date();
			if(typeof(bonus) == "undefined"){
				bonus="False";
			} 
			if(bonus == "False" ){
            	var finishPopup = bombModal(null, {
					ajax: 'popup_exam_finished/?course_id=' + courseId + "&module_id=" + moduleId + "&content_id=" + contentId + "&exam_id=" + examData.pk,
					use_class: "bombModal_prompt",
					modal: true,
	                _buttonLabel: "Aceptar",
					answers : {
						"Aceptar": function(event){
							if ( finishPopup.find("#id_accept_score").is(":checked") || finishPopup.find("#id_accept_score").attr("value") == "True") {
								ajax_accept_exam_score({
									data: {
										course_id: courseId,
										module_id: moduleId,
										content_id: contentId,
										exam_id: examData.pk,
										"csrfmiddlewaretoken": csrf_token
									},
									async: false
								});
							}
							if( typeof(type_view) != "undefined" && type_view !== "None")
							{
								window.location = homeURL + "lms/course/" + courseUUID + "/" + type_view + "/";
							}
							else{
								window.location = homeURL + "lms/course/" + courseUUID + "/simple/";
							}
							
						}
					}
				});
            }

            				
		}
	});
	try{
    		if(DARE_EVALUATION){
        		self.close();
    		}
	}catch(err){
		//console.log("[DEBUG] - Is not dare instance");
	}
    try{
        if(bonus=="True"){
        	ajax_get_feedback({
        		data: {
					course_id: courseId,
					module_id: moduleId,
					content_id: contentId,
					exam_id: examData.pk,
					position: examSlide.fields.position,
					"csrfmiddlewaretoken": csrf_token
				},
				async: false,
				success: function(feedbacks){
					for (i=0; i<examSlide.extras.user_answers_set.length; i++){
						if (examSlide.extras.user_answers_set[i].selected && feedbacks[i].correct) {
							$("#correct_answer").removeClass("hidden");
						}else{
							if (examSlide.extras.user_answers_set[i].selected)
								$("#incorrect_answer").removeClass("hidden");
						}
					}
				}
			});
			setTimeout("self.close()",2500);
        }else{
        	if (granreto == "True")
        		self.close();
        }
    }catch(err){
        //console.log("[DEBUG] - There is not bonus")
    }
}

$.fn.hasAttr = function(name) {  
   return this.attr(name) !== undefined;
};

function pauseJS(timeInMilliS) {
   var date = new Date();
   var curDate = null;
  do { curDate = new Date(); }
   while(curDate-date < timeInMilliS);
}


function has_selected_answer(type){

	if (type!="PA"){
		student_choices=[];
		$('.optionList .icon-check').each(function() {
			student_choices.push($(this).attr('choice_id'));
		});
		if (student_choices.length>0)
		return true
	}
	else{
			var textBox = tempText;
			if ($.trim(textBox).length==0)
			return false;
			splittedText = textBox.split (" ");
			if (splittedText.length <= 200){
				return true;
			
			}
	}
	return false
}

function showGradeQuestion(correct_answers){
	 var selected = new Array();
	 student_choices=[];
	 userSlideContainer.find("ul.optionList > li input").attr("disabled", "disabled");
	 
	if  (userSlideContainer.find("ul.optionList > li input").hasAttr("disabled"))
	{
		
		$('.optionList input:checked').each(function() {
		 student_choices.push($(this).attr('choice_id'));
		});
		if (student_choices.length>0)
		{
			var correct=0;
			if (correct_answers.length == student_choices.length)
			{
				for (i=0;i<correct_answers.length; i++)
				{
					for (j=0;j<student_choices.length; j++)
					{
					
						if (correct_answers[i] == student_choices[j])
						{
							correct++;
						}
					}
				}
				
				if (correct == correct_answers.length)
				{

					 if(!hideMessage){
					 	$("#correct_answer").removeClass("hidden"); 
					 }
				}
				else{
					if(!hideMessage){
					$("#incorrect_answer").removeClass("hidden"); 
					}
				}
			}
			else{
				if(!hideMessage){
					$("#incorrect_answer").removeClass("hidden"); 
				}
			}
		}
		 
		
	
	}
	}
function allOpenQuestionsAnswered(){
	result = true;
	$.each( open_questions_dict, function( key, value ) {
		if (value == false){
			result=false;
		}
	});
	return result;
}

function setup_oneclick_buttons(){
	actual_position= examSlide.fields.position;
	$("#slide-container").find(".prevUnansweredButton").unbind("click").one("click", function(event){
	    if (!validateLength())
	    {
			   alert("La respuesta debe ser máximo de 200 palabras");
			   setup_oneclick_buttons();
		}
		else
		{
		if(isReview == "False" && examSlide.fields.question && examSlide.fields.question.fields.type == "PA")
		{
		    	if (has_selected_answer(examSlide.fields.question.fields.type))
		    	{
	        		open_questions_dict[examSlide.pk]=true;
	        	}
	        	else 
	        	{	
	        		open_questions_dict[examSlide.pk]=false;
	            }
	    }
		if (examSlide.extras.json_data !=undefined && !already_graded)
		{
           if(isReview=="False"&& has_selected_answer(examSlide.fields.question.fields.type))
		   {
		      showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
		      setTimeout("refresh_slide(examSlide.extras.previous_seen_unanswered_question)", 2000);
		    }
		    else{
		       if (examSlide.fields.question.fields.obligatory){
			       alert("Debe responder la pregunta para continuar");
			        setup_oneclick_buttons();
			    }
			   else
			   {
					showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
					setTimeout("refresh_slide(examSlide.extras.previous_seen_unanswered_question)", 2000);
			}
		    }

		}
		   else refresh_slide(examSlide.extras.previous_seen_unanswered_question)
		}
	});

	$("#slide-container").find(".prevButton").unbind("click").one("click", function(event){
	    if (!validateLength())
	    {
			   alert("La respuesta debe ser máximo de 200 palabras");
			   setup_oneclick_buttons();
		}
		else
		{
			if(isReview == "False" && examSlide.fields.question && examSlide.fields.question.fields.type == "PA")
		    {
		    	if (has_selected_answer(examSlide.fields.question.fields.type))
		    	{
	        		open_questions_dict[examSlide.pk]=true;
	        	}
	        	else 
	        	{	
	        		open_questions_dict[examSlide.pk]=false;
	            }
	        }
			if (examSlide.extras.json_data !=undefined && !already_graded)
			{
				if(isReview=="False"&& has_selected_answer(examSlide.fields.question.fields.type))
				{
				showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
				setTimeout("refresh_slide(examSlide.fields.position-1)", 2000);
				}
				else{
		       if (examSlide.fields.question.fields.obligatory){
			       alert("Debe responder la pregunta para continuar");
			        setup_oneclick_buttons();
			    }
			   else
			   {
					showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
					setTimeout("refresh_slide(examSlide.fields.position-1)", 2000);
			}
		    }
				
			}
			else refresh_slide(examSlide.fields.position-1);
		}
	});

	$("#slide-container").find(".nextButton").unbind("click").one("click", function(event){
		// Hide feedback button if is shown
		$(".showFeedbackButton").addClass("hidden");
		$(".showFeedbackQuestionButton").addClass("hidden");
		$('#counter').removeClass('alert-danger');
		
	    answered_questions=true;
	    if (!validateLength())
	    {
			   alert("La respuesta debe ser máximo de 200 palabras");
			   setup_oneclick_buttons();
		}
		else
		{
		    if(isReview == "False" && examSlide.fields.question && examSlide.fields.question.fields.type == "PA")
		    {
		    if (has_selected_answer(examSlide.fields.question.fields.type))
		    {
	        	open_questions_dict[examSlide.pk]=true;
	        }
	        else
	        { 
	        	open_questions_dict[examSlide.pk]=false;
	        }
	        }
			if (examSlide.extras.json_data !=undefined && !already_graded)
			{
			    
				if(isReview=="False"&& has_selected_answer(examSlide.fields.question.fields.type))
				{
					showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
					setTimeout("refresh_slide(examSlide.fields.position+1)", 2000);
				}
				else
				{
				    if (examSlide.fields.question.fields.obligatory){
			    	     alert("Debe responder la pregunta para continuar");
			    	     setup_oneclick_buttons();
			    	   }
			    	else
			    	{
					showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
					setTimeout("refresh_slide(examSlide.fields.position+1)", 2000);
				    }
			    	}
			    	
			}
			else{
				if (examSlide.fields.question && !examSlide.fields.question.fields.obligatory){
					    refresh_slide(examSlide.fields.position+1);
				}
				else{
					if (!examSlide.fields.question || (examSlide.fields.question && has_selected_answer(examSlide.fields.question.fields.type))){
						refresh_slide(examSlide.fields.position+1);
					}
					else
						{
							if(examSlide.fields.question.fields.type == "PA"){
								alert("La respuesta debe ser máximo de 200 palabras");
							}
							else{
								alert("Debe responder la pregunta para continuar");
							}
							setup_oneclick_buttons();
						}
				}
			}
		}
	});

	$("#slide-container").find(".showFeedbackButton").unbind("click").one("click", function(event){
		if (confirm("Al ver el feedback no podras cambiar las respuestas dadas, estas seguro de que deseas verlo?"))
		{
			userSlideContainer.find("ul.optionList > li.option input").attr("disabled", "disabled");
			userSlideContainer.find("ul.optionList > li.option label").addClass("disabled");
			$(this).addClass("hidden");
			ajax_get_feedback({
			data: {
					course_id: courseId,
					module_id: moduleId,
					content_id: contentId,
					exam_id: examData.pk,
					position: examSlide.fields.position,
					"csrfmiddlewaretoken": csrf_token
				},
				success: function(feedbacks){
					display_feedback(feedbacks);
				}
			});
		
		}
	});

	$("#slide-container").find(".showFeedbackQuestionButton").unbind("click").one("click", function(event){
		if (confirm("Al ver el video de feedback no podras cambiar las respuestas dadas, estas seguro de que deseas verlo?"))
		{
			userSlideContainer.find("ul.optionList > li.option input").attr("disabled", "disabled");
			userSlideContainer.find("ul.optionList > li.option label").addClass("disabled");
			$(this).addClass("hidden");
			$('#showFeedbackQuestion').modal({
  			keyboard: false
			});
		
		}
	});

		$("#slide-container").find(".finishButton").unbind("click").one("click", function(event){
		if (!validateLength())
	    {
			   alert("La respuesta debe ser máximo de 200 palabras");
			   setup_oneclick_buttons();
		}
		else
		{
			if(isReview == "False" && examSlide.fields.question && examSlide.fields.question.fields.type == "PA")
		    {
		    	if (has_selected_answer(examSlide.fields.question.fields.type))
		    	{
	        		open_questions_dict[examSlide.pk]=true;
	        	}
	        	else
	        	{ 
	        		open_questions_dict[examSlide.pk]=false;
	            }
	        }
		if(!allOpenQuestionsAnswered() && isReview=="False"){
			alert("Hay preguntas abiertas sin responder aún, por favor respóndelas para poder finalizar la evaluación");
			setup_oneclick_buttons();
		}
		else
		{
			if (examSlide.extras.json_data !=undefined)
			{
			   if (!examSlide.fields.question.fields.obligatory)
			   {
			   	showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
			   	navBar.slideUp();
			   	setTimeout("finish_exam()", 2000);
			   }
			  else
			  {
				 if (has_selected_answer(examSlide.fields.question.fields.type))
				 {
					showGradeQuestion(jQuery.parseJSON(examSlide.extras.json_data));
			   		navBar.slideUp();
					setTimeout("finish_exam()", 2000);
			   	 }
				else
				{
					if(examSlide.fields.question.fields.type == "PA"){
						alert("La respuesta debe ser máximo de 200 palabras");
					}
					else{
						alert("Debe responder la pregunta para continuar");
					}
					setup_oneclick_buttons();
				}
			  }
	
			}
			else
			{
			 if (!examSlide.fields.question || (!examSlide.fields.question.fields.obligatory))
			 {
				navBar.slideUp();
				finish_exam();
			 }
			 
			 else
			 {
				 if (has_selected_answer(examSlide.fields.question.fields.type))
				 {
					navBar.slideUp();
					finish_exam();
			   	 }
				else
				{
				 	if(examSlide.fields.question.fields.type == "PA"){
						alert("La respuesta debe ser máximo de 200 palabras");
					}
					else{
						alert("Debe responder la pregunta para continuar");
					}
				 setup_oneclick_buttons();
				}
			  }
			}
		}

		}
	});
}

function validateLength(){
	splittedText = tempText.split(" ");
	if (splittedText.length <= 200)
	{
		return true;
	}
	else
	{
		return false;
	}
}

var launch = function() {
	csrf_token = $("input[name=csrfmiddlewaretoken]").val();

	$("body").unload(function(){
		// Unschedule update_exam() if browser location is about to change
		// because it may cause the browser to hang.
		if (updateExamThread)
			clearTimeout (updateExamThread);
	});
    
    if(hasOpenQuestion=="True" && isReview=="False"){
		bombModal($('#openQuestionMsg'), {
			overlay: 10,
			answers : {
				"Close": null
			}
		});
	}
	
	$("#go_back_session").click(function(){
	    url = $(this).attr("url");
	    var dict_choices = JSON.stringify(choices);
	    ajax_save_last_feedback({
			data: {
					course_id: courseId,
					module_id: moduleId,
					content_id: contentId,
					exam_id: examData.pk,
					position: examSlide.fields.position,
					choices : dict_choices
				},
				success: function(feedbacks){
					window.location.href = url;
				}
			});

		
	});

	secondsTickerThread = setInterval(function(){
		$.each(secondsTickerCallbacks, function(k,v){
			if (typeof(v) == "function")
				v();
		});
	}, 1000);

	userSlideContainer = $(".userSlideContainer");
	countDownDiv = $(".topBarCountDown");
	navBar = $(".slideNavigation");
	
	userSlideContainer.find(".questionImage").click(function(){
		
		window.open($(this).find("#imgId").attr("src"), "Image", "menubar=no")
	});
    
    userSlideContainer.find(".questionContextImage").click(function(){

        window.open($(this).find("#imgId").attr("src"), "Imagen", "menubar=no")
    });    
	
	
	/*userSlideContainer.find(".imageChoiceClass").click(function(){
		alert(1);
		window.open($(this).find("#choiceimgId").attr("src"), "Image2", "menubar=no")
	});*/
	$(".gradeResponse").addClass("hidden");
	//setup_oneclick_buttons();
	if (isReview=="True") {
		//update_exam();
		$(".returnToCourse").removeClass("hidden");
		//hide_or_show_buttons();
		$("#slide-container").find(".finishButton").removeAttr("style");
		$("#slide-container").find(".finishButton").addClass("hidden");
		//userSlideContainer.find(".showFeedbackButton").removeAttr("style");
		//userSlideContainer.find(".showFeedbackButton").hide();
		
		userSlideContainer.bind("slide_loaded", function(event, slideData) {
			var correct_choices = [];
		   // $.each(examSlide.extras.user_answers_set, function(k,v){
	            if (examSlide.fields.question.fields.type=="PA")
	            {
                    userSlideContainer.find(".tutorfeedback").empty()
	                userSlideContainer.find(".tutorgrade").empty();
	                tutorgrade = examSlide.fields.grade;
	                if (tutorgrade == null)tutorgrade="0";
	                tutorfeedback = examSlide.fields.feedback;
	                if (tutorfeedback==null)tutorfeedback="";
	                if (isTutorReview == "True")
	                {
	                	weight_question = examSlide.fields.question.fields.weight;
	                	var real_weigth = weight_question /max_grade;
	                	max_grade_data = real_weigth.toPrecision(3);
	                	$(".max_grade_question").text(max_grade_data);
	                	theTutorGrade = $("<input type=text id='tutor_grade' data='lol' value='"+ tutorgrade+"'/>");
	                	theTutorFeedback = $("<textarea id='tutor_feedback' type='textarea' value='"+tutorfeedback+"' rows='8' cols='50'>"+tutorfeedback+"</textarea>");
	                }
	                else
	                {
		                $(".teacherGuide").hide();
		                theTutorGrade = $("<input type=text id='tutor_grade' value='"+ tutorgrade+"' disabled='disabled'/>");
		                theTutorFeedback = $("<textarea id='tutor_feedback' type='textarea' disabled='disabled' value='"+tutorfeedback+"' rows='8' cols='50'>"+tutorfeedback+"</textarea>");

		            }
		            theTutorFeedback.change(handle_feedback_change);
		            theTutorGrade.change(handle_grade_change);
		            userSlideContainer.find(".tutorfeedback").append(theTutorFeedback);
		            userSlideContainer.find(".tutorgrade").append(theTutorGrade);
		            $(".gradeResponse").removeClass("hidden").show();
       
	            }
	             
            
			
			$.each(examSlide.extras.user_answers_set, function(k,v){
				newButton = $(".option[choice_id=" + v.id + "]");
				//newButton.find(".option").html(v.option);
				//newButton.find(".sequential_letter").text(labels[k]);

				if (v.feedback)
				{
					newButton.find(".feedback").html(v.feedback);
				}
				if (v.correct) {
					newButton.addClass("correct");
					newButton.find(".feedback").addClass("correct");
					
					if (v.feedback==null)
					{
						newButton.children(".feedback").html(gettext("This is the correct answer!"));
					}
				} else {
					newButton.addClass("incorrect");
					newButton.find(".feedback").addClass("incorrect");
					newButton.find(".feedback").remove();
				}
				
				if (v.correct)
					correct_choices.push(v);
			});
		
			if (correct_choices.length > 0) {
				$(".feedback").removeClass("hidden");
				//$("ul.optionList .option.correct").effect("highlight");
			}
            //userSlideContainer.find(".tutorfeedback").empty()
            //if(is_sabi && examSlide.fields.question.fields.type != "PA"){
            //    userSlideContainer.find(".tutorfeedback").empty()
            //    userSlideContainer.find(".tutorgrade").empty();
            //}
            //
            //
            //
            /*if (examSlide.fields.question.fields.type != "PA"){
            tutorgrade = examSlide.fields.grade;
            if (tutorgrade == null)tutorgrade="";
            tutorfeedback = examSlide.fields.feedback;
            if (tutorfeedback==null)tutorfeedback="";
            show_feed = false;
            if (tutorgrade != ""){
                theTutorGrade = $("<input type=text id='tutor_grade' value='"+ tutorgrade+"' disabled='disabled'/>");
                userSlideContainer.find(".tutorgrade").append(theTutorGrade);
                show_feed = true;
            }
            if (tutorfeedback!=""){
               theTutorFeedback = $("<textarea id='tutor_feedback' type='textarea' disabled='disabled' value='"+tutorfeedback+"' rows='8' cols='50'>"+tutorfeedback+"</textarea>");
               userSlideContainer.find(".tutorfeedback").append(theTutorFeedback);
               show_feed = true
            }
            if (show_feed)
                $(".gradeResponse").removeClass("hidden").show();
            }*/
        });
		update_exam();
		init_userSlideContainer(0);
	}
	

	userSlideContainer.bind("slide_loaded", function(event, slideData) {
		update_exam();
		hide_or_show_buttons();
	});

	userSlideContainer.bind("choice_click", function(event, slideData) {
		update_exam();
		hide_or_show_buttons();
	});
	if (isReview=="False"||isTutorReview=="True")update_exam();
	

};


function hide_or_show_buttons() {
    total = $(".totalSlidesNr").html();
    if(total == "1"){
        $(".numberDiapositives").hide();
    }
	if (examSlide.fields.position > 0)
		$("#slide-container").find(".prevButton").removeClass("hidden");
	else
		$("#slide-container").find(".prevButton").addClass("hidden");
	
	if (examSlide.fields.position < examData.extras.nr_slides-1)
	{
		navBar.show();
		$("#slide-container").find(".nextButton").removeClass("hidden");
		
	}
	else
		$("#slide-container").find(".nextButton").addClass("hidden");

	if (examSlide.extras.previous_seen_unanswered_question != null)
		$("#slide-container").find(".prevUnansweredButton").removeClass("hidden");
	else
		$("#slide-container").find(".prevUnansweredButton").addClass("hidden");
}

function update_exam(custom_opts) {


	ajax_options = {
		error: function() {
			EXAM_REFRESH_FAILURES = EXAM_REFRESH_FAILURES + 1;
		},
		success: function(response){

			EXAM_REFRESH_FAILURES = 0;

			var first_load = (examData == undefined);
			var modalTimeOut = $("#modalTimeOut");

			examData = response[0];
			if (isReview=="False")
			{
				examData.time_test_begins = new Date();
		
				if (examData.extras.seconds_left) {
					examData.time_test_ends = new Date();
					examData.time_test_ends.setTime(examData.time_test_begins.getTime() + (examData.extras.seconds_left*1000));
		
					secondsTickerCallbacks["exam_counter"] = function(){
						draw_countDown(countDownDiv, examData.time_test_ends, modalTimeOut)
					};
		
					countDownDiv.removeClass("hidden");
		
				} else {
					countDownDiv.addClass("hidden");
				}
			}else {
				countDownDiv.addClass("hidden");
				first_load=false;
				}
			$(".topBarLogo").find(".totalSlidesNr").text(examData.extras.nr_slides);

			if (examData.extras.nr_unseen == 0 && isReview=="False") {
				$(".finishButton").removeClass("hidden");
			} else {
				$(".finishButton").addClass("hidden");
			}
			
			if (first_load)
				userSlideContainer.trigger("interface_setup", [examData]);

			userSlideContainer.trigger("examdata_refreshed", [examData]);
			
			if (first_load) {

				userSlideContainer.trigger("examdata_first_load", [examData]);

				/*
					We have 3 display-modes:
					 1. Single-user exam
					 2. Single-user training
					 3. Multi-user training
				*/
			
				if (examData.extras.mode == "singleuser-training") {
					// Single-user training
					// if see_corrections: show button and offer review at the end		
			
					refresh_slide();
			
				} else if (examData.extras.mode == "singleuser-exam") {
					// Single-user exam
					// if see_corrections: offer review at the end			
			
					refresh_slide();
			
				} else if (examData.extras.mode == "multiuser-training") {
					// Multi-user training: show studygroup tab (chat, notes, etc)
					// disable back

				}
			}
		}
	}
	
	$.extend(ajax_options, custom_opts || {});

	if (examData && examData.fields.end_date&& isTutorReview=="False") {
		//$.jqlog.info("no need to update exam since it's closed");
		return false;
	}

	ajax_fetch_exam(ajax_options);
}

function draw_countDown(theDiv, end_time, modalTimeOut){
	var now = new Date();
	var timeLeft = (end_time.getTime() - now.getTime())/1000;
	var hoursLeft;
	var minutesLeft;
	if (timeLeft <= 0) {
		// Time is out!
		if (ENABLE_MODAL_TIMEOUT) {
			$(modalTimeOut).modal("show");
			finish_exam();
		} else{
			theDiv.text( gettext("El tiempo se ha acabado") );
            hideMessage = true;
		};
		
		// $(modalTimeOut).modal("show");
		// console.log("se supone que ya mostro el modal");
	} else {
        hideMessage = false;
		hoursLeft = Math.floor(timeLeft / 60);
		minutesLeft = Math.floor(timeLeft % 60);
		if (minutesLeft == 0)
			theDiv.parent().addClass("alert-danger");
		if (minutesLeft<10)
			minutesLeft = "0" + minutesLeft;
		theDiv.text( hoursLeft + ":" + minutesLeft );
	}
}

function display_user_selection(answers) {
	var qType = examSlide.fields.question.fields.type;
	var answered=false;
	if (qType!="PA")
	{
	$.each(answers, function(k,v){

		var xChoice = userSlideContainer.find("ul.optionList > li input[choice_id=" + v.id + "]");
		
		if (v.selected) {
			//xChoice.addClass("answerButtonSelected");
			xChoice.parent().addClass('btn-success').removeClass('btn-default');
			xChoice.parent().find('i').removeClass('icon-check-empty').addClass('icon-check');
			answered=true;
		}
	});

	}
	else
	{
		response = examSlide.fields.text_response
		userSlideContainer.find("#textResponse .answerText").val("");
			if (response!=null)
			{
				userSlideContainer.find("#textResponse .answerText").val(response);
				answered = true
				tempText= response;
			}
	
	}
	if (answered)
	{
		already_graded=true;
		userSlideContainer.find("ul.optionList > li label").attr("disabled", "disabled");
		if  (isReview=="True")
		    userSlideContainer.find("#textResponse .answerText").attr("disabled", "disabled");
	}
	else
	{	
		if (isReview == "False" && isTutorReview == "False"){
			userSlideContainer.find("ul.optionList > li label").removeAttr("disabled");
                        userSlideContainer.find("#textResponse .answerText").removeAttr("disabled");
		}
		else
		{
			userSlideContainer.find("ul.optionList > li label").attr("disabled", "disabled");
                        userSlideContainer.find("#textResponse .answerText").attr("disabled", "disabled");
		}
	
	}

}

function display_feedback(feedback) {
	navBar.slideDown("fast");
	$.each(feedback, function(k,v){
		var optionLi = $("ul.optionList > li.option[choice_id=" + v.id + "]")

		var feedbackDiv = optionLi.find(".feedback");
		is_selected = $("input.answerButton[choice_id=" + v.id + "]").parent().hasClass("active"); 
		if (is_selected){
			if(v.correct)
			{
				optionLi.addClass("correct");
				feedbackDiv.addClass("correct alert-success");
				if (!v.feedback)
					feedbackDiv.html(gettext("Esta es la respuesta correcta"));
			}
			else 
			{
				//optionLi.addClass("incorrect");
				feedbackDiv.addClass("incorrect alert-danger clear");
				feedbackDiv.html(v.feedback);
			}
			feedbackDiv.html(v.feedback);
			feedbackDiv.removeClass("hidden");
			feedbackDiv.removeAttr("style");
	}
	});
}

function showVideo(){

var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }

}
function init_userSlideContainer(position, cb){

	var dict_choices = JSON.stringify(choices);
	already_graded=false;
	actual_position = check_pos($(".currentSlideNr").first().text());
	ajax_fetch_user_slide({
		data: {
			course_id: courseId,
			module_id: moduleId,
			content_id: contentId,
			exam_id: examData.pk,
			position: position,
			choices: dict_choices,
			actual_position: actual_position
		},
		success: function(response){			
			if (countQuestionTimerThread)
				clearInterval(countQuestionTimerThread);
			choices={};
			var slide = response[0];
			examSlide = slide;
            if (examSlide.fields.question){
                $.ajax({
                    'url' : '/content/getQuestionVideoLink/',
                    'type' : 'POST',
                    'data' : {
                    'csrfmiddlewaretoken' : csrf_token,
                    'question' : examSlide.fields.question.pk
                    },
                    'success' : function(data){
			    showVideo(data.url);
                }
            });
            }    

			var diapositive = examSlide.fields.diapositive;			
			var divCountDown = $(".topBarSlideCountDown");

			var modalTimeOut = $("#modalTimeOut");

			$(".topBarLogo").find(".currentSlideNr").text(slide.fields.position+1);

			if (diapositive.fields.content_template) {
				userSlideContainer.css("background-image", "url('" + template_url(diapositive.fields.content_template) + "')");
			} else {
				userSlideContainer.css("background-image", "none");
			}
			if (!examSlide.fields.diapositive.fields.title && !examSlide.fields.diapositive.fields.text) {
				userSlideContainer.addClass("without-slide");
//				userSlideContainer.find(".slideMeta").hide();
				$(".slideMeta").find(".slideDescription").html("");
			} else {
				userSlideContainer.removeClass("without-slide");
				$(".topBarLogo").find(".slideTitle").text(examSlide.fields.diapositive.fields.title ||  " ");
				$(".slideMeta").find(".slideDescription").html(examSlide.fields.diapositive.fields.text);
			}

			if (slide.extras.seconds_on_screen_left) {
				slide.end_time = new Date();
				slide.end_time.setTime(slide.end_time.getTime() + (slide.extras.seconds_on_screen_left*1000));
        if (!(isReview == "True" || isTutorReview == "True"))
           {
							secondsTickerCallbacks["slide_counter"] = function()
							{
								draw_countDown(divCountDown, slide.end_time, modalTimeOut)
							};
							divCountDown.removeClass("hidden");
						}
				} 	
				else 
				{
					secondsTickerCallbacks["slide_counter"] = null;
					divCountDown.addClass("hidden");
				}
			
			if (!examSlide.fields.question) {
				
				userSlideContainer.addClass("without-question");
				if (isReview=="True"){hide_or_show_buttons();setup_oneclick_buttons();}
//				userSlideContainer.find(".questionMeta").css("visibility", "hidden");
			} else {
				userSlideContainer.removeClass("without-question");
//				userSlideContainer.find(".questionMeta").css("visibility", "visible");
				userSlideContainer.find(".questionTitle").html(examSlide.fields.question.fields.title || "");
				userSlideContainer.find(".questionStatement").html(examSlide.fields.question.fields.statement);

				var img = examSlide.fields.question.extras.get_image_data;
                var context_text = examSlide.fields.question.extras.get_context_data;
                var context_image = examSlide.fields.question.extras.get_context_image;
				userSlideContainer.find(".questionImage").empty();
                userSlideContainer.find(".questionContextText").empty();
                userSlideContainer.find(".questionContextImage").empty();
                var showExplainText = false;
                var mp3 = examSlide.fields.question.extras.get_question_file;
		var video = examSlide.fields.question.extras.get_video_url;
		if(video){
		    var tag = document.createElement('script');
		    tag.src = "https://www.youtube.com/iframe_api";
		    var firstScriptTag = document.getElementsByTagName('script')[0];
		    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		    // 3. This function creates an <iframe> (and YouTube player)
		    //    after the API code downloads.
		    var player;
		    var getVideoId= function(){
			if(video.split("v=").length > 1){
			    return video.split("v=")[1];
			}else if(video.split("youtu.be").length > 1){
			    return video.split('/')[3];		
			}
		    }
		    window.onYouTubeIframeAPIReady = function() {
			player = new YT.Player('player', {
		    	    height: '390',
			    width: '100%',
			    videoId: getVideoId(),
			    events: {
			        'onReady': onPlayerReady,
			        'onStateChange': onPlayerStateChange
			    }
		         });
		      }

		      // 4. The API will call this function when the video player is ready.
		      function onPlayerReady(event) {
			event.target.playVideo();
			if( !$(".finishButton").hasClass('hidden')){
			     $(".finishButton").attr('disabled','');
			}
			if( !$(".nextButton").hasClass('hidden')){
			     $(".nextButton").attr('disabled','');
			}



		      }

		      // 5. The API calls this function when the player's state changes.
		      //    The function indicates that when playing a video (state=1),
		      //    the player should play for six seconds and then stop.
		      var done = false;
		      user = null;
		      $.ajax({
			'url' : '/api/get_profile_data',
			'success' : function(data){
				user =data;
			}
		      });
		      $.get('/static/js/verbs.js');
		      $.get('/static/js/xapiwrapper.js');
		      function onPlayerStateChange(event) {
			if (event.data == YT.PlayerState.PLAYING && !done) {
			}
			if (event.data == YT.PlayerState.ENDED ){
			    done = true;
			    params = {
				   'lrs' : location.host + '/xapi/statements/',
				    'verb' : ADL.verbs.play,
				    'rId' : ADL.ruuid(),
				    'name' : 'PLAY YOUTUBE VIDEO',
				    'as_actor' : { 
					"mbox": "mailto:"+user.email,
					'name' : user.username,
					'objectType' : 'Agent'
				    },
				    'tcObj' : {
					"id" : video,
					"objectType" : "Activity",
					"definition" : {
					    "type" : "type:media",
					    "name" : {
						"en-Us" : "youtube video",
						"es-es" : "video de youtube"
					    },
					    "description" : {
						"en-Us" : "youtube video played and finished",
						"es-es" : "Vio el video de youtube completo"
					    },

					} 
				    } 
			    }
			    insertStatement(params);
			    $('.finishButton').removeAttr('disabled');
			    $('.nextButton').removeAttr('disabled');

			}

		      }

		      function stopVideo() {
			player.stopVideo();
		      }
		}
		userSlideContainer.find(".questionFile").empty();
		if(mp3){
		    mp3Data = mp3;
		    var theMP3 = $('<audio controls autoplay><source  src="http://'+location.host+'/lms/content/questionfile/?question='+examSlide.fields.question.pk+'"></audio>');
		    userSlideContainer.find(".questionFile").append(theMP3);
		}
		if (img){
					imgData = img.split(",")
					
					var size= ""
					if (parseInt(imgData[2]) > 600){
						height=600;
						size = "height=" + height + "px ";
					}
					if (parseInt(imgData[1]) > 400)
						{
						width=400;
						size+= " width= " + width + "px ";
						}                    showExplainText = true;
					var theImage = $("<input src=/content/question/images/" + examSlide.fields.question.pk + "/"+ imgData[0] + " type='image' id='imgId' name='imgchoice'  "+ size+"/>");
                    
					userSlideContainer.find(".questionImage").append(theImage);
                    }
                    if (context_text){
                        userSlideContainer.find(".questionContextText").html(context_text);
                    }
                    if (context_image){
                            cImgData = context_image.split(",")
                            var size = ""
                            if (parseInt(cImgData[2]) > 600){
                                height=600;
                                size = "height=" + height + "px ";
                            }
                            if (parseInt(cImgData[1]) > 400){
                              width=400;
                              size+= " width= " + width + "px ";
                                                                                                                                                    }
                         var theImage = $("<input src=/content/question/context/" + examSlide.fields.question.pk + "/"+ cImgData[0] + " type='image' id='imgId' name='imgcontext'  "+ size+"/>");
                         showExplainText = true;
                         userSlideContainer.find(".questionContextImage").append(theImage);
                    }

                    if (showExplainText){
					    userSlideContainer.find(".explainImage").show();
                    }
				
				labels = Array("A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "Q.", "R.", "S.", "T.", "U.", "V.", "W.", "X.", "Y.", "Z.");
				userSlideContainer.find("ul.optionList > li.option").remove();

				$(".feedback").hide();
				userSlideContainer.find(".dataResponse").remove();
				userSlideContainer.find(".answerText").val("");
				userSlideContainer.find("#textResponse").addClass("hidden").hide();
				userSlideContainer.find("#feedbackQuestionText").text('')
				if (examSlide.fields.question.fields.feedback){
						userSlideContainer.find("#feedbackQuestionText").html(examSlide.fields.question.fields.feedback);
				}
				if (examSlide.fields.question.fields.type!="PA")
				{
				$.each(examSlide.extras.user_answers_set, function(k,v){
					var newButton = $("ul.optionList > li.template").clone();
					newButton = newButton.removeClass("template");
					newButton = newButton.addClass("option");
					newButton = newButton.removeClass("hidden");
					newButton = newButton.attr("choice_id", v.id);
					
					newButton.find("input.answerButton").attr("choice_id", v.id).parent().click(handle_answer_click);
					newButton.find(".option").html(v.option);
					if (v.imgUrl){
					var size= ""
					if (parseInt(v.imgHeight) > 600){
						height=600;
						size = "height=" + height + "px ";
					}
					if (parseInt(v.imgWidth) > 400)
						{
						width=400;
						size+= " width= " + width + "px ";
						}
					var theImage = $("<input src=/content/images/" + v.id + "/"+ v.imgUrl + " class='imageChoiceClass img-responsive auto' type='image' id='choiceimgId' name='imgchoice'  "+ size+"/>");
					
					newButton.find("#imageChoice").append(theImage);
					}
					newButton.find(".sequential_letter").text(labels[k]);
					userSlideContainer.find("ul.optionList").append(newButton);
					
				});
			    if (isReview == "True" && is_sabi == "True"){
                    userSlideContainer.find(".tutorfeedback").empty()
                    userSlideContainer.find(".tutorgrade").empty();
                    var newButton = $("ul.optionList").find(".template").clone();
                    newButton = newButton.removeClass("template");
                    newButton = newButton.addClass("option");
                    newButton = newButton.removeClass("hidden");
                    newButton = newButton.find("#textResponse").removeClass("hidden").addClass("dataResponse").show();
                    newButton.find(".answerText").remove();
                    newButton.find(".answerguide").remove();
                    newButton.find(".teacherGuide").remove();
                    userSlideContainer.find("ul.optionList").append(newButton);
                    var tutorgrade = examSlide.fields.grade;
               if (tutorgrade == null)tutorgrade="0";
                    tutorfeedback = examSlide.fields.feedback;
               if (tutorfeedback==null)tutorfeedback="";
                    theTutorGrade = $("<input type=text id='tutor_grade' value='"+ tutorgrade+"' disabled='disabled'/>");
                    theTutorFeedback = $("<textarea id='tutor_feedback' type='textarea' disabled='disabled' value='"+tutorfeedback+"' rows='8' cols='50'>"+tutorfeedback+"</textarea>");
                userSlideContainer.find(".tutorfeedback").append(theTutorFeedback);
                userSlideContainer.find(".tutorgrade").append(theTutorGrade);
                $(".gradeResponse").removeClass("hidden").show();
                $(".gradeResponse").removeClass("hidden").show();
                }

				$(".imageChoiceClass").click(function(){ 
						window.open($(this).attr("src"), "Image2", "menubar=no");
						});
				}
				else
				{
				var newButton = $("ul.optionList").find(".template").clone();
					newButton = newButton.removeClass("template");
					newButton = newButton.addClass("option");
					newButton = newButton.removeClass("hidden");
					newButton = newButton.find("#textResponse").removeClass("hidden").addClass("dataResponse").show();
					newButton.find(".answerText").change(handle_answer_change);
					userSlideContainer.find("ul.optionList").append(newButton);
				
				}
	
				display_feedback(examSlide.extras.user_answers_set);
				display_user_selection(examSlide.extras.user_answers_set);
				if (isReview=="True"){
					hide_or_show_buttons();
					setup_oneclick_buttons();
				}
			}
			
			userSlideContainer.trigger("slide_loaded", [slide]);
			
			if (cb)
				cb(slide);
		}
	});
		mark_check();
		if (isReview=="True"){
		if (examSlide.extras.json_value !=undefined && examSlide.fields.question.fields.type != "PA"){
			 if (examSlide.extras.json_value){
			 			$("#correct_answer").removeClass("hidden"); 
			 		}
			 			else{
			 				$("#incorrect_answer").removeClass("hidden"); 
			 			}
			 		}
			 	}
}

function reset_checked(theChoice){
	listOptionList = $(".contentBar").children(".questionMeta").children(".optionList");
	listChoices = listOptionList.children(".option").children("div.top").children(".answerButtonDiv");



	if(theChoice.children("input").prop('checked')==false){

		$.each(listChoices, function(k,v){
			var label = $("." + v.className).children("label");
			var input = label.children("input");
			var i = label.children("i");

			label.removeClass('btn-success').addClass('btn-default');
			input.prop('checked', false);
			i.removeClass('icon-check').addClass('icon-check-empty');

		});
	}
}


function handle_answer_click(event){

	var theChoice = $(this);
	if (theChoice.hasClass("disabled")){
		
		return false;
	}
	var qType = examSlide.fields.question.fields.type;
	if (qType != "SM" && qType !="PA")
	{
		reset_checked(theChoice);
	}
	if (examSlide.extras.has_feedback) {
			$(".showFeedbackButton").removeClass("hidden");	
		} else {
			$(".showFeedbackButton").addClass("hidden");
		}

	if (examSlide.fields.question.fields.feedback) {
			$(".showFeedbackQuestionButton").removeClass("hidden");	
		} else {
			$(".showFeedbackQuestionButton").addClass("hidden");
		}
		
	

	$.each(examSlide.extras.user_answers_set, function(k,v) {
		if (v.id == theChoice.find(".answerButton").attr("choice_id")) {
				v.selected = !v.selected;
			
				if (userSlideContainer.find("ul.optionList > li input[choice_id=" + v.id + "]").parent().hasClass("active")==true)
				{
					choices[v.id]=null;
				}
				else
				{
					choices[v.id]=v.id;
				}
		} 
		else {
			if (qType != "SM") {
				userSlideContainer.find("ul.optionList > li input[choice_id=" + v.id + "]").parent().removeClass("active");
				choices[v.id]=null;
				v.selected = false;
			}
		}
	});

}

function handle_answer_change(event){
	var theText= $(this).val();
	var qType = examSlide.fields.question.fields.type;
	choices["theText"]= theText
	tempText= theText;
	splittedText = theText.split (" ");
	actual_quantity = splittedText.length
	if (actual_quantity <= 200)
	{
		return true;
	}
	else
	{
		alert("Te has pasado del límite indicado que son 200 palabras, hay escritas " + actual_quantity);
		return false;
	}
}

function handle_feedback_change(event){
	var theText= $(this).val();
	choices["theFeedback"]= theText;
}

function handle_grade_change(event){
	var theText= $(this).val();
	if (theText > max_grade_data)
	{
	    alert("La nota no puede pasar de " + max_grade_data)
	    return false;
	}
	choices["theGrade"]= theText;
}


function ajax_fetch_exam(options) {
	var data = options.data;
	if (!data) data ={};
	data["csrfmiddlewaretoken"] = csrf_token;
	myAjax({
		type: 'POST',
		url: "json_fetch_exam/",
		data: data,
		success: function(response) {
			options.success(response);
		},
		json_error: options.json_error,
		error: options.error
	});
}

function ajax_fetch_user_slide(options) {
	options.data = options.data || {};
	options.data["csrfmiddlewaretoken"]= csrf_token;
	myAjax({
		url: "json_fetch_user_slide/",
		async: options.async,
		data: options.data,
		success: function(response) {
			$.each(response, function(k,v){
				if (v.extras == undefined) v.extras = [];
				if (v.extras.json_user_answers) {
					v.extras.user_answers_set = jQuery.parseJSON(v.extras.json_user_answers);
					response[k].extras.json_user_answers = null;
				}
				if (v.extras == undefined) v.extras = [];
			});
			if (response[0].fields.question && response[0].fields.question.extras.get_image_data == null) {
				$(".explainImage").hide();
			}
			options.success(response);
		},
		json_error: options.json_error,
		error: options.error
	});
}

function ajax_set_user_answer(options) {
	options.data = options.data || {};

	myAjax({
		url: "json_set_user_answer/",
		async: options.async,
		data: options.data,
		success: options.success,
		json_error: options.json_error,
		error: options.error
	});
}


function ajax_get_feedback(options) {

	options.data = options.data || {};
	myAjax({
		url: "json_get_feedback/",
		async: options.async,
		data: options.data,
		success: options.success,
		json_error: options.json_error,
		error: options.error
	});
}

function ajax_finish_exam(options) {
	options.data = options.data || {};
	myAjax({
		url: "json_finish_exam/",
		async: options.async,
		data: options.data,
		success: options.success,
		json_error: options.json_error,
		error: options.error
	});
}

function ajax_accept_exam_score(options) {
	options.data = options.data || {};

	myAjax({
		url: "json_accept_exam_score/",
		async: options.async,
		data: options.data,
		success: options.success,
		json_error: options.json_error,
		error: options.error
	});
}

function ajax_save_last_feedback(options) {

	options.data = options.data || {};

	myAjax({
		url: "json_save_last_feedback/",
		async: options.async,
		data: options.data,
		success: options.success,
		json_error: options.json_error,
		error: options.error
	});
}

function check_pos(value){
	if(actual_position != value-1){
		actual_position = value-1;
	}

	return actual_position;
}
