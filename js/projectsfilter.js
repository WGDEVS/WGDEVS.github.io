var navAll = document.getElementById("navAll");
var navAndroid = document.getElementById("navAndroid");
var navPython = document.getElementById("navPython");
var navCSharp = document.getElementById("navCSharp");

var androidPanel = document.getElementById("androidPanel");
var pythonPanel = document.getElementById("pythonPanel");
var csharpPanel = document.getElementById("csharpPanel");

function filterAll() {
    navAll.className = "active";

    androidPanel.style.display = "block";
    pythonPanel.style.display = "block";
    csharpPanel.style.display = "block";
}

function filterAndroid() {
    navAndroid.className = "active";

    androidPanel.style.display = "block";
    pythonPanel.style.display = "none";
    csharpPanel.style.display = "none";
}

function filterPython() {
    navPython.className = "active";

    androidPanel.style.display = "none";
    pythonPanel.style.display = "block";
    csharpPanel.style.display = "none";
}

function filterCSharp() {
    navCSharp.className = "active";

    androidPanel.style.display = "none";
    pythonPanel.style.display = "none";
    csharpPanel.style.display = "block";
}

function init() {
	switch (window.location.href.toString().split("?li=")[1].split("&")[0]){
		case "Android":
			filterAndroid();
			break;
		case "Python":
			filterPython();
			break;
		case "CSharp":
			filterCSharp();
			break;
		default:
			filterAll();
			break;
	}

}

window.onload = function() {
	init();
}
