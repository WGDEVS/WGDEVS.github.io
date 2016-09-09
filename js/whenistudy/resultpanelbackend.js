var RESULT_PANEL =  document.getElementById("resultPanel");
var randomColorList = ['#cd7f32', 'red', 'orange', 'indigo', 'gold', '#007fff', 'green', 'blue', 'violet'];


/* Add a course/study slot to Calendar, where Time is the time that the event occurs, Title is the title of the event and Color is the color in hex
   requires: Calendar must be set to the month/year containing time
   effects: May change BackgroundCalendar
*/
function AddCourseToCalendar(Title, isStudySlot, Time, Calendar,Color) {
  Calendar.fullCalendar( 'renderEvent',
  {
    title : Title,
    start: Time,
    inputTime : isStudySlot,
    calendar : Calendar,
    backgroundColor : Color
  });
}


function ResultPanelInitalize() {
  var curCalendar;
  var curCalDate;
  var courseColors = [];

  for (var i = 0; i <= resultData.examDates.length; i++){
    courseColors.push((resultData.currentDate.getDay() + i) % randomColorList.length);
  }

  for (var i=0, j=0; i < resultData.examDates.length || j < resultData.studyDates.length;) {
    if (j < resultData.studyDates.length && resultData.studyDates[j].date <= resultData.examDates[i].examTime) {
      if (curCalendar == null ||
        resultData.studyDates[j].date.getMonth() != curCalDate.getMonth() ||
        resultData.studyDates[j].date.getYear() != curCalDate.getYear()) {
          curCalDate = resultData.studyDates[j].date;
          curCalendar = ResultPanelNewCalendar(resultData.studyDates[j].date);
      }

      for (var key in resultData.studyDates[j]) {
        if (resultData.studyDates[j].hasOwnProperty(key) && key !== "date") {
          AddCourseToCalendar(resultData.examDates[parseInt(key)].examName + " " + (resultData.studyDates[j][key]).toFixed(10).replace(/0+$/, "").replace(/\.$/,"") + " h", true, resultData.studyDates[j].date, curCalendar, randomColorList[courseColors[parseInt(key)]]);
        }
      }
      j++;
    } else {
      if (curCalendar == null ||
        resultData.examDates[i].examTime.getMonth() != curCalDate.getMonth() ||
        resultData.examDates[i].examTime.getYear() != curCalDate.getYear()) {
          curCalDate = resultData.examDates[i].examTime;
          curCalendar = ResultPanelNewCalendar(resultData.examDates[i].examTime);
      }
      AddCourseToCalendar(resultData.examDates[i].examName, false, resultData.examDates[i].examTime, curCalendar, randomColorList[courseColors[i]]);

      i++;
    }
  }
}

/*Adds a new calendar to the Result Panel, showing the same month as day and returns the new calendar
  effects: may change properties of panels */
function ResultPanelNewCalendar(date) {
  var cal = $("<div></div>");
  cal.css('margin-top', '20px');
  cal.appendTo(RESULT_PANEL);
  cal.fullCalendar({
    editable: true,
    eventLimit: false, // allow "more" link when too many events
  header: {
      left: '',
      center: 'title',
      right: ''
  },
  now: currentDate,

  eventRender: function(event, element) {
    if (!event.inputTime) {
      return;
    }

    //hide the start time if it is not an exam date
    element.find('.fc-time').remove();
  }

  });
  cal.fullCalendar( 'gotoDate', date);

  return cal;
}

function printDiv() {
    var contents = RESULT_PANEL.innerHTML;
    var frame1 = document.createElement('iframe');
    frame1.name = "frame1";
    frame1.style.position = "absolute";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write('<html><head><title>WhenIStudy study schedule</title>');

    frameDoc.document.write('<link type="text/css" href="css/bootstrap.min.css" rel="stylesheet">');
    frameDoc.document.write('<link href="css/ie10-viewport-bug-workaround.css" rel="stylesheet">');

    frameDoc.document.write("<link href='css/fullcalendar.css' rel='stylesheet' />");
    frameDoc.document.write("<link href='css/fullcalendar.print.css' rel='stylesheet' media='print' />");

    frameDoc.document.write('<link rel="stylesheet" href="css/main.css">');
    frameDoc.document.write('<link rel="stylesheet" href="css/whenistudyfrontend.css">');

    frameDoc.document.write("<style>.btn {display:none;} .bigTitle{display:none;}</style>");

    frameDoc.document.write('</head><body>');
    frameDoc.document.write(contents);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        document.body.removeChild(frame1);
    }, 500);
    return false;
}

function saveToCookie() {
  if (document.cookie != null && document.cookie != "") {
    if (!confirm("Saving will wipe study schedule currently stored in browser, continue?")) {
      return;
    }
  }

  $.cookie('resultData', JSON.stringify(resultData));

  if ($.cookie('resultData') == null || ($.cookie('resultData') == "")) {
    alert("Study schedule NOT saved in browser, this happens in chrome, try saving to File.")
  } else {
    alert("Study schedule saved in browser!");
  }
}

function reset() {
  if (confirm("Starting a new study schedule will wipe the current study schedule, make sure to save first, continue?")) {
    window.location.reload(false);
  }
}

function saveToFile() {
  download(JSON.stringify(resultData), "WHENISTUDY-schedule-"+ String(Date.now()) +".dat");
}

function download(strData, strFileName, strMimeType) {
var D = document,
    A = arguments,
    a = D.createElement("a"),
    d = A[0],
    n = A[1],
    t = A[2] || "text/plain";

//build download link:
a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


if (window.MSBlobBuilder) { // IE10
    var bb = new MSBlobBuilder();
    bb.append(strData);
    return navigator.msSaveBlob(bb, strFileName);
} /* end if(window.MSBlobBuilder) */



if ('download' in a) { //FF20, CH19
    a.setAttribute("download", n);
    a.innerHTML = "downloading...";
    D.body.appendChild(a);
    setTimeout(function() {
        var e = D.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        D.body.removeChild(a);
    }, 66);
    return true;
}; /* end if('download' in a) */



//do iframe dataURL download: (older W3)
var f = D.createElement("iframe");
D.body.appendChild(f);
f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
setTimeout(function() {
    D.body.removeChild(f);
}, 333);
return true;
}
