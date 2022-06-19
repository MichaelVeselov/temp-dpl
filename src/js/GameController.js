import Bowman from './Characters/Bowman.js';
import Swordsman from './Characters/Swordsman.js';
import Magician from './Characters/Magician.js';
import Daemon from './Characters/Daemon.js';
import Undead from './Characters/Undead.js';
import Vampire from './Characters/Vampire.js';
import { generateTeam } from './generators.js';
import PositionedCharacter from './PositionedCharacter.js';
import Team from './Team.js';
import themes from './themes.js';
import cursors from './cursors.js';
import GameState from './GameState.js';
import GamePlay from './GamePlay.js';

const playerHeroesStartPositions = [
  0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57,
]; // стартовые клетки для персонажей игрока
const computerHeroesStartPosition = [
  6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63,
]; // стартовые клетки для персонажей компьютера

const playerHeroes = [Bowman, Swordsman, Magician]; // список персонажей игрока
const computerHeroes = [Daemon, Undead, Vampire]; // список персонажей компьютера

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = new Team();
    this.computerTeam = new Team();
    this.heroes = [];
    this.counter = 0;
    this.indexChar = null;
    this.indexCursor = null;
    this.gameLevel = 1;
    this.points = 0;
    this.pointsTotal = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie); // нарисовали доску

    this.playerTeam.addAll(...generateTeam([Bowman, Swordsman], 1, 2)); // сгенерировали команду игрока

    this.computerTeam.addAll(...generateTeam(computerHeroes, 1, 2)); // сгенерировали комнаду компьютера

    this.getTeamPositioned(this.playerTeam, playerHeroesStartPositions); // получили стартовые позиции для персонажей команды игрока

    this.getTeamPositioned(this.computerTeam, computerHeroesStartPosition); // получили стартовые позиции для персонажей команды компьютера

    this.gamePlay.redrawPositions(this.heroes); // перерисовываем доску

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)); // навели курсор
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)); // убрали курсор
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this)); // кликнули по ячейке
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this)); // кликнули по кнопке "новая игра"
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this)); // кликнули по кнопке "сохранить игру"
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this)); // кликнули по кнопке "загрузить игру"
  }

  // запрашиваем стартовые позиции и возвращаем массив с персонажами и позициями
  getTeamPositioned(team, positions) {
    for (const member of team) {
      const position = this.getRandomPosition(positions);
      const memberPositioned = new PositionedCharacter(member, position);
      this.heroes.push(memberPositioned);
    }
    return this.heroes;
  }

  getRandomPosition(positions) {
    let position = positions[Math.floor(Math.random() * positions.length)];

    while (this.checkRandomPosition(position)) {
      position = positions[Math.floor(Math.random() * positions.length)];
    }
    return position;
  }

  checkRandomPosition(position) {
    return this.heroes.some((item) => item.position === position);
  }

  findHero(index) {
    return this.heroes.find((item) => item.position === index);
  }

  checkMove(indexChar, index, char) {
    const arr = this.calculateMove(indexChar, char);
    return arr.includes(index);
  }

  calculateMove(indexChar, char) {
    const dist = char.character.distance;
    const field = this.gamePlay.boardSize;
    const left = [0, 8, 16, 24, 32, 40, 48, 56];
    const right = [7, 15, 23, 31, 39, 47, 55, 63];
    const result = [];

    for (let i = 1; i <= dist; i += 1) {
      result.push(indexChar + field * i);
      result.push(indexChar - field * i);
    }

    for (let i = 1; i <= dist; i += 1) {
      if (left.includes(indexChar)) {
        break;
      }

      result.push(indexChar - i);
      result.push(indexChar - (field * i + i));
      result.push(indexChar + (field * i - i));

      if (left.includes(indexChar - i)) {
        break;
      }
    }

    for (let i = 1; i <= dist; i += 1) {
      if (right.includes(indexChar)) {
        break;
      }

      result.push(indexChar + i);
      result.push(indexChar - (field * i - i));
      result.push(indexChar + (field * i + i));

      if (right.includes(indexChar + i)) {
        break;
      }
    }

    return result.filter((value) => value >= 0 && value <= 63);
  }

  checkAttack(indexChar, index, char) {
    const arr = this.calculateAttack(indexChar, char);
    return arr.includes(index);
  }

  calculateAttack(indexChar, char) {
    const dist = char.character.attackRange;
    const field = this.gamePlay.boardSize;
    const left = [0, 8, 16, 24, 32, 40, 48, 56];
    const right = [7, 15, 23, 31, 39, 47, 55, 63];
    const result = [];

    for (let i = 1; i <= dist; i += 1) {
      result.push(indexChar + field * i);
      result.push(indexChar - field * i);
    }

    for (let i = 1; i <= dist; i += 1) {
      if (left.includes(indexChar)) {
        break;
      }

      result.push(indexChar - i);
      for (let j = 1; j <= dist; j += 1) {
        result.push(indexChar - i + field * j);
        result.push(indexChar - i - field * j);
      }

      if (left.includes(indexChar - i)) {
        break;
      }
    }

    for (let i = 1; i <= dist; i += 1) {
      if (right.includes(indexChar)) {
        break;
      }

      result.push(indexChar + i);
      for (let j = 1; j <= dist; j += 1) {
        result.push(indexChar + i + field * j);
        result.push(indexChar + i - field * j);
      }

      if (right.includes(indexChar + i)) {
        break;
      }
    }

    return result.filter((value) => value >= 0 && value <= 63);
  }

  checkWin() {
    if (this.gameLevel === 4 && this.computerTeam.members.size === 0) {
      this.scoring();
      this.pointsTotal.push(this.points);
      GamePlay.showMessage(
        `YOU WIN!!! Total points ${this.points}, Record points ${Math.max(
          this.pointsTotal
        )}`
      );
      this.gameLevel += 1;
    }

    if (this.computerTeam.members.size === 0 && this.gameLevel <= 3) {
      this.gameLevel += 1;
      GamePlay.showMessage(`Level ${this.gameLevel}!`);
      this.scoring();
      this.getLevelUp();
    }

    if (this.playerTeam.members.size === 0) {
      this.pointsTotal.push(this.ponts);
      GamePlay.showMessage(
        `YOU LOSE! Total points ${this.points}, Record points ${Math.max(
          this.pointsTotal
        )}`
      );
    }
  }

  getLevelUp() {
    this.heroes = [];
    this.playerTeam.members.forEach((char) => char.levelUp());

    if (this.gameLevel === 2) {
      this.gamePlay.drawUi(themes.desert);
      this.playerTeam.addAll(...generateTeam(playerHeroes, 1, 1));
      this.computerTeam.addAll(
        ...generateTeam(computerHeroes, 2, this.playerTeam.members.size)
      );
    }

    if (this.gameLevel === 3) {
      this.gamePlay.drawUi(themes.arctic);
      this.playerTeam.addAll(...generateTeam(playerHeroes, 2, 2));
      this.computerTeam.addAll(
        ...generateTeam(computerHeroes, 3, this.playerTeam.members.size)
      );
    }

    if (this.gameLevel === 4) {
      this.gamePlay.drawUi(themes.mountain);
      this.playerTeam.addAll(...generateTeam(playerHeroes, 3, 2));
      this.computerTeam.addAll(
        ...generateTeam(computerHeroes, 4, this.playerTeam.members.size)
      );
    }

    this.getTeamPositioned(this.playerTeam, playerHeroesStartPositions);
    this.getTeamPositioned(this.computerTeam, computerHeroesStartPosition);
    this.gamePlay.redrawPositions(this.heroes);
  }

  enterAttack(index) {
    const attacker = this.findHero(this.indexChar).character;
    const target = this.findHero(index).character;
    const damage = Math.max(
      attacker.attack - target.defence,
      attacker.attack * 0.1
    );

    this.gamePlay
      .showDamage(index, damage)
      .then(() => {
        target.health -= damage;
        if (target.health <= 0) {
          this.heroes.splice(this.heroes.indexOf(this.findHero(index)), 1);
          this.playerTeam.delete(target);
          this.computerTeam.delete(target);
        }
      })
      .then(() => {
        this.gamePlay.redrawPositions(this.heroes);
        this.checkWin();
        this.botPlaying();
      })
      .catch((err) => {
        GamePlay.showError(err);
      });
  }

  scoring() {
    this.points += this.playerTeam.toArray().reduce((a, b) => a + b.health, 0);
  }

  botPlaying() {
    if (this.counter !== 1 || this.computerTeam.members.size === 0) {
      return;
    }

    const botCommand = this.heroes.filter(
      (item) =>
        item.character instanceof Vampire ||
        item.character instanceof Daemon ||
        item.character instanceof Undead
    );
    const userCommand = this.heroes.filter(
      (item) =>
        item.character instanceof Bowman ||
        item.character instanceof Swordsman ||
        item.character instanceof Magician
    );
    let bot = null;
    let target = null;

    botCommand.forEach((item) => {
      const botAttack = this.calculateAttack(item.position, item);
      userCommand.forEach((val) => {
        if (botAttack.includes(val.position)) {
          bot = item;
          target = val;
        }
      });
    });

    if (target) {
      // eslint-disable-next-line max-len
      const damage = Math.max(
        bot.character.attack - target.character.defence,
        bot.character.attack * 0.1
      );
      this.gamePlay
        .showDamage(target.position, damage)
        .then(() => {
          target.character.health -= damage;
          if (target.character.health <= 0) {
            this.heroes.splice(
              this.heroes.indexOf(this.findHero(target.position)),
              1
            );
            this.playerTeam.delete(target.character);
            this.computerTeam.delete(target.character);
          }
        })
        .then(() => {
          this.gamePlay.redrawPositions(this.heroes);
          this.checkWin();
        })
        .catch((err) => {
          GamePlay.showError(err);
        });
    } else {
      bot = botCommand[Math.floor(Math.random() * botCommand.length)];
      const botMove = this.calculateMove(bot.position, bot);
      this.findHero(bot.position).position = this.getRandomPosition(botMove);
      this.gamePlay.redrawPositions(this.heroes);
    }

    this.counter = 0;
  }

  onNewGameClick() {
    this.playerTeam = new Team();
    this.computerTeam = new Team();
    this.heroes = [];
    this.counter = 0;
    this.indexChar = null;
    this.indexCursor = null;
    this.gameLevel = 1;
    this.points = 0;

    this.gamePlay.drawUi(themes.prairie);

    this.playerTeam.addAll(...generateTeam([Bowman, Swordsman], 1, 2));
    this.computerTeam.addAll(...generateTeam(computerHeroes, 1, 2));
    this.getTeamPositioned(this.playerTeam, playerHeroesStartPositions);
    this.getTeamPositioned(this.computerTeam, computerHeroesStartPosition);

    this.gamePlay.redrawPositions(this.heroes);
  }

  onSaveGameClick() {
    const savedGame = {
      command: this.heroes,
      gameLevel: this.gameLevel,
      counter: this.counter,
      points: this.points,
      pointsTotal: this.pointsTotal,
    };
    this.stateService.save(GameState.from(savedGame));
    GamePlay.showMessage('GAME SAVED');
  }

  onLoadGameClick() {
    GamePlay.showMessage('LOADING...');
    const load = this.stateService.load();
    this.gameLevel = load.gameLevel;
    this.counter = load.counter;
    this.points = load.points;
    this.pointsTotal = load.pointsTotal;

    this.playerTeam = new Team();
    this.computerTeam = new Team();

    this.heroes = load.command.map((item) => {
      let char;
      const {
        character: { level, type, health, attack, defence },
        position,
      } = item;
      switch (type) {
        case 'bowman':
          char = new Bowman(level);
          break;
        case 'swordsman':
          char = new Swordsman(level);
          break;
        case 'magician':
          char = new Magician(level);
          break;
        case 'vampire':
          char = new Vampire(level);
          break;
        case 'undead':
          char = new Undead(level);
          break;
        default:
          char = new Daemon(level);
      }

      char.health = health;
      char.attack = attack;
      char.defence = defence;

      if (type === 'bowman' || type === 'swordsman' || type === 'magician') {
        this.playerTeam.add(char);
      } else {
        this.computerTeam.add(char);
      }

      return new PositionedCharacter(char, position);
    });

    switch (this.gameLevel) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;
      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;
      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;
      default:
        this.gamePlay.drawUi(themes.mountain);
        break;
    }

    this.gamePlay.redrawPositions(this.heroes);
  }

  onCellClick(index) {
    if (this.gameLevel === 5 || this.playerTeam.members.size === 0) {
      return;
    }

    if (this.counter === 1) {
      GamePlay.showMessage('Its not you turn!');
      return;
    }

    if (this.findHero(index)) {
      if (
        playerHeroes.some(
          (item) => this.findHero(index).character instanceof item
        )
      ) {
        if (this.indexChar === null) {
          this.indexChar = index;
        } else {
          this.gamePlay.deselectCell(this.indexChar);
          this.gamePlay.deselectCell(this.indexCursor);
        }
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index);
        this.indexChar = index;
      } else if (this.indexChar === null) {
        GamePlay.showError('Its not you Character');
      }
    }

    if (this.indexChar !== null) {
      if (
        this.checkMove(this.indexChar, index, this.findHero(this.indexChar)) &&
        !this.findHero(index)
      ) {
        this.findHero(this.indexChar).position = index;
        this.gamePlay.deselectCell(this.indexChar);
        this.gamePlay.deselectCell(this.indexCursor);
        this.indexChar = null;
        this.counter = 1;
        this.gamePlay.redrawPositions(this.heroes);
        this.botPlaying();
      }

      if (
        this.findHero(index) &&
        computerHeroes.some(
          (item) => this.findHero(index).character instanceof item
        ) &&
        this.checkAttack(this.indexChar, index, this.findHero(this.indexChar))
      ) {
        this.enterAttack(index);
        this.gamePlay.deselectCell(this.indexChar);
        this.gamePlay.deselectCell(this.indexCursor);
        this.indexChar = null;
        this.counter = 1;
        this.gamePlay.setCursor(cursors.auto);
      }

      if (
        this.indexChar !== index &&
        this.gamePlay.boardEl.style.cursor === 'not-allowed'
      ) {
        GamePlay.showMessage('Action not allowed!');
      }
    }
    // TODO: react to click
  }

  onCellEnter(index) {
    if (this.findHero(index)) {
      const char = this.findHero(index).character;
      const message = `\u{1F396}${char.level}\u{2694}${char.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
    // TODO: react to mouse enter
    if (this.indexChar !== null) {
      this.gamePlay.setCursor(cursors.notallowed);
      if (this.indexCursor === null) {
        this.indexCursor = index;
      } else if (this.indexChar !== this.indexCursor) {
        this.gamePlay.deselectCell(this.indexCursor);
      }

      if (
        this.findHero(index) &&
        playerHeroes.some(
          (item) => this.findHero(index).character instanceof item
        )
      ) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (this.indexChar !== index) {
        if (
          !this.findHero(index) &&
          this.checkMove(this.indexChar, index, this.findHero(this.indexChar))
        ) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
          this.indexCursor = index;
        }

        if (
          this.findHero(index) &&
          computerHeroes.some(
            (item) => this.findHero(index).character instanceof item
          ) &&
          this.checkAttack(this.indexChar, index, this.findHero(this.indexChar))
        ) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.indexCursor = index;
        }
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    // TODO: react to mouse leave
  }
}
