import { Enemy, generateEnemy } from "./combat.js";
import { logColors, logMessage, clearLog, mergeObjects, formatCooldown } from "./utils.js";
import { explore } from "./exploration.js";
import renderInventory from "./inventory.js";
import Map from "./map.js";

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
  exploration: {
    home: 0,
    grocery_store: 0
  },
  unlocks: {
    map: false,
    grocery_store: false
  },
  cooldowns: {
    explore: 0
  },
  location: "home",
  time: 0,
};

let game = JSON.parse(JSON.stringify(initialSave));
const save = () => (localStorage.save = JSON.stringify(game));
const load = () => {
  try {
    let str = localStorage.save;
    if (str == "[object Object]" || str == "undefined") throw new Error();
    game = JSON.parse(str);
    mergeObjects(game, initialSave);
  } catch (error) {
    game = JSON.parse(JSON.stringify(initialSave));
    save();
  }
};

// Map
const map = new Map();
map.newNode(10, 10, "start");
map.newNode(27, 63, "stickman's house");
map.newRoute("start", "stickman's house", 2, true);
const updateMap = () => {
  map.clear();
  map.render();
}

const quack = () => logMessage(Math.random() < 0.99 ? "quack" : "QUACKQUACKQUACKQUACKQUACKQUACKQUACKQUACKQUACKQUACK", [200, 200, 0]);
$("#quack").click(quack);

const update = (() => {
  let lastTick = Date.now();
  return () => {
    let delta = Date.now() - lastTick;
    lastTick = Date.now();
    game.time += delta / 1000;

    game.cooldowns.explore = Math.max(game.cooldowns.explore - delta, 0);
    $("#explorebtn").html(formatCooldown(game.cooldowns.explore, "explore"));
    updateMap();
  };
})();

$(document).ready(function () {
  /* Starts the delta time, auto-save, and other initial content */
  load();
  setInterval(save, 10000); // saves every 10 seconds

  renderInventory(game);
  setInterval(update, 100); // every tick is 100 ms (0.1 seconds)

  if (game.exploration.home == 0) {
    logMessage("You wake up from a terrible dream. You can't recall from your memory where you are, nor any details from your previous life experiences.", logColors.story);
    logMessage("You open your eyes, and find yourself surrounded in total darkness. Perhaps there might be a light switch if you touch around the walls of the room...", logColors.story); // dabcabcdabcadbaa
  }

  console.log("1434"); // i lost the game
});

$("#explorebtn").click(() => {
  if (game.cooldowns.explore == 0) {
    explore(game);
    update();
    game.cooldowns.explore = 10000;
  }
});

$("#savebtn").click(() => {
  save();
  // alert("saved"); // change this later to a popup that doesn't require user interaction
  // On that note, a popup template would be nice
  logMessage("saved", logColors.special); // changed popup to log
  // popup probably still better but this doesn't require user interaction to close out
});

$("#importbtn").click(() => {
  try {
    let newSave = prompt("copy your save here (warning: this will override your current progress)");
    let newGame = JSON.parse(newSave);
    game = JSON.parse(JSON.stringify(newGame));
    mergeObjects(game, initialSave);
    logMessage("save successfully imported", logColors.special);
  } catch (error) {
    logMessage("import failed", logColors.fail);
  }
});

$("#exportbtn").click(() => {
  navigator.clipboard.writeText(JSON.stringify(game));
  logMessage("save copied to clipboard", logColors.special);
});

$("#resetbtn").click(() => {
  let yes = prompt("are you sure you want to do this? type 'yes' to confirm");
  if (yes == "yes") {
    game = JSON.parse(JSON.stringify(initialSave));
    save();
    load();
    clearLog();
    update();
  }
});
