const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
let countdown;

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', startCustomTimer)

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

function startCustomTimer(e) {
  e.preventDefault();

  const minutes = this.minutes.value;
  const seconds = minutes*60;

  timer(seconds);

  this.reset();
}

function timer(seconds) {
  if (countdown) {
    clearInterval(countdown);
  }

  const now = +new Date();
  const then = now + seconds*1000;

  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const now = +new Date();
    const secondsLeft = Math.round((then - now)/1000);
    displayTimeLeft(secondsLeft);

    if (secondsLeft <= 0) {
      clearInterval(countdown);
      return;
    }
  }, 1000);
}

function displayTimeLeft(seconds) {

  const minutes = Math.floor(seconds/60);
  const remainderSeconds = seconds%60;
  const display = `${minutes}:${formatTime(remainderSeconds)}`;

  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hours = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Вернусь в ${hours}:${formatTime(minutes)}`
}

function formatTime(num) {
  return (num < 10 ? '0' : '') + num;
}