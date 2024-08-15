// can someone pls explain why indents here are 4 spaces instead of 2
import data from "../data/locations.json" with {type: "json"};
import { logColors, logMessage } from "./utils.js";
import { Enemy, fight } from "./combat.js";

const processMessage = (game, message) => {
    if (message.charAt(0) == '!') {
        let command = message.split('|')[0], params = message.split('|')[1].split(",");
        if (command == "!unlock") {
            game.unlocks[params[0]] = true;
            logMessage(`New feature unlocked: ${params[0]}`, logColors.gold);
            if (params[0] == "map") $("#explprgs").css("display", "block");
        } else if (command == "!fight") {
            // if you're reading this pls try to reimplement this in async/await format idk how to (you might also need to change combat.js)
            let success = fight(new Enemy("player", 100, 5), new Enemy("blueberry buffed for testing", 100, 10), success => {
                if (success) {
                    logMessage("You won the fight!", logColors.yay);
                } else {
                    logMessage("You lost the fight; you lost some exploration progress as a result.", logColors.fail);
                    game.exploration[game.location]--;
                }
            });
        }
    } else {
        logMessage(message, logColors.story);
    }
}

export const updateExplorationProgress = game => {
    $("#explprgs").html(`progress: ${Math.floor(game.exploration[game.location] * 100 / data[game.location].max_exploration)}%`);
}

export const explore = game => {
    let location = game.location;
    let locLogs = data[location].logs;
    let newLogs = []
    for (let log in locLogs) {
        if (log > game.exploration[location] + 1) break;
        else if (log > game.exploration[location]) newLogs.push(log);
    }
    game.exploration[location]++;
    updateExplorationProgress(game);
    for (let nextLog in newLogs) {
        if (typeof locLogs[newLogs[nextLog]] == "string") {
            processMessage(game, locLogs[newLogs[nextLog]]);
        } else {
            for (let i in locLogs[newLogs[nextLog]]) {
                processMessage(game, locLogs[newLogs[nextLog]][i]);
            }
        }
    }
}