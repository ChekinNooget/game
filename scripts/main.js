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

let game = JSON.parse(JSON.stringify(initialSave));
const save = () => localStorage.save = JSON.stringify(game);
const load = () => {
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

const log = [];
// msg: string, clr: array of 3 integers between 0 and 255, inclusive
const logMessage = (msg, clr) => {
  log.push({msg: msg, clr: clr});
  $("#ui-msglog")[0].innerHTML += `<p style="color:rgba(${clr[0]},${clr[1]},${clr[2]},1">${msg}</p>`;
  if (log.length > 20) {
    $("#ui-msglog")[0].children[0].remove();
    log.shift();
  }
  for (let i = 0; i < log.length - 1; i++) {
    $("#ui-msglog")[0].children[i].style.color = `rgba(${log[i][0]}, ${log[i][1]}, ${log[i][2]}, ${105 - 5 * (log.length - i)})`;
  }
}

const quack = () => logMessage("quack", [200, 200, 0]);
$("#quack").click(quack);

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
  navigator.clipboard.writeText(JSON.stringify(game));
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