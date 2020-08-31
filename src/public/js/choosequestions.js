function getQuestions(subject, topic, type, keywords){

    $.ajax('/api/question/search', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            subject: subject,
            topic: topic,
            type: type,
            keywords: keywords
        }),
        success: function(data){

            console.log(data);
  
        }
  
    });

}

$(document).ready(function(){

    /*$('#search').click(function(){
        getQuestions($('#question_subject').val(), $('#question_topic').val(), $('#question_type').val(), $('#question_keywords').val())
    });*/

});