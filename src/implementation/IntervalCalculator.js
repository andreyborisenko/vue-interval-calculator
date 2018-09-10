import Interval from "./Interval";

export default class IntervalCalculator {
  static operation(handle, ...intervals) {
    IntervalCalculator.checkTypes(...intervals);

    const methods = Object.getOwnPropertyNames(IntervalCalculator).filter(
      prop => typeof IntervalCalculator[prop] === "function"
    );

    if (methods.includes(handle)) {
      return IntervalCalculator[handle](...intervals);
    } else {
      throw new Error(`No such operation ${handle}`);
    }
  }

  static checkTypes(...intervals) {
    for (let interval of intervals) {
      if (!(interval instanceof Interval)) {
        throw new Error(
          "Some of passed parameters aren`t instances of Interval"
        );
      }
    }
  }

  static add(a, b) {
    return new Interval(a.x + b.x, a.y + b.y);
  }

  static substract(a, b) {
    return new Interval(a.x - b.y, a.y - b.x);
  }

  static asInterval(digit) {
    return new Interval(digit, digit);
  }

  static max(...intervals) {
    const x = Math.max(...intervals.map(int => int.x)),
      y = Math.max(...intervals.map(int => int.y));

    return new Interval(x, y);
  }

  static min(...intervals) {
    const x = Math.min(...intervals.map(int => int.x)),
      y = Math.min(...intervals.map(int => int.y));

    return new Interval(x, y);
  }

  static multiply(...intervals) {
    let variants = [];

    for (let i = 0; i < intervals.length; i++) {
      for (let j = 0; j < intervals.length; j++) {
        if (i === j) continue;

        let currentVariants = [
          intervals[i].x * intervals[j].x,
          intervals[i].x * intervals[j].y,
          intervals[i].y * intervals[j].x,
          intervals[i].y * intervals[j].y
        ];

        variants.push(...currentVariants);
      }
    }

    return new Interval(Math.min(...variants), Math.max(...variants));
  }

  static divide(a, b) {
    const variants = [a.x / b.x, a.x / b.y, a.y / b.x, a.y / b.y];

    return new Interval(Math.min(...variants), Math.max(...variants));
  }

  // Divide hypothes failed
  static divideHypo(a, b) {
    return new Interval(a.x / b.y, a.y / b.x);
  }
}
