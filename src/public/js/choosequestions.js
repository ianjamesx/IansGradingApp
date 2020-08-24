function getQuestions(subject, topic, type, keywords){

    alert(subject + ' ' + topic + ' ' + type + ' ' + keywords);

}

$(document).ready(function(){

    $('#search').click(function(){
        getQuestions($('#question_subject').val(), $('#question_topic').val(), $('#question_type').val(), $('#question_keywords').val())
    });

});