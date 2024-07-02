import data from "../data/locations.json" with {type: "json"};
import { logColors, logMessage } from "./utils.js";

const processMessage = (game, message) => {
    if (message.charAt(0) == '!') {
        let command = message.split('|')[0], params = message.split('|')[1].split(",");
        if (command == "!unlock") {
            game.unlocks[params[0]] = true;
            logMessage(`New feature unlocked: ${params[0]}`, logColors.gold);
        }
    } else {
        logMessage(message, logColors.story);
    }
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