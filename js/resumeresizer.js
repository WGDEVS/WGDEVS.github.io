var resumeCanvas = document.getElementById("resumeCanvas");

function resizeResume() {
  resumeCanvas.height = $( window ).height() - resumeCanvas.offsetTop * 1.1;
}
