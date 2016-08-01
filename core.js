function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}

document.addEventListener('DOMContentLoaded', function() {
	var html = "<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script>";
	appendHtml(document.body, html);
});

var $jobufo = $.noConflict(true);

$jobufo(document).ready(function(){

	var require = {
		domain: "http://212.24.111.125/",
		html: "popup.php",
		css: "popup.css",
		js: "popup.js",
		button: "img/main_button_nobg.gif"
	}
	var link_html = require.domain + require.html;
	var link_css = require.domain + require.css;
	var link_js = require.domain + require.js;
	var link_button = require.domain + require.button;

	// LOAD RESOURCES
	$jobufo(document.body).append("<link href='" +link_css+ "' rel='stylesheet'>");
	$jobufo(document.body).append("<div id='jobufo_back'></div>");
	$jobufo(document.body).append("<div id='jobufo' style='display: none;'></div>");
	$jobufo(document.body).append("<div id='jobufo_button' src='" +link_button+ "'></div>");

	$jobufo("#jobufo").data("domain", require.domain);
	$jobufo("#jobufo").load(link_html, function(){
		// LOAD FIRST HTML, AFTER - JS
		$jobufo(document.body).append("<script src='" +link_js+ "'>");
	});
	
});