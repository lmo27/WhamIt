
function countdown(elementName, targetHour, targetMinute, targetSecond) {
  let element, endTime, hours, mins, msLeft, time;

  function twoDigits(n) {
      return (n <= 9 ? '0' + n : n);
  }

  function updateTimer() {
      msLeft = endTime - (+new Date);

      if (msLeft < 1000) {
          // Reset the countdown at 12 AM next day
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(targetHour, targetMinute, targetSecond, 0);
          endTime = tomorrow.getTime();

          element.innerHTML = '0:00';
      } else {
          time = new Date(msLeft);
          hours = time.getUTCHours();
          mins = time.getUTCMinutes();
          element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());

          setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
      }
  }

  element = document.getElementById(elementName);

  // Set the target time for the first countdown
  const now = new Date();
  const today = new Date(now);
  today.setHours(targetHour, targetMinute, targetSecond, 0);

  if (now > today) {
      // If the target time has already passed today, set it for tomorrow
      today.setDate(now.getDate() + 1);
  }

  endTime = today.getTime();

  updateTimer();
}

// Set the target time for 12 AM
const targetHour = 0; // 12 AM
const targetMinute = 0;
const targetSecond = 0;

countdown('countdown', targetHour, targetMinute, targetSecond);

// In the second HTML file
var score = localStorage.getItem('scoreKey');
var outputElement = document.getElementById('scoreMessage');
if (score > 6 ) {
    outputElement.textContent = "You lost bro";

} else if (score == 1) { 
    outputElement.textContent = "You got today's song in " + score  + " guess.";
} else {
    outputElement.textContent = "You got today's song in " + score  + " guesses.";
}

