export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"

    if (new.target.name === 'Character') {
      throw new Error(
        `The new instance of the class "Character" can't be created.`
      );
    }
  }

  levelUp() {
    this.level += 1;
    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }

    this.attack = Math.max(
      this.attack,
      Math.round(this.attack * (0.8 + this.health / 100))
    );

    this.defence = Math.max(
      this.defence,
      Math.round(this.defence * (0.8 + this.health / 100))
    );
  }
}
