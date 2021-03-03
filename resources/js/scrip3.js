$(document).ready(function(){
  var timeQuotes = ["The two most powerful warriors are patience and time.","Time is money.","Time waits for no one.","Better three hours too soon than a minute late.","Lost time is never found again.","Time is the most valuable thing a man can spend.","Time is the wisest counselor of all.","The key is in not spending time, but in investing it.","Punctuality is the thief of time.","Time is free, but it's priceless. You can't own it, but you can use it.","Time is a storm in which we are all lost.","Regret for wasted time is more wasted Time.","Time is what we want most, but what we use worst.","It's clear that the most precious resource we all have is time.","Never leave 'till tomorrow which you can do today."];
  var audioSources = ["Alarm-ringtone.mp3" , "Analog_watch.mp3" , "Loud_alarm.mp3" , "Massive_war.mp3" , "Missile_alert.mp3" , "Siren_alarm.mp3"];
  var mode = "alarm";
  var tone = new Audio("resources/mp3/Alarm-ringtone.mp3");
  var focusTone = new Audio("resources/mp3/Bell-chime-1.mp3");
  var restTone = new Audio("resources/mp3/Bell-chime-2.mp3");
  var longRestTone = new Audio("resources/mp3/Bell-chime-3.mp3");
  var pomodoroEndTone = new Audio("resources/mp3/airplane-dual.mp3");
  var alarm_on = false;
  var pomodoro_on = false;
  var phase = 0;
  var flag;
  var pomodoro_time_start;
  var focusInMs;
  var restInMs;
  var lap;


//--------------------Webpage Onload SetUp
  hideShow("#set_Pomodoro","#set_Alarm");
  hideShow("#start_Pomodoro","#set_Alarm");
  hideShow("#stop_Pomodoro","#stop_Alarm");
  hideShow("#cancel_PomodoroSettings","#stop_Alarm");
  hideShow("#pause_Pomodoro","switch_mode");
  var currentTimeComputation = setInterval(updateTime, 10);
  var timeInputUpdate = setInterval(getAlarmInfo, 10);
  changeQuote();

// ------------------------ALARM BUTTON FUNCTION--------------------------------
//-------ALARM BUTTONS FUNC
$("#set_Alarm").click(function(){
  $("#alarm-menu").fadeIn();
  darkenBG();
});
$("#stop_Alarm").click(function(){
  alarm_on = false;
  $(".current-alarm-box").fadeOut();
});

//--------ALARM TONE SELECT
$("#audio-select").on("change",function(){
  var currentToneValue = this.value;
  switch (currentToneValue) {
    case "1":
      setTone(audioSources[0]);
      break;
    case "2":
      setTone(audioSources[1]);
      break;
    case "3":
      setTone(audioSources[2]);
      break;
    case "4":
      setTone(audioSources[3]);
      break;
    default:
  }
});

//-----ALARM POP UP MENU BUTTONS
$("#btn-test").click(function(){
  ringAlarm(".test-box");
});
$(".close-btn").click(function(){
  if(alarm_on == false){
    hideShowFade(".test-box","#alarm-menu");
  }
  $(".current-alarm-box").fadeOut();
  stopRingAlarm(".test-box");
  alarm_on = false;
});
$("#btn-cancel").click(function(){
  $("#alarm-menu").fadeOut();
  lightenBG();
});
$("#btn-start").click(function(){
  alarm_on = true;
  $("#alarm-menu").fadeOut();
  lightenBG();
});



// ------------------------POMODORO BUTTON FUNCTION--------------------------------

//---STAGE INDICATORS ON click
$(".stage-indicators-items").click(function(){
  $(this).css("border","1px solid white");
  $(this).siblings().css("border","none");
  var index = $(".stage-indicators-items").index(this);
});



//----POMODORO BUTTON FUNCTION

$("#set_Pomodoro").click(function(){
  hideShow(this,"#start_Pomodoro");
  $(".pomodoro-menu").slideDown();
});
$("#start_Pomodoro").click(function(){
  if(pomodoro_on){
      clearInterval(lap);
  }
  var focusTime = $("#Focus-time-select option:selected").val();
  var restTime = $("#ShortRest-time-select option:selected").val();
  var longRestTime = $("#LongRest-time-select option:selected").val();
  pomodoro_on = true;
  hideShow(this,"#set_Pomodoro");
  $(".pomodoro-menu").slideUp();

  startPomodoro(focusTime,restTime,longRestTime,1);
});

$("#stop_Pomodoro").click(function(){
  pomodoro_on = false;
});


// -----------------------OTHER BUTTON FUNC------------------------------------
//----------mode switch button
$("#switch_mode").click(function(){
  if(mode == "alarm"){
    $(this).html("Alarm Mode");
    hideShow(".alarm-content-wrapper",".pomodoro-content-wrapper");
    hideShow("#set_Alarm","#set_Pomodoro");
    hideShow("#stop_Alarm","#stop_Pomodoro");
    alarm_on = false;
    $(".current-alarm-box").fadeOut();
    mode = "pomodoro";
  }
  else{
    $(this).html("Pomodoro");
    hideShow(".pomodoro-content-wrapper",".alarm-content-wrapper");
    hideShow("#set_Pomodoro","#set_Alarm");
    hideShow("#stop_Pomodoro","#stop_Alarm");
    mode = "alarm";
  }
});

//---------Cross Icon Function
$(".icon").click(function(){
    $(".menu-header").parent().fadeOut();
    lightenBG();
});


//--------------------------------FUNCTION SECTION-------------------------------

// QUOTE FADEIN FADE OUT
function changeQuote(){
  if(mode=="alarm"){
    setInterval(function () {
    $(".greeting i").fadeOut(5500, function () {
        var random = Math.round(14*Math.random());
        $(this).html('<span class="quote-marks">"</span>'+ timeQuotes[random] +'<span class="quote-marks">"</ span>').fadeIn(2500);
      });
    }, 4000);
  }

}

//----------------------------TIME RELATED FUNCTION-------------------------------------------

//-----start pomodoro or alarm
function startPomodoro(f,r,lr){
  var fKeeper = f;
  var rKeeper = r;
  var lrKeeper = lr;
  var loop = 1;
  $("#focus-time").hide();
  $("#long-rest-time").hide();
  lap = setInterval(function(){
    if(f != 0){
      f = countDown(f);
      $("#focus-countdown-box").text(formatThis(millisToMinutes(f))+":"+formatTime(millisToSeconds(f)));
    }
    else if(f == 0 && loop == 4){
      longRestTone.play();
      setTimeout(function(){
        longRestTone.pause();
        longRestTone.currentTime = 0;
      },2000);
      if(lr != 0){
        lr = countDown(lr);
        $("#long-rest-countdown-box").text(formatThis(millisToMinutes(lr))+":"+formatTime(millisToSeconds(lr)));
      }
      else if(lr == 0){
        pomodoroEndTone.play();
        setTimeout(function(){
          pomodoroEndTone.pause();
          pomodoroEndTone.currentTime = 0;
        },2000);
        $("#long-rest-countdown-box").text(formatThis(millisToMinutes(lr))+":"+formatTime(millisToSeconds(lr)));
        clearInterval(lap);
        pomodoro_on = false;
      }

    }
    else if(f == 0 && loop != 4){
      restTone.play();
      setTimeout(function(){
        restTone.pause();
        restTone.currentTime = 0;
      },2000);


      if(r != 0){
        r = countDown(r);
        $("#short-rest-countdown-box").text(formatThis(millisToMinutes(r))+":"+formatTime(millisToSeconds(r)));

      }
      else{
          focusTone.play();
          setTimeout(function(){
            focusTone.pause();
            focusTone.currentTime = 0;
          },2000);
          f = fKeeper;
          r = rKeeper;
          $("#focus-countdown-box").text(formatThis(millisToMinutes(f))+":"+formatTime(millisToSeconds(f)));
          $("#short-rest-countdown-box").text(formatThis(millisToMinutes(r))+":"+formatTime(millisToSeconds(r)));
          loop++;
      }
    }
  },1000);
}
function startAlarm(h,m){
  var d = new Date();
  var currentH = formatHour(d.getHours());
  var currentM = formatTime(d.getMinutes());
  if(h ==  currentH && m == currentM){
    ringAlarm(".test-box");
  }

  $(".current-alarm-box").fadeIn();

}

//-----Time format display
function formatThis(ms){
  if(ms == 0|| ms < 10){
    ms = "0" + ms;
  }
  return ms;
}
function formatTime(i){
    if(i<10){
      i = "0" + i;
    }
    return i;
  }
function formatHour(i){
    if(i > 12){
      i = i - 12;
    }
    else if(i == 0){
      i = i + 12;
    }
    return i;
  }
function formatAMPM(hours){
    var ampm = hours >= 12 ? 'pm':'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var strTime = ampm;
    return strTime;
}

//-------------UPDATE TIME
function updateTime(){
  if(mode=="alarm"){
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ampm = formatAMPM(h);
    h = formatHour(h);
    m = formatTime(m);
    s = formatTime(s);
    if($(window).width() >= 1024){
      $(".current-time").html(h + ":" + m +":" + s +"<span class='morning-noon'>"+ampm+"</span>");
    }
    else{
      $(".current-time").html(h + ":" + m + "<span class='morning-noon'>"+ampm+"</span>");
    }
  }

}

//-------------UPDATE TIME DISPLAY
function getTimeNow(){
  var v = new Date();
  var timeNow = hoursToMillis(v.getHours()) + minuteToMillis(v.getMinutes());
  return timeNow;
}
function getAlarmInfo(){
  if(mode == "alarm"){
    var ampm;
    var hour = $("#hour-select").val();
    var min = $("#minute-select").val();
    var name = $(".alarm-name-input").val();
    if(name == ""){
      name = "alarm";
    }
    ampm = formatAMPM(hour);
    hour = formatHour(hour);
    min = formatTime(min);

    if(alarm_on){
      startAlarm(hour,min);
    }
    $(".alarm-name").html(name);
    $(".alarm-list-text").html(name);
    $(".alarm-list-time").html(hour +":"+ min + ampm);
    $(".alarm-at").html(hour +":"+ min + ampm);
    return [ampm,hour,min];
  }
  else{
    if(pomodoro_on == false){
      var focusTimerDisplay = $("#Focus-time-select option:selected").val();
      var shortrestTimerDisplay = $("#ShortRest-time-select option:selected").val();
      var longrestTimerDisplay = $("#LongRest-time-select option:selected").val();

      $("#focus-countdown-box").text(formatThis(millisToMinutes(focusTimerDisplay)) +":"+formatTime(millisToSeconds(focusTimerDisplay)));
      $("#short-rest-countdown-box").text(formatThis(millisToMinutes(shortrestTimerDisplay)) +":"+formatTime(millisToSeconds(shortrestTimerDisplay)));
      $("#long-rest-countdown-box").text(formatThis(millisToMinutes(longrestTimerDisplay)) +":"+formatTime(millisToSeconds(longrestTimerDisplay)));
    }
  }


}

//-------------TIME CONVERSION
function countDown(milliseconds){
  milliseconds = milliseconds - 1000;
  return milliseconds;
}
function millisToHour(millis){
  millis = Math.floor(millis/60/60/1000);
  return millis;
}
function millisToMinutes(millis){
  millis = Math.floor(millis/1000/60);
  return millis;
}
function millisToSeconds(millis){
  millis = Math.floor(millis/1000)%60;
  return millis;
}
function minuteToMillis(m){
  m = m*60*1000;
  return m;
}
function hoursToMillis(h){
  h = h*60*60*1000;
  return h;
}
function secondsToMillis(s){
  s = s*1000;
  return s;
}

//-------------HIDE AND SHOW MENU POPUPS
function hideShowFade(hide,show){
  $(hide).fadeOut();
  $(show).fadeIn();
}

//-------------HIDE AND SHOW ALARM POPUPS

function ringAlarm(popup){
  $(popup).fadeIn();
  $("#alarm-menu").fadeOut();
  tone.play();
}
function stopRingAlarm(popup){
  $(popup).fadeOut();
  tone.pause();
  tone.currentTime = 0;
}


//-------------BACKGROUNDFunction
function darkenBG(){
  $("body").css({
    backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url('resources/css/img/green.jpg')"
  });
}

function lightenBG(){
  $("body").css({
    backgroundImage:"url('resources/css/img/green.jpg')"
  });
}

//------------- HIDING AND SHOWING BUTTONS FUNCTIONS
function hideShow(hide,show){
  $(hide).hide();
  $(show).show();
}

//-------------SET TONE Function
function setTone(soundSource){
  tone = new Audio("resources/mp3/"+ soundSource);
  return tone;
}


});
