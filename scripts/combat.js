const Enemy = class {
  constructor (name, health, damage) {
    this.name = name;
    this.health = health;
    this.damage = damage;
  }
}

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
