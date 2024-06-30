import renderInventory from "./inventory.js";
import { Enemy, generateEnemy } from "./combat.js";

/* Initializes the game */
// Will "game" be reassigned somewhere?
// yes, in the update function - it was raising an error
// This should be coming from something else; const object properties can be reassigned
// yeah, but it was reassigning the entire variable
const initialSave = {
  resources: {
    wood: 0,
    metal: 0,
    science: 0,
  },
  time: 0,
};

let game = JSON.parse(JSON.stringify(initialSave));
const save = () => (localStorage.save = JSON.stringify(game));
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
  };
})();

let log = [];
let id = 0;
// msg: string, clr: array of 3 integers between 0 and 255, inclusive

const logMessage = (msg, clr) => {
  log.unshift({ msg: msg, clr: clr, id: id });
  $("#ui-msglog").html(`<p id="indivlog_${id}" class="indivlog" style="color:rgba(${clr[0]},${clr[1]},${clr[2]},1)">${msg}</p>`.concat($("#ui-msglog").html()));
  id++;
  if (log.length > 20) {
    $(`#indivlog_${log[log.length - 1].id}`).remove();
    log.pop();
  }
  for (let i = 1; i < log.length; i++) {
    $(`#indivlog_${log[i].id}`).css("color", `rgba(${log[i].clr[0]}, ${log[i].clr[1]}, ${log[i].clr[2]}, ${1 - i / 25})`);
  }
};

const clearLog = () => {
  log = [];
  $(".indivlog").remove();
  logMessage("message log cleared", [173, 216, 230]); 
}

const quack = () => logMessage("quack", [255, 255, 0]);
$("#quack").click(quack);

$(document).ready(function () {
  /* Starts the delta time, auto-save, and other initial content */
  renderInventory(game);
  setInterval(update, 100); // every tick is 100 ms (0.1 seconds)

  load();
  setInterval(save, 10000); // saves every 10 seconds

  console.log("1434"); // i lost the game
});

$("#savebtn").click(() => {
  save();
  //alert("saved"); // change this later to a popup that doesn't require user interaction
  // On that note, a popup template would be nice
  logMessage("saved", [0, 0, 0]); // changed popup to log
  // popup probably still better but this doesn't require user interaction to close out
});

$("#importbtn").click(() => {
  try {
    let newSave = prompt("copy your save here (warning: this will override your current progress)");
    let newGame = JSON.parse(newSave);
    game = JSON.parse(JSON.stringify(newGame));
  } catch (error) {
    logMessage("import failed", [255, 0, 0]); 
  }
});

$("#exportbtn").click(() => {
  navigator.clipboard.writeText(JSON.stringify(game));
  logMessage("save copied to clipboard", [173, 216, 230]);
});

$("#resetbtn").click(() => {
  let yes = prompt("are you sure you want to do this? type 'yes' to confirm");
  if (yes == "yes") {
    game = JSON.parse(JSON.stringify(initialSave));
    save();
    load();
    clearLog();
  }
});
