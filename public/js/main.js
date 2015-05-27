$(document).ready(function() { 

	//ajax form config
    var options = { 
        success: function() { 
	        alert("submitted"); 
	    },
        error: function(response) { 
        	console.log(arguments);
	        alert("Form validation failed!\n\n"+response.responseJSON.message); 
	    }
    }; 

    //init form validation and ajax submit
	$('form.payment_form').validate({
		submitHandler: function(form) {
			$(form).ajaxSubmit(options);
		}
	});
}); 