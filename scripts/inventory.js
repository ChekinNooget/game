import data from "../data/save.json" with { type: "json" };
console.log(data);
$(document).ready(function () {
    renderInventory()
  });
  
function returnInventoryContent(name, amount){
    return `<div class="inv-item"><span class="inv-item-name">${name.toUpperCase()} - </span><span class="inv-item-amount">${amount}</span></div>`
}

function renderInventory(){
    for (let i = 0; i < data.inventory.length; i++) {
        $("#inv-contents").append(returnInventoryContent(data.inventory[i][0], data.inventory[i][1]));
    }
}