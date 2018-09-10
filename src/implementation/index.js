import Interval from "./Interval";
import IntervalCalculator from "./IntervalCalculator";

const aliases = {
  "+": "add",
  "-": "substract",
  "*": "multiply",
  "/": "divide"
};

const priorities = {
  "+": 0,
  "-": 0,
  "*": 1,
  "/": 1
};

export { Interval, IntervalCalculator, aliases, priorities };

// const a = new Interval(-5, 2),
//   b = new Interval(3, 7);

// console.log(
//   "" + a,
//   "" + IntervalCalculator.operation("add", a, b),
//   "" + IntervalCalculator.operation("substract", a, b),
//   "" + IntervalCalculator.operation("max", a, b),
//   "" + IntervalCalculator.operation("min", a, b),
//   "" + IntervalCalculator.operation("multiply", a, b),
//   "" + IntervalCalculator.operation("divide", a, b),
//   "" + IntervalCalculator.asInterval(5),
//   "" + a.inverse(),
//   "" + a.reverse(),
//   "" + a.divideBy(-3),
//   "" + a.multiplyBy(3)
// );

// Divide hypothes failed
// console.log(
//   "" + a,
//   "" + IntervalCalculator.operation("divide", a, b),
//   "" + IntervalCalculator.operation("divideHypo", a, b)
// );
