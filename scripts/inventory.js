/* Formats the inventory and appends it to the INVENTORY section */
import data from "../data/save.json" with {type: "json"};
console.log(data);

function returnInventoryContent(name, amount){
    return `<div class="inv-item"><span class="inv-item-name">${name.toUpperCase()} - </span><span class="inv-item-amount">${amount}</span></div>`;
}

export default function renderInventory(){
    data.inventory.forEach((item) => {
        $("#inv-contents").append(returnInventoryContent(item[0], item[1]));
    });
}
