function coursesearch(key){

    $.ajax('/course/searchbykey', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            key: key,
        }),
        success: function(data){
            console.log(data);
            if(data.error){
                
                //render error message, could not find course
                var err = Components.error({
                    message: 'Could not find course with that key'
                });
                $('#searchresult').html(err);

            } else if(data.success){
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
                console.log(data);
                $('#searchresult').html(success);

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

    $('#join').click(function(){
        alert("HEELO!");
        var id = $('#join').attr("value");
        alert(id);
        //coursesearch(key);
    });

    [id]

});
