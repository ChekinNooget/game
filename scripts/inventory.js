/* Formats the inventory and appends it to the INVENTORY section */

import { cloneObject } from "./utils.js";

export const Item = class {
    constructor(name, weight, count) {
        this.name = name;
        this.weight = weight;
        this.count = count;
        this.stackable = true;
        this.type = "item";
    }
    static params = ["name", "weight", "count"];

    deplete(count = 1) {
        if (this.count == -1) return count;
        let depleted = (count == -1 ? this.count : Math.min(count, this.count));
        this.count -= depleted;
        return depleted;
    }

    replenish(count = 1) {
        if (!this.stackable) return 0;
        this.count += count;
        return count;
    }

    onclick() {
        return;
    }

    static createItemType(name, weight) {
        return class extends Item {
            constructor(count) {
                super(name, weight, count);
                this.type = name;
            }
            static params = ["count"];
        }
    }
};

export const Weapon = class extends Item {
    constructor(name, damage, weight) {
        super(name, weight, 1);
        this.damage = damage;
        this.stackable = false;
        this.type = "weapon";
    }
    static params = ["name", "damage", "weight"];

    static createWeaponType(name, damage, weight) {
        return class extends Weapon {
            constructor() {
                super(name, damage, weight);
                this.type = name;
            }
            static params = [];
        }
    }
};

export const ItemList = {
    item: Item,
    weapon: Weapon,
    coin: Item.createItemType("coin", 0),
    stick: Weapon.createWeaponType("stick", 5, 5), // found at 15% home progress
    knife: Weapon.createWeaponType("knife", 10, 10), // sold in grocery store
    sword: Weapon.createWeaponType("sword", 20, 15), // idk
};

function returnInventoryContent(name, amount, func = () => {}) {
    // Gotta be careful with these... 
    return `<div class="inv-item" onclick=${func}><span class="inv-item-name">${name.toUpperCase().replace(/[^\w]+/g, "")} - </span><span class="inv-item-amount">${(typeof amount === "number") ? amount : 0}</span></div>`;
}

export const Inventory = class {
    constructor(renderId = null, stack = {}, unstack = []) {
        this.stackableItems = stack;
        Object.values(this.stackableItems).forEach(item => {if (item.constructor.name == "Object") this.stackableItems[item.name] = cloneObject(item, ItemList[item.type]);});
        this.unstackableItems = unstack;
        this.unstackableItems.map(item => item.constructor.name == "Object" ? cloneObject(item, ItemList[item.type]) : item);
        this.totalWeight = 0; // tbd
        this.renderId = renderId;
    }
    /*
    setStackable(stack) {
        this.stackableItems = stack;
        this.stackableItems.map(item => item.constructor.name == "Object" ? cloneObject(item, ItemList[item.type]) : item);
    }
    setUnstackable(unstack) {
        this.unstackableItems = unstack;
        this.unstackableItems.map(item => item.constructor.name == "Object" ? cloneObject(item, ItemList[item.type]) : item);
    }
        */
    static params = ["renderId", "stackableItems", "unstackableItems"];

    get length() {
        let len = 0;
        Object.values(this.stackableItems).forEach((item) => {
            if (item.count) len++;
        });
        return len += this.unstackableItems.length;
    }
    get weight() {
        return this.totalWeight;
    }
    quantityOf(name) {
        if (this.stackableItems[name] == undefined) return 0;
        return this.stackableItems[name].count;
    }

    contains(item) {
        if (typeof item == "string") {
            if (this.stackableItems[item] != null && this.stackableItems[item].count) return this.stackableItems[item];
            for (i in this.unstackableItems) {
                if (this.unstackableItems[i].name == item) {
                    return this.unstackableItems[i];
                }
            } return null;
        } else if (item.stackable) {
            if (this.stackableItems[item.name] == undefined) {
                return null;
            } else {
                return (this.stackableItems[item.name].count >= item.count ? this.stackableItems[item.name] : null);
            }
        } else {
            for (i in this.unstackableItems) {
                if (this.unstackableItems[i].name == item.name) {
                    return this.unstackableItems[i];
                }
            } return null;
        }
    }

    addItem(item) {
        if (item.stackable) {
            if (this.stackableItems[item.name] == undefined) {
                this.stackableItems[item.name] = cloneObject(item, ItemList[item.type]);
            } else {
                this.stackableItems[item.name].replenish(item.count);
            }
        } else {
            this.unstackableItems.push(cloneObject(item, ItemList[item.type]));
        }
        this.renderInventory();
    }

    removeItem(item) {
        if (typeof item == "object") {
            if (item.stackable)
            this.stackableItems[item.name].deplete(item.count);
        } else if (typeof item == "string") {
            this.stackableItems[item].deplete(-1);
        } else if (typeof item == "number") {
            this.unstackableItems.splice(item, 1);
        }
        this.renderInventory();
    }

    renderInventory() {
        if (this.renderId == null) return;
        if ($(this.renderId).css("display") == "none") return;
        let newHTML = "";
        Object.values(this.stackableItems).forEach((item) => {
            if (item.count == 0) return;
            newHTML += returnInventoryContent(item.name, item.count, item.onclick);
        });
        this.unstackableItems.forEach((item) => {
            newHTML += returnInventoryContent(item.name, 1, item.onclick);
        });
        $(this.renderId).html(newHTML);
    }
}