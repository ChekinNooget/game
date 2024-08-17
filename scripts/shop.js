import { Inventory, ItemList } from "./inventory.js";
import { game, cloneObject } from "./utils.js";

export const Shop = class {
    constructor(name = "", prices = {}) {
        this.name = name;
        this.items = new Inventory([], {renderDiv: "#shop-contents"});
        this.prices = prices;
    }

    getCost(item) {
        return this.prices[item.type];
    }

    addItem(item) {
        item.price = this.prices[item.type];
        item.onclick = (item_) => {
            groceryShop.purchaseItem(item_);
        }
        this.items.addItem(item, false);
    }

    purchaseItem(item) {
        // okay i don't regret spending so much time on my inventory implementation now
        if (item == null) return false;
        if (game.inventory.find("coin")[1] < item.price) return false;
        this.items.removeItem(item, true);
        game.inventory.addItem(cloneObject(item, ItemList[item.type]));
        game.inventory.removeItem(new ItemList.coin(-1, this.prices[item.name]));
    }
};

export const groceryShop = new Shop("groceryShop", {"stick": 5, "knife": 15, "sword": 50});