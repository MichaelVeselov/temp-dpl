import { calcTileType } from '../utils';

describe('check function calcTileType', () => {
  test('#1', () => {
    expect(calcTileType(0, 8)).toEqual('top-left');
  });
  test('#2', () => {
    expect(calcTileType(2, 8)).toEqual('top');
  });
  test('#3', () => {
    expect(calcTileType(7, 8)).toEqual('top-right');
  });
  test('#4', () => {
    expect(calcTileType(16, 8)).toEqual('left');
  });
  test('#5', () => {
    expect(calcTileType(20, 8)).toEqual('center');
  });
  test('#6', () => {
    expect(calcTileType(23, 8)).toEqual('right');
  });
  test('#7', () => {
    expect(calcTileType(56, 8)).toEqual('bottom-left');
  });
  test('#8', () => {
    expect(calcTileType(58, 8)).toEqual('bottom');
  });
  test('#9', () => {
    expect(calcTileType(63, 8)).toEqual('bottom-right');
  });
});
