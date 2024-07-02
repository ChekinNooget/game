let log = [];
let id = 0;
// msg: string, clr: array of 3 integers between 0 and 255, inclusive

export const logColors = {
  default: [0, 0, 0],
  story: [0, 0, 0],
  gold: [212, 175, 55],
  special: [173, 216, 230],
  fail: [255, 0, 0],
  quack: [200, 200, 0]
}

export const logMessage = (msg, clr) => {
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

export const clearLog = () => {
  log = [];
  $(".indivlog").remove();
  logMessage("message log cleared", [173, 216, 230]);
};

export const mergeObjects = (obj1, obj2) => {
    for (key in obj2) {
        if (obj1[key] == undefined) {
            if (typeof obj2[key] == "object")
                obj1[key] = JSON.parse(JSON.stringify(obj2[key]));
            else
                obj1[key] = obj2[key];
        } else
            if (typeof obj2[key] == "object")
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