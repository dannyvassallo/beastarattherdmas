

// Datepicker
$(document).ready(function(){
  $("#dtBox").DateTimePicker({
    dateFormat: "mm-dd-yyyy"
  });
});

// iterate through errors and growl them
function growlz(){
  setTimeout(function(){
    $('label.error').each(function(){
      if($(this).html() != ""){
        var errorText = $(this).text();
        $.growl.error({ message: errorText });
      }
    });
  }, 100);
}


// successMsg Constructor
var successMsg = "<div id=\"thankyou\" class=\"col-xs-12 text-center\"><a href=\"http://starstable.com\" target=\"_blank\"><img class=\"full-w thank-you-img\" src=\"https://s3.amazonaws.com/myfangate.com/beastar/thankyoucode.png\"></a><button class=\"again-button\">Enter Again</div></div><p class=\"entries\">Unlimited entries through March 24, 2016</p><p class=\"text-center\"><a class=\"rules\" href=\"http://www.radiodisneyapp.com/rules\" target=\"_blank\">Official Rules</a></p>";

// dateparse for safari compatibility
function parseDate(input, format) {
  format = format || 'yyyy-mm-dd'; // default format
  var parts = input.match(/(\d+)/g),
      i = 0, fmt = {};
  // extract date-part indexes from the format
  format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });

  return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
}

// Add age validation method
$.validator.addMethod("minAge", function(value, element, min) {
    var today = new Date();
    var birthDate = new Date(parseDate(value, 'mm-dd-yyyy'));
    var age = today.getFullYear() - birthDate.getFullYear();
    if (age > min+1) {
        return true;
    }
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= min;
}, "You are not old enough!");


$("#contest").validate({
  focusInvalid: false,
  rules: {
    // first name
    'entry.1862104037': {
      //checks for whitespace
      required: {
        depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
        }
      },
      lettersonly: true,
      minlength: 2
    },
    // email
    'entry.322932457': {
      //checks for whitespace
      required: {
        depends:function(){
          $(this).val($.trim($(this).val()));
          return true;
        }
      },
      email: true
    },
    'entry.328909515': {
        required: true,
        minAge: 13
    },
    'entry.69019987': {
       required : true
    }
  },
  messages: {
    // first name
    'entry.1862104037': {
      required: "Please give your first name.",
      lettersonly: "Letters only in the name fields please.",
      minlength: jQuery.validator.format("At least {0} characters required!"),
    },
    // email
    'entry.322932457': {
      required: "Please give your e-mail address.",
      email: "Please give a valid e-mail address."
    },
    'entry.69019987': {
      required : "You must agree to the rules."
    }
  },
  invalidHandler: function(form, validator) {
    growlz();
  },
  success: "valid",
  submitHandler: function(form) {
    formH = $('#contest').height();
    form.submit();
    $.growl.notice({ message: "Thanks! We've received your entry." });
    setTimeout(function(){
      $('#contest').parent().html(successMsg).css('min-height', formH);
    }, 500);
  }
});

// $("#age-gate").validate({
//   focusInvalid: false,
//   rules: {
//     birthday: {
//       required: true,
//       minAge: 13
//     }
//   },
//   messages: {
//     birthday: {
//       required: "You must enter your date of birth",
//       minAge: "You must be at least 13 years old."
//     }
//   },
//   invalidHandler: function(form, validator) {
//     growlz();
//   },
//   success: "valid",
//   submitHandler: function() {
//     $('#gate').fadeOut( 500 );
//     setTimeout(function(){
//       $('#content').fadeIn();
//       $('#footer').fadeIn();
//     }, 500);
//   }
// });

// reload the page

$(document).on('click','.again-button', function(e){
  e.preventDefault();
  location.reload();
});

// form fixer
$('.datepicker').on('focus', function(){
  if($('#dtBox').is(':visible')){
    $('.datepicker').blur();
    // enable touch events on datepicker
    // $(".increment, .decrement").hammer({domEvents: true}).on("tap", function(event){
    //     this.click();
    //     event.stopPropagation();
    //     event.preventDefault();
    //     event.gesture.preventDefault();
    //     event.gesture.stopDetect();
    // });
    $("#contest :input").prop("disabled", true);
  } else {
    $("#contest :input").prop("disabled", false);
  }
});

$('.datepicker').on('blur', function(){
  $("#contest :input").prop("disabled", false);
});
