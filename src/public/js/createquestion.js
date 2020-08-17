function switchQuestionUI(question){

    switch(question){
        case 'Multiple Choice':

            var ans = Components.createmultiplechoice();
            console.log(ans);
            $('#answer_area').html(ans);

            var allanswers = {};

            $('#add_answer').click(function(){
                addAnswer($('#answer_text').val(), $('input[name="answer_correct"]:checked').val(), allanswers);
            });

            return allanswers;

        break;
        case 'Enter Answer Directly':

            var ans = Components.createenterans();
            console.log(ans);
            $('#answer_area').html(ans);

        break;
        case 'Write Code':
        
        break;
    }

}


function addAnswer(answer, correct, allanswers){

    var id = common.id();
    var ans;
    var corr;

    //append answer to list
    if(correct == 'correct'){
        ans = Components.createdanswercorrect({
            answer: answer,
            id: id
        });
        corr = 1;
    } else {
        ans = Components.createdanswerincorrect({
            answer: answer,
            id: id
        });
        corr = 0;
    }

    $('#answers').append(ans);


    //push info into array
    allanswers[id] = {
        answer: answer,
        correct: corr
    }

    //add removable behavior
    $('#remove' + id).click(function(){
        $('#' + id).remove();
        delete allanswers[id];
        console.log(allanswers);
    });

    //clear inputs
    $('#answer_text').val('');

}

function removeAllAnswers(allanswers){
    var i;
    for(i in allanswers){
        $('#' + i).remove();
        delete allanswers[i];
    }
}

function getArrayforAnswers(allanswers){
    var ans = [];
    var i;
    for(i in allanswers){
        ans.push({
            answer: allanswers[i].answer,
            correct: allanswers[i].correct,
        });
    }
    return ans;
}

function saveQuestion(question, allanswers, subject, topic, type, public){

    //transform into server friendly formats
    var answers = getArrayforAnswers(allanswers);

    $.ajax('api/question/create', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            question: question,
            answers: answers,
            subject: subject,
            topic: topic,
            type: type,
            public: public
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
                removeAllAnswers(allanswers);
            }
  
        }
  
    });

}

$(document).ready(function(){

    var allanswers = switchQuestionUI($('#question_type').val());
    
    $('#question_type').change(function(){
        allanswers = switchQuestionUI($('#question_type').val());
    });

    $('#saveQuestion').click(function(){
        saveQuestion($('#question_text').val(), allanswers, $('#question_subject').val(), $('#question_topic').val(), $('#question_type').val(), $('#public').is(":checked"));
    });

});