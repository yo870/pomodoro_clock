function timemanager () {

	var timevar = {
		"work" : {
			"select" : 25,
			"totalsec" : 1500,
			"setSelector" : document.querySelector("#worktime"),
			"display" : function() {
				if (!!working) {maindisplay(this.totalsec)}; // Takes care of the main display
			}
		},
		"break" : {
			"select" : 5,
			"totalsec" : 300,
			"setSelector" : document.querySelector("#breaktime"),
			"display" : function() {
				if (!!!working) {maindisplay(this.totalsec)}; // Takes care of the main display
			}		
		}
	}
	
	var maintime = { //Selector for the main display items
		"hours" : document.querySelector("#hours"),
		"min" : document.querySelector("#minutes"),
		"sec" : document.querySelector("#seconds"),
	}
	
	var start = 1; // Just to identify the first click so the intro background disappears
	var status = 0; // 0 Timer not working and 1 Timer working
	var working = 1; // To know if we are in Work (1) or Break (0) mode 
	var counter = 0; // To identify the setInterval to clear it

	document.querySelector("#bup").addEventListener("click", function () {timeset(1,"break")}); // 1 is up and 0 id down
	document.querySelector("#bdown").addEventListener("click", function () {timeset(0,"break")});
	document.querySelector("#wup").addEventListener("click", function () {timeset(1,"work")});
	document.querySelector("#wdown").addEventListener("click", function () {timeset(0,"work")});
	
	document.querySelector("button").addEventListener("click", function () {
		if (!!start) {
			document.querySelector("body").style.backgroundImage = "url(img/work.jpg)";
			document.querySelector("#wlength").classList.add("activetime");
			start = 0;
		}
		startstop();
	});

	function timeset (dir,activity) { // Function in charge of setting the times and display the changes to the main display
		if (!!!status) { // Allows to change only if timer stopped 
			if (!!dir) {
				++timevar[activity]["select"];
			} else {
				if (timevar[activity]["select"] > 1) {--timevar[activity]["select"];}
			}
			timevar[activity]["totalsec"] = timevar[activity]["select"] * 60;
			timevar[activity].setSelector.textContent = timevar[activity]["select"];
			timevar[activity]["display"]();
		}
	}

	function startstop () { // Function in charge of running the time - It decreases the time amount in sec then displays it
		status = !!!status ? 1 : 0;
		if (!!status) { // Timer started
			document.querySelector("button").textContent = "Stop!";
			counter = setInterval(function(){ 
				if (!!!timevar.work.totalsec) { // when Work time reaches 0 
					switchtime(0,"work","url(img/break.jpg)");
				} 
				else if (!!!timevar.break.totalsec) { // when Break time reaches 0
					switchtime(1,"break","url(img/work.jpg)");
				}
				else if (!!working) { // if in mode Work (time is not 0)
					--timevar.work.totalsec;
					maindisplay(timevar.work.totalsec);
				} else { // if in mode Break (time is not 0)
					--timevar.break.totalsec;
					maindisplay(timevar.break.totalsec);
				}
			}, 
			1000
			);

		} 
		else { //Timer stopped
		clearInterval(counter);
		document.querySelector("button").textContent = "Start!";
		}

	}

	function maindisplay(timesec) { //Function in charge of taking the total time in sec and distributing it to the main display - Used when set time and when time runs 
		if (Math.trunc(timesec/3600) < 10) {
		maintime.hours.textContent = "0" +Math.trunc(timesec/3600);
		} else {
		maintime.hours.textContent = Math.trunc(timesec/3600);
		}
		if (Math.trunc(timesec/60%60) < 10) {
		maintime.min.textContent = "0" + Math.trunc(timesec/60%60);
		} else {
		maintime.min.textContent = Math.trunc(timesec/60%60);
		}
		if (Math.trunc(timesec%3600%60) < 10) {
		maintime.sec.textContent = "0" + Math.trunc(timesec%3600%60);
		} else {
		maintime.sec.textContent = Math.trunc(timesec%3600%60);
		}
	}

	function switchtime(val,activity,background) { //When w or b times reach 0, play a sound, switches to opposite time, reset time arived to 0 to original value, CSS underlines the corresponding time 
		document.querySelector("#audio").play();
		working = val;
		timevar[activity]["totalsec"] = timevar[activity]["select"] * 60;
		document.querySelector("body").style.backgroundImage = background;
		document.querySelector("#wlength").classList.toggle("activetime");
		document.querySelector("#blength").classList.toggle("activetime");
	}

}