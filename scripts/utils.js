let log = [];
let logId = 0;
// msg: string, clr: array of 3 integers between 0 and 255, inclusive

const initialSave = {
  inventory: {items: [], mods: {renderDiv: "#inv-contents"}},
  itemId: 0,
  equipment: {
    head: null,
    body: null,
    legs: null,
    feet: null,
    weapon: null
  },
  exploration: {
    home: 0,
    grocery_store: 0
  },
  unlocks: {
    map: false,
    shop: false,
    home: true,
    grocery_store: false
  },
  cooldowns: {
    explore: 0
  },
  location: "home",
  time: 0,
  version: "alpha"
};

export let game = new Object(initialSave);
export const save = () => (localStorage.save = JSON.stringify(game));
export const load = () => {
  try {
    let str = localStorage.save;
    // I think this error would be covered by JSON.parse(str)?
    if (str == "[object Object]" || str == "undefined") throw new Error();
    game = JSON.parse(str);
    mergeObjects(game, initialSave);
  } catch (error) {
    console.log(error);
    game = new Object(initialSave);
    save();
  }
};

export const logColors = {
  default: [0, 0, 0],
  story: [0, 0, 0],
  gold: [212, 175, 55],
  special: [173, 216, 230],
  yay: [0, 255, 0],
  fail: [255, 0, 0],
  quack: [200, 200, 0]
}

export const logMessage = (msg, clr) => {
  log.unshift({ msg: msg, clr: clr, id: logId });
  $("#ui-msglog").html(`<p id="indivlog_${logId}" class="indivlog" style="color:rgba(${clr[0]},${clr[1]},${clr[2]},1)">${msg}</p>`.concat($("#ui-msglog").html()));
  logId++;
  if (log.length > 20) {
    $(`#indivlog_${log[log.length - 1].id}`).remove();
    log.pop();
  }
  for (let i = 1; i < log.length; i++) {
    $(`#indivlog_${log[i].id}`).css("color", `rgba(${log[i].clr[0]}, ${log[i].clr[1]}, ${log[i].clr[2]}, ${1 - i / 25})`);
  }
};

export const clearLog = () => {
  log = [];
  $(".indivlog").remove();
  logMessage("message log cleared", logColors.special);
};

export const cloneObject = (obj, func) => new (Function.prototype.bind.apply(func, [null].concat(func.params).map(arg => arg == null ? null : obj[arg])));

export const mergeObjects = (obj1, obj2) => {
  for (let key in obj2) {
    if (obj1[key] == undefined) {
      if (typeof obj2[key] == "object")
        obj1[key] = JSON.parse(JSON.stringify(obj2[key]));
      else
        obj1[key] = obj2[key];
    } else if (typeof obj2[key] == "object")
      mergeObjects(obj1[key], obj2[key]);
  }
}

export const formatCooldown = (cd, text) => {
  if (cd >= 1000) {
    return `${Math.round(cd / 10) / 100} seconds`;
  } else if (cd > 0) {
    return `${cd} milliseconds`;
  } else {
    return text;
  }
}

export const updateMockBattle = (enemy1, enemy2) => {
  $("#enemy1").html(enemy1.toString());
  $("#enemy2").html(enemy2.toString());
}