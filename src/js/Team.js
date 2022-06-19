/* eslint-disable no-restricted-syntax */
export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(data) {
    if (this.members.has(data)) {
      throw new Error('Такой персонаж уже есть в команде');
    } else {
      this.members.add(data);
    }
  }

  addAll(...data) {
    data.forEach((elem) => {
      this.members.add(elem);
    });
  }

  delete(elem) {
    this.members.delete(elem);
  }

  toArray() {
    return Array.from(this.members);
  }

  *[Symbol.iterator]() {
    for (const char of this.members) {
      yield char;
    }
  }
}
