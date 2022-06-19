import Vampire from '../Characters/Vampire';

test('check tooltip', () => {
  const vampire = new Vampire(1, 'bowman');
  const tooltip = `\u{1F396}${vampire.level}\u{2694}${vampire.attack}\u{1F6E1}${vampire.defence}\u{2764}${vampire.health}`;
  const expected = '\u{1F396}1\u{2694}25\u{1F6E1}25\u{2764}50';
  expect(tooltip).toEqual(expected);
});
