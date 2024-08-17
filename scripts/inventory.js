/* Formats the inventory and appends it to the INVENTORY section */

import { game, cloneObject, mergeObjects } from "./utils.js";

export const Item = class {
    constructor(id, name, weight, count, maxCount) {
        this.id = id != null ? id : (() => {console.log(game.itemId); return game.itemId++;})();
        this.name = name != null ? name : "item";
        this.weight = weight != null ? weight : 1;
        this.count = count != null ? count : 1;
        this.maxCount = maxCount != null ? maxCount : -1;
        this.type = "item";
    }
    static params = ["id", "name", "weight", "count", "maxCount"];

    deplete(count = 1) {
        if (this.count == -1) return count;
        let depleted = (count == -1 ? this.count : Math.min(count, this.count));
        this.count -= depleted;
        return depleted;
    }

    onclick(item) {}

    replenish(count = 1) {
        if (this.maxCount == -1) {
            if (this.count == -1) return 0;
            this.count += count;
            return count;
        }
        let replenished = (count == -1 ? this.maxCount - this.count : Math.min(count, this.maxCount - this.count));
        this.count += replenished;
        return replenished;
    }

    static mergeLikeItems(item1, item2) {
        // note: this method WILL modify both parameters
        if (item1.type != item2.type) return;
        let merged = item1.replenish(item2.count);
        item2.deplete(merged);
    }

    static createItemType(name, weight, maxCount) {
        return class extends Item {
            constructor(id, count) {
                super(id, name, weight, count, maxCount);
                this.type = name;
            }
            static params = ["id", "count"];
        }
    }
};

export const Weapon = class extends Item {
    constructor(id, name, damage, weight) {
        super(id, name, weight, 1, 1);
        this.damage = damage;
        this.type = "weapon";
    }
    static params = ["id", "name", "damage", "weight"];

    onclick(item) {
        if (game.equipment.weapon != item.id) {
            $(`#inv-item-${game.equipment.weapon}`).removeClass("equipped");
            $(`#inv-item-${item.id}`).addClass("equipped");
            game.equipment.weapon = item.id;
        }
    }

    static createWeaponType(name, damage, weight) {
        return class extends Weapon {
            constructor(id) {
                super(id, name, damage, weight);
                this.type = name;
            }
            static params = ["id"];
        }
    }
};

export const ItemList = {
    item: Item,
    weapon: Weapon,
    coin: Item.createItemType("coin", 0, 10),
    stick: Weapon.createWeaponType("stick", 5, 5), // found at 15% home progress
    knife: Weapon.createWeaponType("knife", 10, 10), // sold in grocery store
    sword: Weapon.createWeaponType("sword", 20, 15), // idk
};

function createInventoryElement(div, item) {
    // Gotta be careful with these... 
    $(div).append(`<div class="inv-item" id="inv-item-${item.id}"><span class="inv-item-name">${item.name.toUpperCase().replace(/[^\w]+/g, "")} - </span><span class="inv-item-amount">${item.count}</span>${item.price > 0 ? `<span class="inv-item-cost"> - COST: ${item.price}</span>` : ""}</div>`);
    $(`#inv-item-${item.id}`).on("click", () => item.onclick(item));
}

function editInventoryElement(item) {
    $(`#inv-item-${item.id}`).html(`<span class="inv-item-name">${item.name.toUpperCase().replace(/[^\w]+/g, "")} - </span><span class="inv-item-amount">${item.count}</span>${item.cost > 0 ? `<span class="inv-item-cost> - COST: ${cost}</span>` : ""}`);
}

function deleteInventoryElement(item) {
    $(`#inv-item-${item.id}`).remove();
}

export const Inventory = class {
    constructor(items = [], mods = {}) {
        this.mods = mods;
        this.items = [];
        items.forEach(item => this.addItem(item.constructor.name == "Object" ? cloneObject(item, ItemList[item.type]) : item));
        this.totalWeight = 0; // tbd
        mergeObjects(mods, {renderDiv: null});
    }
    static params = ["items", "mods"];

    get length() {
        return this.items.length;
    }

    get weight() {
        return this.totalWeight;
    }

    find(type) {
        if (typeof type == "object") type = type.type;
        let countedItems = [], totalCount = 0;
        for (let i in this.items) {
            if (this.items[i].type == type) {
                countedItems.push([this.items[i], i]);
                totalCount += this.items[i].count;
            }
        }
        return [countedItems, totalCount];
    }

    findById(id) {
        for (let i in this.items) {
            if (this.items[i].id == id) {
                return [this.items[i], i];
            }
        }
        return null;
    }

    addItem(item, stack = true) {
        if (stack) {
            let existing = this.find(item);
            if (existing[1]) {
                Item.mergeLikeItems(existing[0][existing[0].length - 1][0], item);
                editInventoryElement(existing[0][existing[0].length - 1][0]);
            }
        }
        if (item.count) {
            this.items.push(item);
            createInventoryElement(this.mods.renderDiv, item);
        }
    }

    removeItem(item, strict = false) {
        if (strict) {
            let foundItem = this.findById(item.id);
            if (!foundItem) return false;
            this.items.splice(foundItem[1], 1);
            deleteInventoryElement(foundItem[0]);
            return true;
        } else {
            let existing = this.find(item);
            if (item.count > existing[1]) return false;
            let index = existing[0].length - 1;
            while (item.count) {
                existing[0][index][0].deplete(item.deplete(existing[0][index][0].count));
                if (existing[0][index][0].count == 0) {
                    this.items.splice(existing[0][index][1], 1);
                    deleteInventoryElement(existing[0][index][0]);
                } else {
                    editInventoryElement(existing[0][index][0]);
                }
                index--;
            }
            return true;
        }
    }
}