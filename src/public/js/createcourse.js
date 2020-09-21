function createCourse(name, department, number, section, season, year, categories){

  $.ajax('api/course/create', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
          name: name,
          department: department,
          number: number,
          section: section,
          season: season,
          year: year,
          categories: categories
      }),
      success: function(data){

          if(data.error){
              $('#course_name_error').text(data.error.name);
              $('#course_number_error').text(data.error.number);
              $('#course_section_error').text(data.error.section);
              $('#course_year_error').text(data.error.year);

              //error if unknown err occurs
              if(data.error.any){
                common.unknownerr('unknownerr');
              }
          } else if(data.success){
              location.href='/course/' + data.success;
          }

      }

  });

}

function addCategory(name, points, categories){

    var id = common.id();

    //make sure points is a number
    if(isNaN(points)){
        $('#category_points_error').text('Make sure Points field is a number');
        return;
    } else {
        $('#category_points_error').text('');
    }

    var cat = Components.coursecategory({
        name: name,
        points: points,
        id: id
    });
    $('#categories').append(cat);

    //push info into array
    categories[id] = {
        name: name,
        points: points
    }

    //add removable behavior
    $('#remove' + id).click(function(){
        $('#' + id).remove();
        delete categories[id];
        console.log(categories);
    });

    //clear inputs
    $('#category_name').val('');
    $('#category_points').val('');

}

$(document).ready(function(){

    var categories = {};

    $('#createCourse').click(function(){
        var name = $('#course_name').val();
        var department = $('#course_department').val();
        var number = $('#course_number').val();
        var section = $('#course_section').val();
        var season = $('#course_season').val();
        var year = $('#course_year').val();

        createCourse(name, department, number, section, season, year, categories);
    });

    //keep track of categories user makes
    $('#createCategory').click(function(){
        var name = $('#category_name').val();
        var points = $('#category_points').val();

        addCategory(name, points, categories);

    });

});
