function createCourse(name, department, number, section, season, year){

  $.ajax('/course/create', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
          name: name,
          department: department,
          number: number,
          section: section,
          season: season,
          year: year
      }),
      success: function(data){

          if(data.error){
              $('#course_name_error').val(data.error.name);
              $('#course_number_error').val(data.error.number);
              $('#course_section_error').val(data.error.section);
              $('#course_year_error').val(data.error.year);
          } else if(data.success){
              location.href='/course/' + data.success;
          }

      }

  });

}

$(document).ready(function(){

    $('#createCourse').click(function(){
        var name = $('#course_name').val();
        var department = $('#course_department').val();
        var number = $('#course_number').val();
        var section = $('#course_section').val();
        var season = $('#course_season').val();
        var year = $('#course_year').val();

        createCourse(name, department, number, section, season, year);
    });

});
