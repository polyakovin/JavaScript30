const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
let isMousedown = false;

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', setProgress);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(btn => btn.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('mousemove', updateRange));
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => isMousedown = true);
progress.addEventListener('mouseup', () => isMousedown = false);
progress.addEventListener('mousemove', (e) => isMousedown && scrub(e));

isMousedown

document.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case 32:
      togglePlay();
      break;
    default:
      // statements_def
      break;
  }
  console.log(e.keyCode);
});

function togglePlay() {
  video[video.paused ? 'play' : 'pause']();
}

function updateButton() {
  toggle.textContent = this.paused ? '►' : '||';
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function updateRange() {
  video[this.name] = this.value;
}

function setProgress() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubTime;
}
