//requires: a variable of the ExamEntry class named examDateInputs

/*SECTION: LOCAL CONSTANTS*/
var UW_API_KEY = "2f59b1e394c14c779991838db3f2865f";

var API_CONNECT_FAIL = "Cannot connect using api, ensure that input is in correct format (eg Subject:\"ECON\" Course Number:\"101\"), if problem persists, manually enter the date.";

var MSG_EXAM_ENTRY_INPORT_FAIL = "API returned no data, exam schedule is not out yet.";

var EXAM_PANEL =  document.getElementById("examPanel");

/*SECTION: ExamEntry class */
class ExamEntry {
  /*
  class variables:
  div
  above
  below
  txtSubject
  txtCode
  txtDate
  */

  /*Creates a new ExamEntry, adding it to the exam panel, above and below are
    used to indicate which other ExamEntrys are above or below it, null is used
    to indicate no ExamEntry above or below
    requires: above and below must be valid ExamEntrys or null
    effects: may change properties of panels*/
  constructor(above,below) {
    var self = this;

    this.above = above;
    this.below = below;
    this.div = $("<div></div>");
    this.div.addClass("padded-item");

    var btnAdd = $("<button></button>");
    btnAdd.on("click", function(){ ExamEntryAddBelow(self);});
    btnAdd.addClass("btn btn-primary");
      var iconPlus = $("<i></i>");
      iconPlus.addClass("fa fa-chevron-down");
      btnAdd.append(iconPlus);
    this.div.append(btnAdd);

    var btnDelete = $("<button></button>");
    btnDelete.addClass("btn btn-primary left-padded-item");
    btnDelete.on("click", function(){ ExamEntryDelete(self);});
      var iconMinus = $("<i></i>");
      iconMinus.addClass("fa fa-minus");
      btnDelete.append(iconMinus);
    this.div.append(btnDelete);

    var lblSubject = $("<h5></h5>");
    lblSubject.text("Subject:");
    this.div.append(lblSubject);

    this.txtSubject = $("<input></input>");
    this.txtSubject.attr('type', 'text');
    this.txtSubject.attr('size', '4');
    this.div.append(this.txtSubject);

    var lblCode = $("<h5></h5>");
    lblCode.text("Course Number:");
    this.div.append(lblCode);

    this.txtCode = $("<input></input>");
    this.txtCode.attr('type', 'text');
    this.txtCode.attr('size', '4');
    this.div.append(this.txtCode);

    var btnInport = $("<button></button>");
    btnInport.addClass("btn btn-primary padded-button");
    btnInport.on("click", function(){ ExamEntryInport(self);});
      var iconInternet = $("<i></i>");
      iconInternet.addClass("fa fa-internet-explorer");
      btnInport.append(iconInternet);

      var iconRight = $("<i></i>");
      iconRight.addClass("fa fa-arrow-right");
      btnInport.append(iconRight);
    this.div.append(btnInport);

    var lblDate = $("<h5></h5>");
    lblDate.text("Final exam/project due:");
    this.div.append(lblDate);

    this.txtDate = $("<input></input>");
    this.txtDate.attr('type', 'text');
    this.txtDate.attr('size', '15');
    this.txtDate.appendDtpicker();
    self.txtDate.val("");
    this.div.append(this.txtDate);

    if (this.above != null) {
      this.div.insertAfter(this.above.div);
    } else {
      this.div.appendTo(EXAM_PANEL);
    }
  }
}

/*SECTION: Functions for ExamEntry Class*/

/*Creates a new ExamEntry, adding it to the exam panel below self
  requires: self must be a valid ExamEntry
  effects: may change properties of panels*/
function ExamEntryAddBelow(self) {
  self.below = new ExamEntry(self,self.below);
}

/*Deletes self, removing it from the exam panel, and adds a new
  ExamEntry to the exam panel if the function leaves the exam planel empty
  requires: self must be a valid ExamEntry
  effects: may change properties of panels
           self is no longer valid*/
function ExamEntryDelete(self) {
  if (self.above != null) {
    self.above.below = self.below;
  } else {
     examDateInputs = self.below;
     if (examDateInputs == null) {
       examDateInputs = new ExamEntry();
     }
  }
  if (self.below != null) {
    self.below.above = self.above;
  }
  self.div.remove();
}

/*Attempts to automatically import data from the UWaterloo api, filling in the
  start date of self, and displays MSG_EXAM_ENTRY_INPORT_FAIL to the user if it fails
  requires: self must be a valid ExamEntry
  effects: may change properties of panels
           may display prompts to user*/
function ExamEntryInport(self) {
  var i = "https://api.uwaterloo.ca/v2/courses/" + self.txtSubject.val() + "/"
  + self.txtCode.val() + "/examschedule.json?key=" + UW_API_KEY;

  $.getJSON(i,
    function(data) {
      try {
        self.txtDate.val(data.data.sections[0].date + " " + ExamEntryConvert12Hto24H(data.data.sections[0].start_time));
        self.txtDate.trigger('keyup');
      }
      catch(err) {
        alert(MSG_EXAM_ENTRY_INPORT_FAIL);
      }
    })
    .fail(function() { alert(API_CONNECT_FAIL); });
}

/*Returns a string representation of strTime in 24h format (ie 23:00)
  requries: strTime must be in 12h format (ie 11:30 PM)*/
function ExamEntryConvert12Hto24H(strTime) {
  var hours = Number(strTime.match(/^(\d+)/)[1]);
  var minutes = Number(strTime.match(/:(\d+)/)[1]);
  var AMPM = strTime.match(/\s(.*)$/)[1];
  if(AMPM == "PM" && hours<12) hours = hours+12;
  if(AMPM == "AM" && hours==12) hours = hours-12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if(hours<10) sHours = "0" + sHours;
  if(minutes<10) sMinutes = "0" + sMinutes;
  return (sHours + ":" + sMinutes);
}
