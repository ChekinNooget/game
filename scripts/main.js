let save = () => localStorage.save = game;
let load = () => game = localStorage.save;

let game = {time: 0};

let lastTick = Date.now();
let update = () => {
  let curTick = Date.now();
  let delta = curTick - lastTick;
  lastTick = curTick;
  game.time += delta / 1000;
}

setInterval(update, 100);

console.log("1434");

$(document).ready(function () {
  $("body").append("Script executed.");
});
