import { Inventory, ItemList } from "./inventory.js";

export const Shop = class {
    constructor() {
        this.items = new Inventory("#shop-contents");
        this.prices = {};
    }

    addItem(item, price = -1) {
        this.items.addItem(item);
        if (this.prices[item.name] == null)
            this.prices[item.name] = new ItemList.coin(price);
    }

    purchaseItem(item, game) {
        // okay i don't regret spending so much time on my inventory implementation now
        item = this.items.contains(item);
        if (item == null) return false;
        if (!game.inventory.contains(this.prices[item.name])) return false;
        game.inventory.addItem(item);
        game.inventory.removeItem(this.prices[item.name]);
        this.items.removeItem(item);
    }
};