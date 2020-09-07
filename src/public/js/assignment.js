
function removeQuestion(question, assignment){

    $.ajax('/api/assignment/removequestion', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            question: question,
            assignment: assignment
        }),
        success: function(data){
            $('#' + question).hide(400);
        }
  
    });
  
}
  
  
$(document).ready(function(){

    var assignmentID = common.getURLID();

    $(".question-view").each(function(index){

        var id = $(this).attr('id');
        var removeBtn = '#remove' + id;

        //add event listener to each question item (if its clicked, select it)
        $(removeBtn).click(function(){
            removeQuestion(id, assignmentID);
        });

    });
    

});
