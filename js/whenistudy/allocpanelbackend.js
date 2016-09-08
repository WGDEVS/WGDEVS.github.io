//requires: a variable of the ExamEntry class named examDateInputs

/*SECTION: LOCAL CONSTANTS*/
var ALLOC_PANEL =  document.getElementById("allocPanel");
var allocMainTable = document.getElementById("allocMainTable");

/*SECTION: ExamAllocEntry class */
class ExamAllocEntry {
  /*
  class variables:
  maxTimeAllocation
  lblTimeLeft
  txtTimeAllocation

  all times in hours
  */

  /*Creates a new ExamAllocEntry, adding it to allocMainTable
    effects: may change properties of panels*/
  constructor(examName, maxTimeAllocation) {
    var self = this;

    self.maxTimeAllocation = maxTimeAllocation;

    var tr = $("<tr></tr>");
    tr.addClass("expand alloctr");

    var tdExamName = $("<td></td>");
    tdExamName.addClass("expand alloctd");
    tdExamName.text(examName);
    tr.append(tdExamName);

    var tdTimeAllocation = $("<td></td>");
    tdTimeAllocation.addClass("alloctd");
      self.txtTimeAllocation = $("<input></input>");
      self.txtTimeAllocation.attr('type', 'text');
      self.txtTimeAllocation.attr('size', '4');
      self.txtTimeAllocation.keydown(ExamAllocEntryChanged);
      self.txtTimeAllocation.on('input', ExamAllocEntryChanged);

      var tdTimeAllocationCenterContainer = $("<center></center>");
      tdTimeAllocationCenterContainer.append(self.txtTimeAllocation);
      tdTimeAllocation.append(tdTimeAllocationCenterContainer);
    tr.append(tdTimeAllocation);

    var tdTimeLeft = $("<td></td>");
    tdTimeLeft.addClass("alloctd");
      var trTimeLeftStrongContainer = $("<strong></strong>");

      self.lblTimeLeft = $("<span></span>");
      self.lblTimeLeft.appendTo(trTimeLeftStrongContainer);

      trTimeLeftStrongContainer.append("/" + String(maxTimeAllocation));
      var trTimeLeftCenterContainer = $("<center></center>");
      trTimeLeftCenterContainer.append(trTimeLeftStrongContainer);
      tdTimeLeft.append(trTimeLeftCenterContainer);
    tr.append(tdTimeLeft);

    tr.appendTo(allocMainTable);

    this.updateTimeLeft(0);
  }

  updateTimeLeft(timeUsed) {
    this.lblTimeLeft.text(String(this.maxTimeAllocation - timeUsed));

    if (isNaN(timeUsed) || timeUsed > this.maxTimeAllocation || timeUsed < 0) {
      this.lblTimeLeft.attr('style', 'color:red');
    } else {
      this.lblTimeLeft.attr('style', 'color:green');
    }
  }
}

/*Updates the elements of ExamAllocEntryInputs to reflect the changes in txtTimeAllocation
  requires: ExamAllocEntryInputs must be populated
  effects: may make changes to elements of ExamAllocEntryInputs*/
function ExamAllocEntryChanged() {
  var culTimeUsed = 0;
  for (var i = 0; i < ExamAllocEntryInputs.length; i++) {
    if ($.trim(ExamAllocEntryInputs[i].txtTimeAllocation.val()) != "") {
      culTimeUsed += parseFloat(ExamAllocEntryInputs[i].txtTimeAllocation.val());
    }
    ExamAllocEntryInputs[i].updateTimeLeft(culTimeUsed);
  }
}



//Set up the allocMainTable
function AllocPanelInitialize() {
  ExamAllocEntryInputs = [];
  var examDateIndex = 0;
  var culmulativeTimeLeft = 0;

  for (var i = 0; i < studyDate.length; i++) {
    while(studyDate[i].date > examDate[examDateIndex].examTime) {
      ExamAllocEntryInputs.push(new ExamAllocEntry(examDate[examDateIndex].examName, culmulativeTimeLeft));
      examDateIndex += 1;
    }
    culmulativeTimeLeft += studyDate[i].hours;
  }
  while(examDateIndex < examDate.length) {
    ExamAllocEntryInputs.push(new ExamAllocEntry(examDate[examDateIndex].examName, culmulativeTimeLeft));
    examDateIndex += 1;
  }
}
