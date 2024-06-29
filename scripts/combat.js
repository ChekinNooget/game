/* Concept (?) of combat mechanisms */
import data from "../data/enemies.json" with {type: "json"};
console.log(data);

export const Enemy = class {
  constructor (name, health, damage) {
    this.name = name;
    this.health = health;
    this.damage = damage;
  }
}

/*
// cursed syntax lol
const Fruit = class extends Enemy {
  static fruitNames = ["apple", "banana", "orange", "pear", "watermelon", "blueberry", "raspberry", "blackberry", "grape", "cherry"]
  constructor () {
    super(
      fruitNames[Math.floor(Math.random() * fruitNames.length)],
      Math.floor(Math.random() * 11) + 10,
      Math.floor(Math.random() * 6) + 5
    );
  }
}
*/

export const generateEnemy = enemyTypes => {
  // i hate how this has O(mn) time complexity
  let enemyIds = [];
  for (key in data) {
    if (data[key].type in enemyTypes) {
      enemyIds.push(key);
    }
  }

  let chosenId = enemyIds[Math.floor(Math.random() * enemyIds.length)];
  return new Enemy(chosenId, data[chosenId].health, data[chosenId].damage);
}