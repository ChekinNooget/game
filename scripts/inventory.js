/* Formats the inventory and appends it to the INVENTORY section */
import data from "../data/save.json" with {type: "json"};
console.log(data);

function returnInventoryContent(name, amount){
    // Gotta be careful with these... 
    return `<div class="inv-item"><span class="inv-item-name">${name.toUpperCase().replace(/[^\w]+/g, "")} - </span><span class="inv-item-amount">${(typeof amount === "number") ? amount : 0}</span></div>`;
}

export default function renderInventory(){
    let newHTML = "";
    data.inventory.forEach((item) => {
        newHTML += returnInventoryContent(item[0], item[1]);
    });
    $("#inv-contents").append(newHTML);
}
