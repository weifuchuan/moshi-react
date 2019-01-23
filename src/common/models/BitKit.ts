export default class BitKit {
  static at(num: number, i: number) {
    return (num & (1 << i)) == 0 ? 0 : 1;
  }
}