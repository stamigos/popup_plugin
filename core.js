function includejQuery(callback) {
        // jQuery not loaded, load it and when it loads call
        // noConflict and the callback (if any).
        var script = document.createElement('script');
        script.onload = function() {
            if (callback) {
                callback(jQuery);
            }
        };
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js";
        document.getElementsByTagName('body')[0].appendChild(script);
}

var $jobufo = null;
var $ = null;
if(window.jQuery) {
	$ = jQuery.noConflict(true);
}
document.addEventListener('DOMContentLoaded', function() {
    if(window.jQuery) {
        // jQuery is already loaded
        $ = jQuery.noConflict(true);
    }
    includejQuery(function($){
        $jobufo = $.noConflict(true);

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

    });

});