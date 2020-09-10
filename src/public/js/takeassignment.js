function answerQuestion(assignment, question, answer){

    $.ajax('/api/assignment/answerquestion', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            assignment: assignment,
            question: question,
            answer: answer
        }),
        success: function(data){
            console.log(data);
            if(data.correct == false){
                if(!data.hint) data.hint = 'There is no hint available for this question';
                $('#hint').text(data.hint);
                $('#answer_modal').modal('show');

                //update attempts remaining
                var attemptID = 'attempt' + question;
                var newmsg = (data.attemptsleft + ' attempts remaining');
                $('#' + attemptID).text(newmsg);
            }
        }
  
    });
  
}

$(document).ready(function(){

    var assignmentID = common.getURLID();

    $(".answerquestion").each(function(index){

        var id = $(this).attr('id');
        $("#" + id).click(function(){

            var radioname = 'answer' + id;

            var answer = $('input[name="' + radioname + '"]:checked').val();
            
            answerQuestion(assignmentID, id, answer);

        });

    });
    

});
