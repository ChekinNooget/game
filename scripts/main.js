import renderInventory from "./inventory.js";
import {Enemy, generateEnemy} from "./combat.js";

/* Initializes the game */
// Will "game" be reassigned somewhere?
// yes, in the update function - it was raising an error
// This should be coming from something else; const object properties can be reassigned
// yeah, but it was reassigning the entire variable
const initialSave = {
  resources: {
    wood: 0,
    metal: 0,
    science: 0
  },
  time: 0
};

let game = JSON.parse(JSON.stringify(initialSave));;
let save = () => localStorage.save = JSON.stringify(game);
let load = () => {
  try {
    let str = localStorage.save;
    if (str == "[object Object]" || str == "undefined") throw new Error();
    game = JSON.parse(str);
  } catch (error) {
    game = JSON.parse(JSON.stringify(initialSave));
    save();
  }
};

const update = (() => {
  let lastTick = Date.now();
  return () => {
    let delta = Date.now() - lastTick;
    lastTick = Date.now();
    game.time += delta / 1000;
  }
})();

$(document).ready(function () {
  /* Starts the delta time, auto-save, and other initial content */
  renderInventory();
  setInterval(update, 100); // every tick is 100 ms (0.1 seconds)
  
  load();
  setInterval(save, 10000); // saves every 10 seconds
  
  console.log("1434"); // i lost the game
});

$("#savebtn").click(() => {
  save();
  alert("saved"); // change this later to a popup that doesn't require user interaction
  // On that note, a popup template would be nice
});

$("#exportbtn").click(() => {
  navigator.clipboard.writeText(JSON.stringify(save));
  alert("save copied to clipboard");
});

$("#resetbtn").click(() => {
  let yes = prompt("are you sure you want to do this? type 'yes' to confirm");
  if (yes == "yes") {
    game = JSON.parse(JSON.stringify(initialSave));
    save();
    load();
  }
});