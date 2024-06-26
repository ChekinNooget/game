let dgebid = id => document.getElementById(id);
let save = () => localStorage.save = game;
let load = () => game = localStorage.save;

let game = {time: 0};

let lastTick = Date.now();
let update = () => {
  let curTick = Date.now();
  let delta = curTick - lastTick;
  lastTick = curTick;
  time += delta / 1000;
}

setInterval(update, 100);
