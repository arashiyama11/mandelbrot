import Complex from './complex.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = Math.min(innerWidth, innerHeight);
canvas.height = innerHeight;
canvas.width = innerWidth;
const arr = new Uint8ClampedArray(4 * innerWidth * innerHeight);
let iw = innerWidth;
let ih = innerWidth;
let b = 4;
let dx = 2;
let dy = 1.5;

let isClicking = false;
let distance = null;
const pointers = [];

function drow() {
  for (let i = 0; i < arr.length; i += 4) {
    const x = (((i / 4) % iw) / iw) * b - dx;
    const y = (Math.floor(i / 4 / iw) / ih) * b - dy;
    let c = 10 / b;
    if (c < 20) c = 20;
    if (c > 500) c = 500;
    let score = new Complex(x, y).isInMandelbrot(c);
    if (score === true) {
      arr[i + 0] = 0;
      arr[i + 1] = 0;
      arr[i + 2] = 0;
      arr[i + 3] = 255;
    } else {
      let n = score * Math.PI;
      arr[i + 0] = score * 255; // R value
      arr[i + 1] = Math.sin(n) * 255; // G value
      arr[i + 2] = Math.cos(n) * 255; // B value
      arr[i + 3] = 255; // A value
    }
  }

  const imageData = new ImageData(arr, innerWidth, innerHeight);

  ctx.putImageData(imageData, 0, 0);
}
drow();

addEventListener('keydown', (e) => {
  let d = b / 3;
  let magic = b / 30;
  switch (e.key) {
    case 'a':
      dx += d;
      break;
    case 'd':
      dx -= d;
      break;
    case 'w':
      dy += d;
      break;
    case 's':
      dy -= d;
      break;
    case 'q':
      b *= 1.1;
      dy += magic;
      dx += magic;
      break;
    case 'e':
      b /= 1.1;
      dx -= magic;
      dy -= magic;
      break;
  }
  drow();
});

addEventListener('pointermove', (e) => {
  e.preventDefault();
  if (pointers.length === 0) return;
  if (pointers.length === 1) {
    dx += (e.movementX * b) / 500;
    dy += (e.movementY * b) / 500;
  } else if (pointers.length === 2) {
    const pa = pointers[0];
    const pb = pointers[1];
    const dis = Math.sqrt(
      (pa.offsetX - pb.offsetX) ** 2 + (pa.offsetY - pb.offsetY) ** 2
    );
    if (distance === null) {
      distance = dis;
    } else if (distance > dis) {
      //短くなってる場合
      let magic = b / 30;
      b *= 1.1;
      dx += magic;
      dy += magic;
    } else {
      //長くなってる場合
      let magic = b / 30;
      b /= 1.1;
      dx -= magic;
      dy -= magic;
    }
  }
  drow();
});

addEventListener('pointerdown', (e) => {
  pointers.push(e);
});

addEventListener('pointerup', (e) => {
  pointers.pop();
});
