import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import { battery } from "power";

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function $(s) {
    return document.getElementById(s);
  }
// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const hourLabel = document.getElementById("hour");
const minLabel = document.getElementById("min");
const dayLabel = document.getElementById("day");
let myRingTl = $("today_tl");
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  let mins = zeroPad(today.getMinutes());
  if (hours >= 0 && hours <= 9){
    hourLabel.text = `0${hours}`;
  }
  else{
  hourLabel.text = `${hours}`;
  }
  minLabel.text = `${mins}`;
  if ((mins%59 == 0) || (dayLabel.text == "")){
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayLabel.text = `${weekdays[today.getDay()]} ${today.getFullYear()%100}`;
    let batteryLevel = `${Math.floor(battery.chargeLevel)}`;
    if (batteryLevel < 100) {
      $("battery").text  = batteryLevel;
    }
    battery.onchange = (charger, evt) => {
      console.log("battery state changed");
     }
    myRingTl.sweepAngle = Math.min(360, Math.round((Math.floor(battery.chargeLevel)*360)/100));
  }
}