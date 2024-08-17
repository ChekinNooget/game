import { generateEnemy, fight } from "./combat.js";
import { game, save, load, logColors, logMessage, clearLog, cloneObject, mergeObjects, formatCooldown } from "./utils.js";
import { explore, updateExplorationProgress } from "./exploration.js";
import { ItemList, Inventory } from "./inventory.js";
import { groceryShop } from "./shop.js";
import Map from "./map.js";

import locationsData from "../data/locations.json" with {type: "json"};

/* Initializes the game */
// Will "game" be reassigned somewhere?
// yes, in the update function - it was raising an error
// This should be coming from something else; const object properties can be reassigned
// yeah, but it was reassigning the entire variable

// locations management
const changeLocation = newLocation => {
  if (game.location == newLocation) return;
  if (!game.unlocks[newLocation]) return;
  if (!game.unlocks.map) return;
  game.location = newLocation;
  updateExplorationProgress(game);
  logMessage("Arrived at " + newLocation, logColors.default);
}

// Map
const map = new Map();
Object.keys(locationsData).forEach((location) => {
  map.newNode(locationsData[location].x, locationsData[location].y, location);
});
map.fillEmptyRoutes(1434, true);
const updateMap = () => {
  map.clear();
  map.render();
}

$("#map-canvas").click((e, t) => {
  Object.keys(locationsData).forEach((location) => {
    if ((locationsData[location].x - e.offsetX) ** 2 + (locationsData[location].y - e.offsetY) ** 2 <= 49) {
      changeLocation(location);
    }
  });
});

const quack = () => {
  logMessage(Math.random() < 0.99 ? "quack" : "QUACKQUACKQUACKQUACKQUACKQUACKQUACKQUACKQUACKQUACK", [200, 200, 0]);
  // fight(generateEnemy(["small", "medium", "large"]), generateEnemy(["small", "medium", "large"]));
  
  // inventory testing
  game.inventory.addItem(new ItemList.coin(null, 1));
};
$("#quack").click(quack);

const update = (() => {
  let lastTick = Date.now();
  return () => {
    let delta = Date.now() - lastTick;
    lastTick = Date.now();
    game.time += delta / 1000;

    game.cooldowns.explore = Math.max(game.cooldowns.explore - delta, 0);
    $("#explorebtn").html(formatCooldown(game.cooldowns.explore, "explore"))
    if (game.cooldowns.explore == 0){
      $("#explorebtn")[0].classList.remove("on-cooldown");
    }

    if (game.unlocks.shop && game.location == "grocery_store") $("#shop").css("display", "block");
    else $("#shop").css("display", "none");
    updateMap();
  };
})();

$("#explorebtn").click(() => {
  if (game.cooldowns.explore == 0) {
    explore(game);
    update();
    game.cooldowns.explore = 2500;
    console.log($("#explorebtn")[0].classList)
    $("#explorebtn")[0].classList.add("on-cooldown");
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
    game = JSON.parse(newSave);
    save();
    location.reload();
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
    localStorage.removeItem("save");
    location.reload();
  }
});

const init = () => {
  /* Starts the delta time, auto-save, and other initial content */
  load();
  game.inventory = cloneObject(game.inventory, Inventory);

  setInterval(save, 10000); // saves every 10 seconds
  setInterval(update, 100); // every tick is 100 ms (0.1 seconds)

  if (game.exploration.home == 0) {
    logMessage("You wake up from a terrible dream. You can't recall from your memory where you are, nor any details from your previous life experiences.", logColors.story);
    logMessage("You open your eyes, and find yourself surrounded in total darkness. Perhaps there might be a light switch if you touch around the walls of the room...", logColors.story); // dabcabcdabcadbaa
  }

  updateExplorationProgress(game);
  if (game.unlocks.map) $("#explprgs").css("display", "block");
  if (game.unlocks.shop && game.location == "grocery_store") $("#shop").css("display", "block");

  fight(generateEnemy(["small", "medium", "large"]), generateEnemy(["small", "medium", "large"]));

  groceryShop.addItem(new ItemList.stick());
  groceryShop.addItem(new ItemList.knife());
  groceryShop.addItem(new ItemList.sword());

  console.log("1434"); // i lost the game
}; $(document).ready(init);
