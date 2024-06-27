import data from "../data/save.json" with { type: "json" };
console.log(data);
$(document).ready(function () {
    renderInventory()
});
  
function returnInventoryContent(name, amount){
    return `<div class="inv-item"><span class="inv-item-name">${name.toUpperCase()} - </span><span class="inv-item-amount">${amount}</span></div>`
}

function renderInventory(){
    data.inventory.forEach((item) => {
        $("#inv-contents").append(returnInventoryContent(item[0], item[1]));
    });
}
