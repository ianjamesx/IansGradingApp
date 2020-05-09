var assets = {assignmentcardsimple: function(param){var properties = ['name','opendisplaydate','id'];
this.errorcheck(properties, param);return `<div class="list-group-item">
  <h3 class="card-title">` + param.name + `</h3>
  <h4>` + param.opendisplaydate + `</h4>
  <a href="/assignment/` + param.id + `" class="reportlink">View Assignment</a>
  <span style="display:block; height: 20px;"></span>
</div>
`;},courseinfocard: function(param){var properties = ['name','dept','number','section','season','year','id'];
this.errorcheck(properties, param);return `<div class="list-group-item">
  <h3 class="card-title">` + param.name + `</h3>
  <h4>` + param.dept + ` ` + param.number + ` - ` + param.section + `</h4>
  <h4>` + param.season + ` ` + param.year + `</h4>
  <a href="../course/` + param.id + `" class="reportlink">Go To Course Page</a>
  <span style="display:block; height: 20px;"></span>
</div>
`;},coursesearchsuccess: function(param){var properties = ['name','dept','number','section','season','year','instructor'];
this.errorcheck(properties, param);return `<span style="display:block; height: 20px;"></span>
<div class="alert alert-success"><span>Course Found</span></div>
<span style="display:block; height: 10px;"></span>
<div class="panel panel-default">
  <div class="panel-body">
    <span style="display:block; height: 20px;"></span>
    <h2>` + param.name + `</h2>
    <h4>` + param.dept + ` ` + param.number + ` - ` + param.section + `</h4>
    <h4>` + param.season + ` ` + param.year + `</h4>
    <h4>Instructor: ` + param.instructor + `</h4>
    <span style="display:block; height: 10px;"></span>
  </div>
</div>
<div id="joinCourse"></div>
`;},createenterans: function(param){return `<span style="display:block; height: 20px;"></span> 
  <textarea class="form-control" placeholder="Enter a question" id="question2"></textarea> 
  <small id="question2help" class="text-danger"></small> 
  <span style="display:block; height: 20px;"></span> 

  <form> 

  <div class="form-row"> 
    <div class="form-group col-md-6"> 
      <input class="form-control" placeholder="Correct Answer" id="correctans"></input> 
      <small id="correctanshelp" class="text-danger"></small> 
    </div> 
  </div> 

  <span style="display:block; height: 10px;"></span> 
  <div class="form-row"> 
    <div class="form-group col-md-6"> 
      <input class="form-control" placeholder="hint (optional)" id="hint"></input> 
    </div> 
  </div> 

</form>
`;},createmultiplechoice: function(param){return `<span style="display:block; height: 20px;"></span>
<textarea class="form-control" placeholder="Enter a question" id="question1"></textarea>
<small id="question1help" class="text-danger"></small>
<span style="display:block; height: 40px;"></span>

<form>

  <div id="options">
    <ul class="list-group"></ul>
  </div>

  <span style="display:block; height: 20px;"></span>
  <div class="form-row">
    <div class="form-group col-md-8">
      <input class="form-control" placeholder="hint (optional)" id="hint"></input>
    </div>
  </div>

  <span style="display:block; height: 10px;"></span>
  <button type="button" class="appbtn" type="button" id="newchoice">Add another option</button>
  <hr>

</form>
`;},deletemodal: function(param){var properties = ['title','text','canceltext','deletebtn','confirmtext'];
this.errorcheck(properties, param);return `<div class="modal fade" id="myModal" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">` + param.title + `</h4>
      </div>
      <div class="modal-body">
        <p>` + param.text + `</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="appbtn" data-dismiss="modal">` + param.canceltext + `</button>
        <button type="button" id="` + param.deletebtn + `" class="appbtn deletebtn" data-dismiss="modal">` + param.confirmtext + `</button>
      </div>
    </div>
  </div>
</div>
`;},dismiss: function(param){var properties = ['id'];
this.errorcheck(properties, param);return `<button type="button" id="remove` + param.id + `" class="close" aria-label="Close">
  <span aria-hidden="true">&times;</span>
</button>
`;},enteransdissmissable: function(param){var properties = ['id','question','answer','hint'];
this.errorcheck(properties, param);return `<div id="` + param.id + `" class="list-group-item">
  <button type="button" id="remove` + param.id + `" class="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <h5 class="card-title">` + param.question + `</h5>
  <hr>
  <p><small>correct answer:</small></p>
  <p class="card-text">` + param.answer + `</p>
  <p class="card-text"><small><bold>` + param.hint + `<bold><small></p>
  <span style="display:block; height: 20px;"></span>
</div>
`;},error: function(param){var properties = ['message'];
this.errorcheck(properties, param);return `<span style="display:block; height: 20px;"></span>
<div class="alert alert-danger"><span>` + param.message + `</span></div>
<span style="display:block; height: 10px;"></span>
`;},instructorassignmentcard: function(param){var properties = ['name','opendisplaydate','id','questioncount','points','attempts'];
this.errorcheck(properties, param);return `<div class="list-group-item">
  <h3 class="card-title">` + param.name + `</h3>
  <h4>` + param.opendisplaydate + `</h4>
  <span style="display:block; height: 20px;"></span>
  <button type="button" class="appbtn" data-toggle="collapse" data-target="#` + param.id + `">More Info&nbsp;<i class="fas fa-caret-down"></i></button>
  <div id="` + param.id + `" class="collapse"><hr>
    <span style="display:block; height: 20px;"></span>
    <p>Number of Questions: ` + param.questioncount + `</p>
    <p>Total points: ` + param.points + `</p>
    <p>Number of attempts: ` + param.attempts + `</p>
    <span style="display:block; height: 5px;"></span>
    <a href="../assignment/` + param.id + `" class="reportlink">Go To Assignment Page</a>
    <span style="display:block; height: 5px;"></span><hr>
    <a href="../assignment/` + param.id + `" class="reportlink">View Assignment Report</a>
    <span style="display:block; height: 10px;"></span>
  </div>
</div>
`;},instructorcodecard: function(param){var properties = ['name','opendisplaydate','id','prompt'];
this.errorcheck(properties, param);return `<div class="list-group-item">
  <h3 class="card-title">` + param.name + `</h3>
  <h4>` + param.opendisplaydate + `</h4>
  <span style="display:block; height: 20px;"></span>
  <button type="button" class="appbtn" data-toggle="collapse" data-target="#` + param.id + `">More Info&nbsp;<i class="fas fa-caret-down"></i></button>
  <span style="display:block; height: 10px;"></span>
  <div id="` + param.id + `" class="collapse"><hr>
    <span style="display:block; height: 10px;"></span>
    <p>` + param.prompt + `</p>
    <hr>
    <span style="display:block; height: 10px;"></span>
    <a href="../codeassignment/` + param.id + `" class="reportlink">Go To Assignment Page</a>
    <span style="display:block; height: 5px;"></span><hr>
    <a href="../codeassignmentreport/` + param.id + `" class="reportlink">View Assignment Report</a>
    <span style="display:block; height: 10px;"></span>
  </div>
</div>
`;},modal: function(param){var properties = ['modal','title','text','buttontext'];
this.errorcheck(properties, param);return `<div class="modal fade" id="` + param.modal + `" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">` + param.title + `</h4>
      </div>
      <div class="modal-body">
        <p>` + param.text + `</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="appbtn" data-dismiss="modal">` + param.buttontext + `</button>
      </div>
    </div>
  </div>
</div>
`;},multiplechoicedismissable: function(param){var properties = ['id','question','ans1','ans2','ans3','ans4','hint'];
this.errorcheck(properties, param);return `<div id="` + param.id + `" class="list-group-item">
  <button type="button" id="remove` + param.id + `" class="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <h5 class="card-title">` + param.question + `</h5>
  <hr>
  <p><small>sample options:</small></p>
  <p class="card-text">` + param.ans1 + `</p>
  <p class="card-text">` + param.ans2 + `</p>
  <p class="card-text">` + param.ans3 + `</p>
  <p class="card-text">` + param.ans4 + `</p>
  <p class="card-text"><small><bold>` + param.hint + `<bold><small></p>
  <span style="display:block; height: 20px;"></span>
</div>
`;},questionchoice: function(param){var properties = ['id'];
this.errorcheck(properties, param);return `<div class="list-group-item">
<!--  <button type="button" id="remove` + param.id + `" class="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button> -->
  <div class="form-row">
    <div class="form-group col-md-9">
      <textarea class="form-control" placeholder="option ` + param.id + `" id="option` + param.id + `"></textarea>
      <small id="` + param.id + `help" class="text-danger"></small>
    </div>
      <label class="switch">
        <input id="` + param.id + `" type="checkbox">
        <span class="slider round correctswitch"></span>
      </label>
  </div>
</div>
`;},questiondismiss: function(param){var properties = ['id','question'];
this.errorcheck(properties, param);return `<div id="` + param.id + `" class="list-group-item question-select">
  <button type="button" id="remove` + param.id + `" class="close" aria-label="Close">
    <span aria-hidden="true">test</span>
  </button>
  <h5 class="card-title">` + param.question + `</h5>
  <span style="display:block; height: 20px;"></span>
</div>
`;},questionselect: function(param){var properties = ['id','question'];
this.errorcheck(properties, param);return `<div id="` + param.id + `" class="list-group-item question-select">
  <!--<button type="button" id="remove` + param.id + `" class="close" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button> -->
  <h5 class="card-title">` + param.question + `</h5>
  <span style="display:block; height: 20px;"></span>
</div>
`;},studentassignmentcard: function(param){var properties = ['name','opendisplaydate','id','questioncount','points','attempts'];
this.errorcheck(properties, param);return `<div class="list-group-item">
  <h3 class="card-title">` + param.name + `</h3>
  <h4>` + param.opendisplaydate + `</h4>
  <span style="display:block; height: 20px;"></span>
  <button type="button" class="appbtn" data-toggle="collapse" data-target="#` + param.id + `">More Info&nbsp;<i class="fas fa-caret-down"></i></button>
  <div id="` + param.id + `" class="collapse"><hr>
    <span style="display:block; height: 20px;"></span>
    <p>Number of Questions: ` + param.questioncount + `</p>
    <p>Total points: ` + param.points + `</p>
    <p>Number of attempts: ` + param.attempts + `</p>
    <span style="display:block; height: 5px;"></span>
    <a href="../assignment/` + param.id + `" class="reportlink">Go To Assignment Page</a>
    <span style="display:block; height: 10px;"></span>
  </div>
</div>
`;},studentcodecard: function(param){var properties = ['name','opendisplaydate','id','prompt'];
this.errorcheck(properties, param);return `<div class="list-group-item">
  <h3 class="card-title">` + param.name + `</h3>
  <h4>` + param.opendisplaydate + `</h4>
  <span style="display:block; height: 20px;"></span>
  <button type="button" class="appbtn" data-toggle="collapse" data-target="#` + param.id + `">More Info&nbsp;<i class="fas fa-caret-down"></i></button>
  <span style="display:block; height: 10px;"></span>
  <div id="` + param.id + `" class="collapse"><hr>
    <span style="display:block; height: 10px;"></span>
    <p>` + param.prompt + `</p>
    <hr>
    <span style="display:block; height: 10px;"></span>
    <a href="../codeassignment/` + param.id + `" class="reportlink">Go To Assignment Page</a>
    <span style="display:block; height: 10px;"></span>
  </div>
</div>
`;},success: function(param){var properties = ['message'];
this.errorcheck(properties, param);return `<span style="display:block; height: 20px;"></span>
<div class="alert alert-success"><span>` + param.message + `</span></div>
<span style="display:block; height: 10px;"></span>
`;},errorcheck: function(properties, obj){
    var i;
    for(i = 0; i < properties.length; i++){
      if(typeof obj[properties[i]] === 'undefined'){
        throw new Error('Object property "' + properties[i] + '" not passed to asset renderer');
      }
    }
  }};