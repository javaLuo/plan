import { BigNumber } from 'bignumber.js/bignumber';

export default {
  //X
  multi(x, y) {
    return new BigNumber(x).multipliedBy(new BigNumber(y)).toPrecision();
  },
  //+
  plus(x, y) {
    return new BigNumber(x).plus(new BigNumber(y)).toPrecision();
  },
  //-
  minus(x, y) {
    return new BigNumber(x).minus(new BigNumber(y)).toPrecision();
  },
  // \
  div(x, y) {
    return new BigNumber(x).div(new BigNumber(y)).toPrecision();
  },
  // ==
  isEq(x, y) {
    return new BigNumber(x).isEqualTo(new BigNumber(y));
  },
  // >
  isGt(x, y) {
    return new BigNumber(x).isGreaterThan(new BigNumber(y));
  },
  // >=
  isGtOrEq(x, y) {
    return new BigNumber(x).isGreaterThanOrEqualTo(new BigNumber(y));
  },
  // <
  isLt(x, y) {
    return new BigNumber(x).isLessThan(new BigNumber(y));
  },
  // <=
  isLtOrEq(x, y) {
    return new BigNumber(x).isLessThanOrEqualTo(new BigNumber(y));
  },
  //是负数？
  isN(x) {
    return new BigNumber(x).isNegative();
  },
  //是正数？
  isP(x) {
    return new BigNumber(x).isPositive();
  },
  //是 0 ？
  isZ(x) {
    return new BigNumber(x).isZero();
  },

  toFixed(x) {
    return new BigNumber(x).toFixed(0, 1);
  },
  toFixed2(x) {
    return new BigNumber(x).toFixed(2, 1);
  },
  toFixed4(x) {
    return new BigNumber(x).toFixed(4, 1);
  },
  toFixed8(x) {
    return new BigNumber(x).toFixed(8, 1);
  },
  toNumber(x){
    return new BigNumber(x).toNumber();
  }
};
