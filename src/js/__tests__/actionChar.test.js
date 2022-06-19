import PositionedCharacter from '../PositionedCharacter';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import Bowman from '../Characters/Bowman';

describe('check action character', () => {
  const bowmanPos = new PositionedCharacter(new Bowman(1, 'bowman'), 35);
  const gameContr = new GameController(new GamePlay());

  test('check move #1', () => {
    const received = gameContr.checkMove(35, 37, bowmanPos);
    expect(received).toBeTruthy();
  });

  test('check move #2', () => {
    const received = gameContr.checkMove(35, 29, bowmanPos);
    expect(received).toBeFalsy();
  });

  test('check move #3', () => {
    const received = gameContr.checkMove(35, 33, bowmanPos);
    expect(received).toBeTruthy();
  });

  test('check move #4', () => {
    const received = gameContr.checkMove(35, 17, bowmanPos);
    expect(received).toBeTruthy();
  });

  test('check attack #1', () => {
    const received = gameContr.checkAttack(35, 37, bowmanPos);
    expect(received).toBeTruthy();
  });

  test('check attack #2', () => {
    const received = gameContr.checkAttack(35, 10, bowmanPos);
    expect(received).toBeFalsy();
  });

  test('check attack #3', () => {
    const received = gameContr.checkAttack(35, 20, bowmanPos);
    expect(received).toBeTruthy();
  });
});
