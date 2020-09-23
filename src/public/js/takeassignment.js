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
                var newmsg = (data.attempts + ' attempts remaining');
                $('#' + attemptID).text(newmsg);

                //if out of attempts, set question to incorrect
                if(data.attempts == 0){
                    $('#question' + data.id).addClass('question-incorrect');
                    disableQuestion(data.id, data.answer);
                }

            } else {

                //update score
                var score = data.score + '%';
                $('#score').text(score);

                //set question to correct
                $('#question' + data.id).addClass('question-correct');
                disableQuestion(data.id, data.answer);

            }

        }
  
    });
  
}

function disableQuestion(question, answer){

    //empty div of answers and button
    var div = 'answers' + question;
    $('#' + div).html('<h3> Correct answer: ' + answer + '</h3>');

}

function updateScore(){

    var isCorrect = 0;
    var total = 0;

    $(".question-view").each(function(index){
        var currCorrect = $(this).hasClass('question-correct');
        if(currCorrect) isCorrect++;
        total++;
    });

    var overall = isCorrect / total;
    overall *= 100;
    overall = Math.floor(overall);
    $('#score').text(overall + '%');

}

$(document).ready(function(){

    var assignmentID = common.getURLID();
    //updateScore();

    $(".answerquestion").each(function(index){

        var id = $(this).attr('id');
        $("#" + id).click(function(){

            var radioname = 'answer' + id;

            var answer = $('input[name="' + radioname + '"]:checked').val();
            
            answerQuestion(assignmentID, id, answer);

        });

    });
    

});
