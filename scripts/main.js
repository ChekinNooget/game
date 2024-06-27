import renderInventory from "./inventory.js";

let save = () => localStorage.save = game;
let load = () => game = localStorage.save;

// Will "game" be reassigned somewhere?
let game = {time: 0};

/* let lastTick = Date.now();
let update = () => {
  let curTick = Date.now();
  let delta = curTick - lastTick;
  lastTick = curTick;
  game.time += delta / 1000;
} */

const update = (() => {
  let lastTick = Date.now();
  return () => {let delta = Date.now() - lastTick; lastTick = Date.now(); game.time += delta / 1000;}
})();

setInterval(update, 100); // every tick is 100 ms
setInterval(save, 10000); // save every 10 seconds
console.log("1434"); // i lost the game

$(document).ready(function () {
  renderInventory();
  load();
});
