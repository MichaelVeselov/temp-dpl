/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here

  while (true) {
    const rnd = Math.floor(Math.random() * allowedTypes.length);
    yield new allowedTypes[rnd](Math.floor(Math.random() * maxLevel) + 1);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  const hero = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    team.push(hero.next(i).value);
  }

  return team;
}
