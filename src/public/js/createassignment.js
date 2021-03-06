function createAssignment(name, course, category, prompt, open, close, cutoff, attempts, points, latepenalty, randomize, type){

    $.ajax('/api/assignment/create', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            type: type,
            course: course,
            type: type,
            category: category,
            prompt: prompt,
            open: open,
            close: close,
            cutoff: cutoff,
            attempts: attempts,
            points: points,
            latepenalty: latepenalty,
            randomize: randomize
            
        }),
        success: function(data){
  
            if(data.error){
                $('#assignment_name_error').text(data.error.name);
                $('#assignment_points_error').text(data.error.points);
                $('#assignment_latepenalty_error').text(data.error.latepenalty);
                $('#assignment_attempts_error').text(data.error.attempts);
                $('#assignment_date_error').text(data.error.dates);
  
                //error if unknown err occurs
                if(data.error.any){
                  common.unknownerr('unknownerr');
                }

                var err = Components.error({
                  message: 'There were some errors with your assignment details, scroll up for more'
                });
                $('#unknownerr').html(err);

            } else if(data.success){
                location.href='/assignment/choosequestions/' + data.success;
            }
  
        }
  
    });
  
  }
  
  function getCategories(course){

    //remove all current options
    $("#assignment_category").empty();

    $.ajax('/api/course/getcategories', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: course
        }),
        success: function(data){

            var categories = data.success;
            console.log(categories);

            var i;
            for(i = 0; i < categories.length; i++){
                $("#assignment_category").append(new Option(categories[i].name, categories[i].name));
            }
  
        }
  
    });
  
  }
  
  $(document).ready(function(){

    //see if a course id is passed, if so, set course
    var course = common.getURLID();
    if(!(isNaN(course))){
      $('#assignment_course').val(course);
    }

    //init course categories to whatever course its selected to
    getCategories($('#assignment_course').val());
  
      $('#createAssignment').click(function(){
          var name = $('#assignment_name').val();
          var type = $('#assignment_type').val();
          var course = $('#assignment_course').val();
          var category = $('#assignment_category').val();
          var prompt = $('#assignment_prompt').val();
          var open = $('#assignment_open').val();
          var close = $('#assignment_close').val();
          var cutoff = $('#assignment_cutoff').val();
          var attempts = $('#assignment_attempts').val();
          var points = $('#assignment_points').val();
          var latepenalty = $('#assignment_latepenalty').val();
          var randomize = $('#check_id').is(":checked");
  
          createAssignment(name, course, category, prompt, open, close, cutoff, attempts, points, latepenalty, randomize, type);
      });
  
      //keep track of categories user makes
      $('#assignment_course').change(function(){
        getCategories($('#assignment_course').val());
      });

      $("#assignment_open").flatpickr({
        altInput: true,
        enableTime: true,
        altFormat: "F j, Y H:i",
        dateFormat: "Y-m-d H:i",
      });

      $("#assignment_close").flatpickr({
        altInput: true,
        enableTime: true,
        altFormat: "F j, Y H:i",
        dateFormat: "Y-m-d H:i",
      });

      $("#assignment_cutoff").flatpickr({
        altInput: true,
        enableTime: true,
        altFormat: "F j, Y H:i",
        dateFormat: "Y-m-d H:i",
      });

  });