/*SECTION: GLOBAL CONSTANTS*/

//Note to self jquery: .val, $('.class1 input') | javascript: .value, document.getElementById


const IND_MAIN = 0; //Index of the panel first shown ("main panel")
const IND_EXAMS = 1; //Index of the panel where exams are inputed ("exam panel")
const IND_AVAIL = 2; //Index of the panel where avaiable studying time is inputed ("avail panel")
const IND_ALLOC = 3; //Index of the panel where studying time is allocated to exams ("alloc panel")
const IND_RESULT = 4; //Index of the panel where the completed study schedule is shown to the user ("result panel")

var PANEL_DISPLAY = [document.getElementById("mainPanel"),
                     document.getElementById("examPanel"),
                     document.getElementById("availPanel"),
                    /* document.getElementById("allocPanel"),
                     document.getElementById("resultPanel") */
                   ];

var NEXT_BUTTON = document.getElementById("nextButton");

var TXT_CURRENT_DATE = document.getElementById("txtCurrentDate");

var USES_NEXT = [false,true,true,true, false];


/*SECTION: GLOBAL variables*/

var activePanel = 0;

var examDateInputs = new ExamEntry(); //used to store data about entries in exam panel

var currentDate = null;
var examDate = []; //array of exam{str examName, str examTime}

/*SECTION: FUNCTIONS*/

/*Checks the requirements of moving to the next panel, can be set so that a user
  prompt is a requirement.
  If the requirements are not met will give an error message to the user.
  effects: may display prompts to user */
var CHECK_PANEL_PROGRESS_REQUIREMENT = [
  function() {
    return true;
  },
  function() {
    currentDate = new Date(TXT_CURRENT_DATE.value);
    if (isNaN(currentDate.getTime())) {
      alert("The Starting Time is invaild!");
      return false;
    }

    examDate = [];

    for (var i = examDateInputs; i != null; i = i.below) {
      var examName1 = i.txtSubject.val() + " " + i.txtCode.val();
      var examTime1 = new Date(i.txtDate.val());
      examName1 = examName1.trim();

      if (examName1 === "") {
        alert("At least one of (Subject or Course Number) cannot be empty!");
      } else if (isNaN(examTime1.getTime())) {
        alert("The course \"" + examName1 + "\" has an invalid date!");
      } else if (examTime1.getTime() <= currentDate.getTime()) {
        alert("The course \"" + examName1 + "\" finishes before the Starting Time!");
      } else {
        examDate.push({examName:examName1, examTime:examTime1});
        continue;
      }

      return false;
    }

    examDate.sort(function(date1, date2) {
      return date1.examTime - date2.examTime;
    });

    return true;
  },
  function() {


    return false;
  }
];

/*Updates the panel shown to the user
  effects: may change properties of panels*/
function UpdatePanelDisplay() {
  if (PANEL_DISPLAY[activePanel].style.display == "none") {
    var i;
    for (i = 0; i < PANEL_DISPLAY.length; i++){
      PANEL_DISPLAY[i].style.display = "none";
    }
    PANEL_DISPLAY[activePanel].style.display = "block";
  }

  if (USES_NEXT[activePanel] && NEXT_BUTTON.style.display == "none") {
    NEXT_BUTTON.style.display = "block";
  } else if (!USES_NEXT[activePanel] && NEXT_BUTTON.style.display == "block") {
    NEXT_BUTTON.style.display = "none";
  }
}

/*Inializes the panel shown to user, done after UpdatePanelDisplay is called first time.
  Each function called may have its own requirements
  effects: may change properties of panels */
var INITIALIZE_PANEL = [
  function() {
  },
  function() {
  },
  function() {
    AvailPanelInitalize();
  }
];

/*Attempts to progress to the next panel if the data entered is valid
  effects: may changes the properties of the forms shown to the user
           may display prompts to user*/
function NextPanel() {
  if (CHECK_PANEL_PROGRESS_REQUIREMENT[activePanel]()){
    activePanel ++;
    UpdatePanelDisplay();
    INITIALIZE_PANEL[activePanel]();
  }
}

/*SECTION: CalendarEventLite */
class StudyDate {
  /*
  class variables:
  date

  */
}
