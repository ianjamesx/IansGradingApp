function getQuestions(textbook, public, chapter, section){

    $.ajax('/api/question/search', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            textbook: textbook,
            chapter: chapter,
            section: section,
            public: public
        }),
        success: function(data){

            console.log(data);
  
        }
  
    });

}

function saveQuestions(questions, assignment){

    //turn questions object into array of question ids
    var questionlist = common.values(questions);

    $.ajax('/api/assignment/addquestions', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            questions: questionlist,
            assignment: assignment
        }),
        success: function(data){

            location.href='/assignment/' + data.success;
  
        }
  
    });

}

$(document).ready(function(){

    //get id of assignment
    var assignment = common.getURLID();

    var questions = {};

    $(".question-select").each(function(index){

        //add event listener to each question item (if its clicked, select it)
        $(this).click(function(){
            var id = $(this).attr('id');

            //remove question from list if already in there, or add if not
            if(questions[id]){
                delete questions[id];
                $(this).removeClass('question-selected');
            } else {
                questions[id] = id;
                $(this).addClass('question-selected');
            }
            console.log(questions);
        });

    });

    $('#publish').click(function(){
        saveQuestions(questions, assignment);
    });

    /*$('#search').click(function(){
        getQuestions($('#question_subject').val(), $('#question_topic').val(), $('#question_type').val(), $('#question_keywords').val())
    });*/

});