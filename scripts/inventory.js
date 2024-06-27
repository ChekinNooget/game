import data from "../data/save.json" with { type: "json" };
console.log(data);
$(document).ready(function () {for (let i = 0; i < data.inventory.length; i++) {
        // The jQuery equivalent
        $("#inv-contents").append(returnInventoryContent(data.inventory[i][0], data.inventory[i][1]));
    }
  });
  
function returnInventoryContent(name, amount){
    return `<div class="inv-item"><span class="inv-item-name">${name}</span><span class="inv-item-amount">${amount}</span></div>`
    
}
