import renderInventory from "./inventory.js";

/* Initializes the game */
// Will "game" be reassigned somewhere?
// yes, in the update function - it was raising an error
// This should be coming from something else; const object properties can be reassigned
// yeah, but it was reassigning the entire variable
let game = {};
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

/* Sets up delta time */
const update = (() => {
  let lastTick = Date.now();
  return () => {
    let delta = Date.now() - lastTick;
    lastTick = Date.now();
    game.time += delta / 1000;
  }
})();

$(document).ready(function () {
  /* Setup the inventory */
  renderInventory();
  /* Starts delta time count */
  setInterval(update, 100); // every tick is 100 ms (0.1 seconds)

  /* Starts save count */
  load();
  setInterval(save, 10000); // saves every 10 seconds
  
  console.log("1434"); // i lost the game
});

$("#savebtn").click(() => {
  save();
  alert("saved"); // change this later to a popup that doesn't require user interaction
  // On that note, a popup template would be nice
});
