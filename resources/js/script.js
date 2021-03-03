$(document).ready(function(){
  var timeQuotes = ["The two most powerful warriors are patience and time.","Time is money.","Time waits for no one.","Better three hours too soon than a minute late.","Lost time is never found again.","Time is the most valuable thing a man can spend.","Time is the wisest counselor of all.","The key is in not spending time, but in investing it.","Punctuality is the thief of time.","Time is free, but it's priceless. You can't own it, but you can use it.","Time is a storm in which we are all lost.","Regret for wasted time is more wasted Time.","Time is what we want most, but what we use worst.","It's clear that the most precious resource we all have is time.","Never leave 'till tomorrow which you can do today."];
  var audioSources = ["Alarm-ringtone.mp3" , "Analog_watch.mp3" , "Loud_alarm.mp3" , "Massive_war.mp3" , "Missile_alert.mp3" , "Siren_alarm.mp3"];
  var isAlarm = false;
  var isPomodoro = true;
  var hourSet;
  var secondSet;
  var tone = new Audio("resources/mp3/Alarm-ringtone.mp3");
  var value;
  var mode = "alarm";
  var focusMinutes;
  var restMinutes;
  var focusTone = new Audio("resources/mp3/Alarm-ringtone.mp3");
  var restTone = new Audio("resources/mp3/Alarm-ringtone.mp3");


  setInterval(updateTime, 10);
  hideShow("#set_Pomodoro","#set_Alarm");
  hideShow("#stop_Pomodoro","#stop_Alarm");

  setInterval(selectedTime,1);
  changeQuote();





  $("#set_Alarm").click(function(){
    $(".menu-box").fadeIn();
    $("body").css({
      backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url('resources/css/img/green.jpg')"
    });

  });

  $("#stop_Alarm").click(function(){
    if(isAlarm){
      stopCurrentAlarm();
    }

  });

  $(".icon").click(function(){

    tone.pause();
    tone.currentTime = 0;
    hideMenuTest();
  });

  $("#btn-test").click(function(){

    tone.play();
    $(".test-box").fadeIn();
    $(".menu-box").fadeOut();
    getAlarmName();
  });

  $("#btn-cancel").click(function(){
    hideMenuTest();
  });

  $(".close-btn").click(function(){

    tone.pause();
    tone.currentTime = 0;
    $(".test-box").fadeOut();
    $(".menu-box").fadeIn();
  });

  $(".alarm-close-btn").click(function(){
    hideMenuTest();
    isAlarm = false;
    tone.pause();
    tone.currentTime = 0;
  });

  $("#btn-start").click(function(){
      $(".current-alarm-box").show();
      hideMenuTest();
      getAlarmName();
      isAlarm = true;
      value = selectedTime();
      hourSet = value[0];
      secondSet = value[1];
  });

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

$("#set_Pomodoro").click(function(){
  $(".pomodoro-menu-box").fadeIn();
  $("body").css({
    backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7)),url('resources/css/img/green.jpg')"
  });
});


$("#switch_mode").click(function(){
  toggleButtons("#set_Alarm","#set_Pomodoro","#stop_Alarm","#stop_Pomodoro");
  if(mode == "pomodoro"){
    mode = "alarm";
    $(this).html("Pomodoro Mode");
  }
  else{
    stopCurrentAlarm();
    mode = "pomodoro"
    $(this).html("Alarm Mode");
  }
  return mode;
});

$("#focus-time-select").on("change",function(){
  var focusMinutes = $(this).val();
  return focusMinutes;
});

$("#break-time-select").on("change",function(){
  var restMinutes = $(this).val();

});

$("#focus-tone-select").on("change",function(){
  var currentToneValue = this.value;
  switch (currentToneValue) {
    case "1":
      setFocusTone(audioSources[0]);
      break;
    case "2":
      setFocusTone(audioSources[1]);
      break;
    case "3":
      setFocusTone(audioSources[2]);
      break;
    case "4":
      setFocusTone(audioSources[3]);
      break;
    default:
  }
});

$("#rest-tone-select").on("change",function(){
  var currentToneValue = this.value;
  switch (currentToneValue) {
    case "1":
      setRestTone(audioSources[0]);
      break;
    case "2":
      setRestTone(audioSources[1]);
      break;
    case "3":
      setRestTone(audioSources[2]);
      break;
    case "4":
      setRestTone(audioSources[3]);
      break;
    default:
  }
});

$("#btn-pomodoro-start").click(function(){
  hideMenuTest();
  isPomodoro = true;
});

//Update Time Function
function updateTime(){
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var ampm = formatAMPM(h);

  h = formatHour(h);
  m = formatTime(m);
  s = formatTime(s);
  $(".current-time").html(h + ":" + m +":" + s +"<span class='morning-noon'>"+ampm+"</span>");
}

// Quote Fadein Fadeout
function changeQuote(){
  setInterval(function () {
  $(".greeting i").fadeOut(5500, function () {
      var random = Math.round(14*Math.random());
      $(this).html('<span class="quote-marks">"</span>'+ timeQuotes[random] +'<span class="quote-marks">"</ span>').fadeIn(2500);
    });
  }, 4000);
}

// Button Functions

  function hideButtons(x,y,z){
    $(x).hide();
    $(y).hide();
    $(z).hide();
  }

  function hideShow(x,y){
    $(x).hide();
    $(y).show();
  }


  function toggleButtons(w,x,y,z){
    $(w).toggle();
    $(x).toggle();
    $(y).toggle();
    $(z).toggle();
  }

  // Time Related Functions
  function selectedTime(){
    var hour = $("#hour-select option:selected").val();
    var sec = $("#minute-select option:selected").val();
    if(isAlarm){
      startAlarm(hour,sec);
    }
    if(isPomodoro){
      console.log(focusMinutes);
      console.log(restMinutes);
    }
    var ampm;
    ampm = formatAMPM(hour);
    hour = formatHour(hour);
    sec = formatTime(sec);
    $(".alarm-at").html(hour +":"+ sec + ampm);

    return [hour,sec];
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


  // Alarm Related Functions

  function stopCurrentAlarm(){
    $(".current-alarm-box").fadeOut();
    isAlarm = false;
    return isAlarm;
  }


  function startAlarm(h,s){
    var d = new Date();
    if(h == d.getHours() && s == d.getMinutes()){

      tone.play();
      $(".alarm-box").fadeIn();
    }
  }

// TEST Popup
function hideMenuTest(){
  $(".menu-header").parent().fadeOut();
  $("body").css({
    backgroundImage:"url('resources/css/img/green.jpg')"
  });
}
// SETTERS
function setTone(soundSource){
  tone = new Audio("resources/mp3/"+ soundSource);
  return tone;
}
function setFocusTone(soundSource){
  focusTone = new Audio("resources/mp3/"+ soundSource);
  return focusTone;
}

function setRestTone(soundSource){
  restTone = new Audio("resources/mp3/"+ soundSource);
  return restTone;
}

// GETTERS
function getAlarmName(){
  alarmName = $(".alarm-name-input").val();
  if(alarmName == ""){
    alarmName = "Alarm";
  }
  $(".alarm-list-text").html(alarmName);
  $(".alarm-name").html(alarmName);
}

function getAlarmDetail(h,s){
  return [h,s];
}
function getPomDetails(focusMinutes,restMinutes){
  return [f,r];
}

});
