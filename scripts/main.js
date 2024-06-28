import renderInventory from "./inventory.js";

let game = {};
// Will "game" be reassigned somewhere?
// yes, in the update function - it was raising an error
// This should be coming from something else; const object properties can be reassigned
// yeah, but it was reassigning the entier variable
let save = () => localStorage.save = game;
let load = () => {
  try {
    game = JSON.parse(localStorage.save);
  } catch (eror) {
    game = {
      resources: {
        wood: 0,
        metal: 0,
        science: 0
      },
      time: 0
    };
  }
};

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

$(document).ready(function () {
  renderInventory();
  load();
  setInterval(update, 100); // every tick is 100 ms
  setInterval(save, 10000); // save every 10 seconds
  console.log("1434"); // i lost the game
});

$("#savebtn").onclick = () => {
  save();
  alert("saved"); // change this later to a popup that doesn't require user interaction
};