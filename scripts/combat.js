/* Concept (?) of combat mechanisms */
import data from "../data/enemies.json" with {type: "json"};
import { logColors, logMessage, updateMockBattle } from "./utils.js";
console.log(data);

export const Enemy = class {
  constructor (name, health, damage) {
    this.name = name;
    this.health = health;
    this.damage = damage;
  }

  get alive() {
    return this.health > 0;
  }
  takeDamage(dmg) {
    this.health -= dmg;
  }
  toString() {
    return `${this.name}: ${this.health} health, ${this.damage} damage`;
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
  for (let key in data) {
    for (let enemyType in enemyTypes) {
      if (data[key].type == enemyTypes[enemyType]) {
        enemyIds.push(key);
        break;
      }
    }
  }

  let chosenId = enemyIds[Math.floor(Math.random() * enemyIds.length)];
  let enemy = new Enemy(chosenId, data[chosenId].health, data[chosenId].damage);
  return enemy;
}

export const fight = (enemy1, enemy2) => {
  updateMockBattle(enemy1, enemy2);

  let timeoutIds = [];
  let clearTimeouts = () => {
    clearTimeout(timeoutIds[0]);
    clearTimeout(timeoutIds[1]);
  }
  let attack = (e1, e2, timeoutIndex) => setTimeout(() => {
    console.log(e1.name);
    e2.takeDamage(e1.damage);
    updateMockBattle(enemy1, enemy2);
    if (!e2.alive) {
      logMessage(`${e1.name} wins the fight!`, logColors.gold);
      clearTimeouts();
      return;
    }
    timeoutIds[timeoutIndex] = attack(e1, e2, timeoutIndex);
  }, Math.floor(Math.random() * 201) + 900);

  timeoutIds = [attack(enemy1, enemy2, 0), attack(enemy2, enemy1, 1)];
}