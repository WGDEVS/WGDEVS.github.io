var AVAIL_PANEL =  document.getElementById("availPanel");
var MIN_HOURS_IN_DAY = 0;
var MAX_HOURS_IN_DAY = 24;

function AvailPanelInitalize() {

  var i = new Date(currentDate.getTime());

  i.setHours(0,0,0,0);

  currentEventIndex = 0;
  var first = true;

  for (; i.getTime() <= examDate[examDate.length - 1].examTime.getTime(); i.setDate(i.getDate() + 1)){
    if (i.getDate() <= 1 || first) {
      studyCalendars.splice(0, 0, AvailPanelNewCalendar(i));
    }
    first = false;

    studyCalendars[0].fullCalendar( 'renderEvent',
    {
      title : '0 h',
      start: i,
      inputTime : true,
      hours : 0,
      calendar : studyCalendars[0],
      backgroundColor : 'green',
      timeFormat: ''
    });


    while(currentEventIndex < examDate.length &&
      i.getDate() == examDate[currentEventIndex].examTime.getDate() &&
      i.getMonth() == examDate[currentEventIndex].examTime.getMonth() &&
      i.getFullYear() == examDate[currentEventIndex].examTime.getFullYear()) {
        studyCalendars[0].fullCalendar( 'renderEvent',
        {
          title : examDate[currentEventIndex].examName,
          start: examDate[currentEventIndex].examTime,
          inputTime : false,
          calendar : studyCalendars[0]
        });
        currentEventIndex ++;
      }
  }

}

/*returns a boolean representing if strInput is a vaid number of hours in a day*/
function IsValidHours(strInput) {
  return !isNaN(strInput) && strInput >= MIN_HOURS_IN_DAY && strInput <= MAX_HOURS_IN_DAY;
}

/*Adds a new calendar to the Avail Panel, showing the same month as day and returns the new calendar
  effects: may change properties of panels */
function AvailPanelNewCalendar(date) {
  var cal = $("<div></div>");
  cal.css('margin-top', '20px');
  cal.appendTo(AVAIL_PANEL);
  cal.fullCalendar({
    editable: true,
    eventLimit: false, // allow "more" link when too many events
    eventClick: function(event) {
      if (!event.inputTime) {
        return false;
      }

      var target = $(this).find("span");

      var newDiv = $("<div></div>");

      var txtHours = $("<input></input>");
      txtHours.attr('type', 'text');
      txtHours.addClass('fc-event');
      txtHours.val(event.title.slice(0, -2));
      txtHours.css('background-color', 'white');
      txtHours.css('color', 'black');
      txtHours.css('display', 'inline');
      txtHours.attr('size', '1');
      newDiv.append(txtHours);

      var lblH = $("<p></p>");
      lblH.text(" h");
      lblH.css('display', 'inline');
      newDiv.append(lblH);

      target.replaceWith(newDiv);

      txtHours.select();

      txtHours.on('blur',function () {
        if (txtHours.val().trim() === "") {
          event.hours = 0;
          event.title = "0 h";
        } else {
          event.hours = parseFloat(txtHours.val());
          event.title = txtHours.val()  + " h";
        }
        event.backgroundColor = IsValidHours(event.hours) ? 'green' : 'red';
        event.calendar.fullCalendar( 'rerenderEvents' );
      });

      return false;
    },
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

    element.find('.fc-time').remove();
  }

  });
  cal.fullCalendar( 'gotoDate', date);

  return cal;
}
