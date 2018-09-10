export default class Interval {
  constructor(x, y) {
    if ((x !== 0 && !x) || (y !== 0 && !y))
      throw new Error("You must specify both x and y");

    this.setLimits(x, y);
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = +value;
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = +value;
  }

  setLimits(x, y) {
    if (x > y) throw new Error("First param should be lower than second");

    this.x = x;
    this.y = y;
  }

  inverse() {
    let newInterval;

    if (!this.x || !this.y) throw new Error(`Division by zero in ${this}`);

    try {
      newInterval = new Interval(
        (1 / this.y).toFixed(4),
        (1 / this.x).toFixed(4)
      );

      return newInterval;
    } catch (e) {
      throw new Error(`Inversion is failed for ${this}`);
    }
  }

  reverse() {
    return new Interval(-this.y, -this.x);
  }

  multiplyBy(value) {
    if (value < 0) {
      console.log(
        `Failde multiply ${this} by ${value}. Value must be greater than null`
      );
      return this;
    }

    return new Interval(this.x * value, this.y * value);
  }

  divideBy(value) {
    if (value < 0) {
      console.log(
        `Failed divide ${this} by ${value}. Value must be greater than null`
      );
      return this;
    }

    return new Interval(
      (this.x / value).toFixed(4),
      (this.y / value).toFixed(4)
    );
  }
}

Interval.prototype.toString = function() {
  return `[${this.x}, ${this.y}]`;
};
