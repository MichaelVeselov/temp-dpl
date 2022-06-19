import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';

jest.mock('../GamePlay');

beforeEach(() => {
  jest.resetAllMocks();
});

test('checking GameStateService for error #1', () => {
  const stateService = new GameStateService(null);

  expect(stateService.load).toThrowError(new Error('Invalid state'));
});

test('checking GameStateService for error #2', () => {
  const stateService = new GameStateService();
  const mock = jest.fn(() => GamePlay.showError('Invalid state'));

  try {
    stateService.load();
  } catch (err) {
    mock();
  }

  expect(mock).toHaveBeenCalled();
});
