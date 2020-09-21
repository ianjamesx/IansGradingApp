function joincourse(id){

    $.ajax('api/course/join', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: id
        }),
        success: function(data){

            if(data.error){
                
                //couldnt join, put error on modal
                var err = Components.error({
                    message: 'Could not join that course'
                });
                $('#searcherror').html(err);

            } else if(data.success){

                //redirect to course page after joining
                location.href = ('/course/' + id);
            }

        }

    });

}
//9M0356VC
function coursesearch(key){

    $.ajax('api/course/searchbykey', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            key: key,
        }),
        success: function(data){
            if(data.error){
                
                //render error message, could not find course
                var err = Components.error({
                    message: 'Could not find course with that key'
                });
                $('#searcherror').html(err);

            } else if(data.success){

                //create success content and modal to prompt user
                var success = Components.coursesearchsuccess({
                    name: data.success.name,
                    department: data.success.department,
                    number: data.success.number,
                    section: data.success.section,
                    season: data.success.season,
                    year: data.success.year,
                    instructor: data.success.instructor,
                    id: data.success.id
                });

                //write data to modal, and show to user
                $('#course_info').html(success);
                $('#course_modal').modal('show');

                //add event listener to join course button
                $('#join').click(function(){
                    joincourse(data.success.id);
                });

            }

        }

    });

}

//page start

$(document).ready(function(){

    $('#search').click(function(){
        var key = $('#course_key').val();
        coursesearch(key);
    });

});
