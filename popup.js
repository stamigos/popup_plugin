var jobufo = {
	domain: "//212.24.111.125",
	api: "http://dev.jobufo.com/api",
	token: null,
	headers: null,
	company: jobufo_company,
	vacancy: null,
	video: null,
	role: null,
	last_apply: null,
	vacancy_counter: 0
}

$jobufo(document).ready(function(){

	// FaceBook AUTH SDK
	$jobufo.ajaxSetup({ cache: true });
	$jobufo.getScript('http://connect.facebook.net/en_US/sdk.js', function(){
		FB.init({
			appId: '1686458094968054',
			version: 'v2.5'
		});     
	});



	$jobufo("#jobufo_button").click(function(){
		$jobufo("#jobufo").fadeIn(1000);
		$jobufo("#jobufo_back").fadeIn(1000);

		if (jobufo.token == null)
		jobufoGetVacancy();
	});


	$jobufo("#jobufo_back").click(function(){
		$jobufo("#jobufo").fadeOut(1000);
		$jobufo("#jobufo_back").fadeOut(1000);
	});

	$jobufo("#jobufo .header .close").click(function(){
		$jobufo("#jobufo").fadeOut(1000);
		$jobufo("#jobufo_back").fadeOut(1000);
	});

	$jobufo("#jobufo .sign").click(function(){
		$jobufo("#jobufo .page .step_login").fadeOut("slow", function(){
			$jobufo("#jobufo .page .step_sign").fadeIn("slow");
		});
	});

	$jobufo("#jobufo .go_login").click(function(){
		$jobufo("#jobufo .page .step_sign").fadeOut("slow", function(){
			$jobufo("#jobufo .page .step_login").fadeIn("slow");
		});
	});

	$jobufo("#jobufo .page .step_login input").change(function(){
		var len = $jobufo(this).val().length;

		if (len > 0) $jobufo(this).parent().find("span").addClass("fix");
		else $(this).parent().find("span").removeClass("fix");
	});

	$jobufo("#jobufo .step_login input").keyup(function(event){
		if (event.keyCode == 13) {
			$("#jobufo .step_login .login_button").click();
		}
	});

	function jobufoLogin() {
		var login = $jobufo("#jobufo .step_login .email").val();
		var pass = $jobufo("#jobufo .step_login .pass").val();

		$jobufo.ajax({
			url: jobufo.api + "/auth/login/",
			type: "POST",
			data: {email: login, password: pass},
			success: function(data) {
				console.log(data);
				if (data.key) {
					jobufo.token = data.key;
					jobufo.headers = {
						"Authorization": "Token " + data.key
					}
					// Call After Login
					//if (cb) cb();
					
					//jobufoGetVacancy();
					$jobufo("#jobufo .step_login").fadeOut("slow"); setTimeout(function(){
						$jobufo("#jobufo .step_vacancy").fadeIn("500");
					});

					$jobufo.ajax({
						url: jobufo.api + "/auth/user/",
						type: "GET",
						headers: jobufo.headers,
						success: function(data) {
							console.log(data);
							jobufo.video = data.ufouser.profile_video;
							jobufo.role = data.ufouser.role;

							// APPLY CLICK AFTER LogIN
							if (jobufo.last_apply != null) {
								$jobufo(jobufo.last_apply).click();
								jobufo.last_apply = null;
							}
						}
					});
				}
			}
		});
	}


	function facebookLogin() {
		FB.login(function(response) {
  			if (response.status === 'connected') {
  				var fb_token = response.authResponse.accessToken;
  				console.log(fb_token, response);

  				$jobufo.ajax({
					url: jobufo.api + "/auth/facebook/",
					type: "POST",
					//contentType: "application/json",
					//dataType: "json",
					data: {access_token: fb_token},
					success: function(data) {
						console.log(data);
						if (data.key) {
							jobufo.token = data.key;
							jobufo.headers = {
								"Authorization": "Token " + data.key
							}
						}
					//jobufoGetVacancy();
					$jobufo("#jobufo .step_login").fadeOut("slow"); setTimeout(function(){
						$jobufo("#jobufo .step_vacancy").fadeIn("500");
					});

					$jobufo.ajax({
						url: jobufo.api + "/auth/user/",
						type: "GET",
						headers: jobufo.headers,
						success: function(data) {
							console.log(data);
							jobufo.video = data.ufouser.profile_video;
							jobufo.role = data.ufouser.role;

							// APPLY CLICK AFTER LogIN
							if (jobufo.last_apply != null) {
								$jobufo(jobufo.last_apply).click();
								jobufo.last_apply = null;
							}
						}
					});
					},
					error: function(a,b,c) {
						console.log(a,b,c);
					}
				});
  			}
  		});
	}


	$jobufo("#jobufo .login_button").click(function(){jobufoLogin();});
	$jobufo("#jobufo .step_login .facebook").click(facebookLogin);

	$jobufo("#jobufo .forgot").click(function(){
		var email = $jobufo("#jobufo .step_login .email").val();
		if (email != "") {
			$jobufo.ajax({
				url: jobufo.api + "/auth/password/reset/",
				type: "POST",
				data: {email: email},
				success: function(data) {
					if (data.success) {
						alert(data.success);
					}
				}
			});
		}
		else {
			alert("Enter EMAIL");
		}
	});

	function jobufoGetVacancy() {
		var id = jobufo.company;

		$jobufo.ajax({
			//url: jobufo.api + "/v1/recruiting/company/" + id + "/",
			url: jobufo.api + "/v1/recruiting/vacancy/?company=" + id,
			/*headers: {
				"Authorization": "Token " + jobufo.token
			},*/
			type: "GET",
			success: function(data) {
				console.log(data);
				vacancy = data.vacancy_list;

				$jobufo("#jobufo .menu .loading").hide();
				drawVacancyList(data.top_jobs);
				drawVacancyList(data.normal_jobs);

				// AFTER LOADING -> Open First Vacancy
				$jobufo("#jobufo .menu .item:eq(1)").click();

			}
		});
	}

	function drawVacancyList(vacancy) {
		if (vacancy.length > 0) {
		for(var a = 0; a < vacancy.length; a++) {
			var vac = vacancy[a];

			// GENERATE VACANCY -> MENU
			$jobufo("#jobufo .menu .template").clone().appendTo("#jobufo .menu");
			var menu = $jobufo("#jobufo .menu .template:eq(1)");
			menu.removeClass("template");
			menu.html(vac.title);
			menu.data("id", jobufo.vacancy_counter);
			menu.click(jobufoMenuSelect);

			// PARSE and GENERATE VACANCY -> MEMBERS
			$jobufo("#jobufo .content .members .template").clone().appendTo("#jobufo .content .members");
			var member = $jobufo("#jobufo .content .members .template:eq(1)");
			member.removeClass("template");
			member.attr("data-id", jobufo.vacancy_counter);
			member.find(".name span").html(vac.title);
			member.find(".name date").html(jobufoParseDate(vac.vacancy_start, "/"));
			member.data("apiurl", vac.api_url);

			member.find(".stats .bet span").html(vac.payment);
			member.find(".stats .bet_time span").html(vac.kind);

			// HIDE EMPTY BETS INFO BLOCKS
			if (vac.payment == "") member.find(".stats .bet").hide();
			if (vac.kind == "") member.find(".stats .bet_time").hide();

			var place = (vac.address.street + ". " + vac.address.housenumber + ", " + vac.address.postal_code + " " + vac.address.city.name);
			member.find(".place span").html(place);
			member.find(".place .date").html(jobufoParseDate(vac.created, "/"));
			member.find(".description p").html(vac.description);

			// IMAGES SLIDE BAR
			if (vac.image_list.length > 0) {
				// PARSE AND ADD IMAGES TO SLIDER
				for(var i in vac.image_list) {
					var src = vac.image_list[i].image;
					if (i == 0) {
						member.find(".media .items img").attr("src", src);
						member.find(".media .slides img").attr("class", "select");
					}
					else {
						member.find(".media .items").append("<img src='" + src + "' data-id='" + jobufo.vacancy_counter + "'>");
						member.find(".media .slides").append("<div data-id='" + jobufo.vacancy_counter + "'></div>");
					}
				}

				// PARSE AND ADD VIDEO TO SLIDER
				if (vac.video != null) {
					var vid_img = vac.video.preview_image_list[0].image;
					var vid_url = vac.video.video;
					member.find(".media .items").prepend("<img src='" + vid_img + "' data-id='" + (1000 + jobufo.vacancy_counter) + "'>");
					member.find(".media .items video source").attr("src", vid_url);
					member.find(".media .slides").prepend("<div data-id='" + (1000 + jobufo.vacancy_counter) + "' data-video='true'></div>");
				}

				// SLIDER CIRCLES FUNCTIONS
				member.find(".media .slides div").click(function(){
					var id = $jobufo(this).data("id");
					var parent = $jobufo(this).parent().parent().parent();
					var img = parent.find(".media .items img[data-id=" + id + "]");

					parent.find(".media .slides div").removeClass("select");
					$jobufo(this).addClass("select");

					parent.find(".media .items img").fadeOut(500);
					setTimeout(function(){
						img.fadeIn("slow");
					}, 500);


					// CHECKOUT -> VIDEO / NOT -> PLAY SHOW / NOT
					if ( $jobufo(this).data("video") == "true" || $jobufo(this).data("video") == true) {
						parent.find(".media .play").fadeIn(500);
						parent.find(".media .dark").fadeIn(500);
					}
					else {
						parent.find(".media .play").hide();
						parent.find(".media .dark").hide();
					}

				});

				member.find(".media .slides div:eq(0)").click();
			}


			// PLAY BUTTON FUNCTOIONS
			member.find(".media .play").click(function(){
				var member = $jobufo(this).parent().parent();
				member.find(".media .items img").fadeOut(500);
				member.find(".media .play").fadeOut(500);
				member.find(".media .slide_buttons").hide();
				member.find(".media .dark").fadeOut(500, function(){
					member.find(".media video").fadeIn("fast");
					member.find(".media video").get(0).play();
					member.find(".slides").fadeOut("fast");
				});

				member.find(".media video").bind("ended", function(){
					member.find(".media video").fadeOut("fast", function(){
						var id = member.find(".media .slides div[class=select]").data("id");
						member.find(".media .items img[data-id=" + id + "]").fadeIn("fast");
						member.find(".media .play").fadeIn("fast");
						member.find(".slides").fadeIn("fast");
						member.find(".media .slide_buttons").show();
					});
				});	
			});


			// LEFT SLIDER OF IMAGES
			member.find(".media .slide_left").click(function(){
				var first = $jobufo(this).parent().find(".slides div:first");
				var last = $jobufo(this).parent().find(".slides div:last");
				var selected = $jobufo(this).parent().find(".slides .select");

				var index = selected.index();
				var new_index;
				if (index == 0) {new_index = last.index();}
				else {new_index = 0;}
				
				$jobufo(this).parent().find(".slides div:eq(" + new_index + ")").click();
			});

			// RIGHT SLIDER OF IMAGES
			member.find(".media .slide_right").click(function(){
				var last = $jobufo(this).parent().find(".slides div:last");
				var selected = $jobufo(this).parent().find(".slides .select");

				var index = selected.index();
				var new_index;
				if (index < last.index()) {new_index = index + 1;}
				else {new_index = 0;}

				$jobufo(this).parent().find(".slides div:eq(" + new_index + ")").click();
			});

			// IF NOT HAVE VIDEO -> HIDE PLAY BUTTON
			if (vac.video == null) member.find(".media .play").hide();
			jobufo.vacancy_counter = jobufo.vacancy_counter + 1;

		}
		} // END IF > 0
	}


	$jobufo("#jobufo .page .apply").click(function(){
		// IF LOGGED -> Not First APPLY
		if (jobufo.token != null) {
			var video = null;
			if (jobufo.video != null) video = jobufo.video.video;
			var id = $jobufo("#jobufo .menu .item[class='item select']").data("id");
			var api_url = $jobufo("#jobufo .members .member[data-id=" + id + "]").data("apiurl");

			// RESET DEFAULT
			$jobufo("#jobufo .content .apply .block .not_video").hide();
			$jobufo("#jobufo .content .apply .block .not_allow").hide();

			// ERROR OF ALLOW ![APPLICANT]
			if (jobufo.role != "APPLICANT") {
				$jobufo("#jobufo .content .apply .block").show();
				$jobufo("#jobufo .content .apply .block .not_allow").show().css('display','inline-block');
			}

			if (video != null && jobufo.role == "APPLICANT") {
				$jobufo.ajax({
					url: jobufo.api + "/v1/recruiting/application/",
					type: "POST",
					data: {vacancy: api_url, video: video},
					headers: jobufo.headers,
					success: function(data) {
						console.log(data);
						$jobufo("#jobufo .step").fadeOut(500);
						setTimeout(function(){
							$jobufo("#jobufo .step_apply").fadeIn("slow");
						}, 500);
					}
				});
			}
			if (video == null) {
				$jobufo("#jobufo .content .apply .block").show();
				$jobufo("#jobufo .content .apply .block .not_video").show().css('display','inline-block');
			}
		}
		//IF NOT LOGGED -> First APPLY
		else {
			jobufo.last_apply = $jobufo(this);
			$jobufo("#jobufo .step_vacancy").fadeOut(500);
			setTimeout(function(){
				$jobufo("#jobufo .step_login").fadeIn(500);
			}, 500);
			
		}
	});

	$jobufo("#jobufo .step_apply .more").click(function(){
		$jobufo("#jobufo .step_apply").fadeOut(500);
		setTimeout(function(){$jobufo("#jobufo .step_vacancy").fadeIn(500);}, 500);
	});


	function jobufoMenuSelect() {
		$jobufo("#jobufo .menu .select").removeClass("select");
		$jobufo(this).addClass("select");

		var id = $jobufo(this).data("id");
		$jobufo("#jobufo .apply").show();
		$jobufo("#jobufo .apply").data("id", id);

		$jobufo("#jobufo .members .member").fadeOut(500);
		setTimeout(function(){
			$jobufo("#jobufo .members .member[data-id="+id+"]").fadeIn(500);
		});
	}

	function jobufoParseDate(input, sumbol) {
		var input = input.substr(0, 10);
		var day = input.substr(8, 2);
		var mounth = input.substr(5, 2);
		var year = input.substr(0, 4);

		var output = day+ sumbol +mounth+ sumbol +year;
		return output;
	}


});