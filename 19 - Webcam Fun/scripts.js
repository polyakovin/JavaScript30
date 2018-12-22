const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgb = document.querySelector('.rgb');

let effect = 'none';

getVideo();
video.addEventListener('canplay', paintToCanvas);

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(error => {
      console.error(error);
    });
}

function paintToCanvas() {
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    applyEffect(width, height);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'webcamSnapshot');
  link.innerHTML = `<img src="${data}" alt="webcam snapshot" />`;
  strip.insertBefore(link, strip.firstChild);
}

function applyEffect(width, height) {
  if (effect !== 'none') {
    const effects = getEffects();

    if (effect in effects) {
      let pixels = ctx.getImageData(0, 0, width, height);
      effects[effect](pixels);
      ctx.putImageData(pixels, 0, 0);

      if (effect === 'chromakey') {
        rgb.classList.remove('invisible');
      } else {
        rgb.classList.add('invisible');
      }

    } else {
      console.error(`no filter called ${effect}`);
    }
  }
}

function getEffects() {
  return {
    red: (image) => {
      pixels = image.data;

      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] += 200;    // r
        pixels[i + 1] -= 50; // g
        pixels[i + 2] *= .5; // b
      }

      ctx.globalAlpha = 1;

      image.data = pixels;
      return image;
    },

    rgbSplit: (image) => {
      pixels = image.data;

      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i - 250] = pixels[i + 0]; // r
        pixels[i + 100] = pixels[i + 1]; // g
        pixels[i + 250] = pixels[i + 2]; // b
      }

      ctx.globalAlpha = 0.1;

      image.data = pixels;
      return image;
    },

    chromakey: (image) => {
      pixels = image.data;

      const levels = {};

      rgb.querySelectorAll('input').forEach(input => {
        levels[input.name] = input.value;
      });

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i + 0];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (
          r >= levels.rmin &&
          g >= levels.gmin &&
          b >= levels.bmin &&
          r <= levels.rmax &&
          g <= levels.gmax &&
          b <= levels.bmax
        ) {
          pixels[i + 3] = 0;
        }
      }

      ctx.globalAlpha = 1;

      image.data = pixels;
      return image;
    }
  }
}