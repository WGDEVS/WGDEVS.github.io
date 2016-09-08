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
                    document.getElementById("allocPanel") /*,
                     document.getElementById("resultPanel") */
                   ];

var NEXT_BUTTON = document.getElementById("nextButton");

var TXT_CURRENT_DATE = document.getElementById("txtCurrentDate");

var txtMaxCourseDailyHours = document.getElementById("txtMaxCourseDailyHours");

var USES_NEXT = [false,true,true,true, false];


/*SECTION: GLOBAL variables*/

var activePanel = 0;

var examDateInputs = new ExamEntry(); //used to store data about entries in exam panel
var currentDate = null;

var studyCalendars = []; //array of calendars for pulling studyDate information
var ExamAllocEntryInputs = []; //array of inputs for pulling information

//Intermidate calculation variables
var examDate = []; //array of exams: {str examName, date examTime}, sorted in ascending examTime
var studyDate = []; //array of dates and how long the student will study for each of those dates: {date date, float hours}
var examAllocEntry = [] //array of time allocations for exams: {int examDateIndex, int hoursAllocated}
var targetHourBlock = 0; //Blocks to allocate study time for a course

var resultData; //{examDates:[{str examName, date examTime}, ...],studyDates:[{date:date, 3:3.4, 4:2.3} ...]}; 
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
      } else if (examName1.indexOf("\"") != -1){
        alert("The course name \"" + examName1 + "\" contains the illegal character \" !");
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
    studyDate = [];

    for (var i = 0; i < studyCalendars.length; i++) {
      var currentStudyCalendarEvents = studyCalendars[i].fullCalendar( 'clientEvents')
      for (var j = 0; j < currentStudyCalendarEvents.length; j++) {
        if (currentStudyCalendarEvents[j].hours != null) {
          if (!IsValidHours(currentStudyCalendarEvents[j].hours)) {
            var dateTemp = new Date(currentStudyCalendarEvents[j].start + 0);
            alert("You are spending an invalid amount of hours studying on " + dateTemp.toUTCString().slice(0, 16) + "!");
            return false;
          } else if (currentStudyCalendarEvents[j].hours > 0) {
            studyDate.push({date:currentStudyCalendarEvents[j].start, hours:currentStudyCalendarEvents[j].hours});
          }
        }
      }
    }

    if (studyDate.length <= 0) {
      alert("You have not allocated any study time, click a green bar on a date to allocate study time for said date!");
      return false;
    }

    studyDate.sort(function(date1, date2) {
      return date2.date - date1.date;
    });

    return true;
  },
  function() {
    targetHourBlock = parseInt(txtMaxCourseDailyHours.value);
    if (isNaN(targetHourBlock)) {
      alert("Invalid maximum hours spent on single subject!\n(3 hours recommended)");
      return false;
    }

    ExamAllocEntry = [];
    var culTimeUsed = 0;

    for (var i = 0; i < ExamAllocEntryInputs.length; i++) {
      var tempHoursAllocated = parseFloat(ExamAllocEntryInputs[i].txtTimeAllocation.val());
      if ($.trim(ExamAllocEntryInputs[i].txtTimeAllocation.val()) === "") {
        tempHoursAllocated = 0;
      }

      if (isNaN(tempHoursAllocated) || tempHoursAllocated < 0) {
        alert("The course \"" + examDate[i].examName + "\" has an invalid amount of time allocated!");
        return false;
      }

      culTimeUsed += tempHoursAllocated;
      if (culTimeUsed > ExamAllocEntryInputs[i].maxTimeAllocation) {
        alert("The time limit leading up to the course \"" + examDate[i].examName + "\" has been exceeded.\nIf you need more time studying for later courses, take away time from earlier courses!");
        return false;
      }
      ExamAllocEntry.push({examDateIndex:i, hoursAllocated:tempHoursAllocated});
    }

    if (culTimeUsed == 0) {
      alert("You have not allocated any time for your courses, enter the time you want to spend on a course in the \"Hours Allocated\" column!");
      return false;
    }

    if (culTimeUsed < ExamAllocEntryInputs[ExamAllocEntryInputs.length - 1].maxTimeAllocation) {
      if (!confirm('You have not allocated all your study time. To avoid this message, ensure the hours left for the bottom most course is 0. continue?')) {
        return false;
      }
    }

    alert("yay");
    return false;
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
  },
  function() {
    AllocPanelInitialize();
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

/*Changes resultData to contain a study schedule
  requires: all Intermidate calculation variables must be filled in
  effects: WILL corrupt Intermidate calculation variables
           may change resultData */
function GenerateStudyTime() {
  var tempExamAllocationQueueTemp = [];//for exams on dates with
  var tempExamAllocationQueue = [];
}
