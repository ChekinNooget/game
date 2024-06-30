/* Formats the inventory and appends it to the INVENTORY section */
import data from "../data/save.json" with {type: "json"};

function returnInventoryContent(name, amount){
    // Gotta be careful with these... 
    return `<div class="inv-item"><span class="inv-item-name">${name.toUpperCase().replace(/[^\w]+/g, "")} - </span><span class="inv-item-amount">${(typeof amount === "number") ? amount : 0}</span></div>`;
}

export default function renderInventory(game){
    let newHTML = "";
    Object.keys(game.resources).forEach((item) => {
        newHTML += returnInventoryContent(item, game.resources[item]);
    });
    $("#inv-contents").append(newHTML);
}
