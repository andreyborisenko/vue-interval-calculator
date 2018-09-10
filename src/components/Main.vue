<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <section>
            <div v-for="(interval, alias) in intervals" 
              :key="alias" >
              <IntervalUI
                :value="interval"
                :name="alias" 
                @deleteInterval="deleteInterval"
                @input="updateInterval" />
            </div>
            
            <div class="actions">
              <button class="button is-info"
                @click="addInterval"
                :disabled="this.intervalsCount > this.maxIntervals">
                Add interval
              </button>

              <button class="button is-primary"
                @click="findInterval('max')">
                Find max
              </button>
              <button class="button is-primary"
                @click="findInterval('min')">
                Find min
              </button>
            </div>

            <b-field class="expression"
              :type="failedExpression ? 'is-danger' : ''">
              <b-input type="text"
                v-model="expression"
                placeholder="Expression"
                expanded
                @input="validateInput"
                >
              </b-input>
              <p class="control">
                  <button class="button is-primary"
                    :disabled="calculateDisabled"
                    @click="calculateExpression">Calculate</button>
              </p>
            </b-field>
          </section>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { 
  Interval, 
  IntervalCalculator, 
  aliases, 
  priorities 
} from '../implementation';
import IntervalUI from './Interval';
import IntervalModal from './IntervalModal';

export default {
  name: "Main",
  components: {
    IntervalUI,
    IntervalModal
  },
  data() {
    return {
      maxIntervals: 15,
      intervalsCount: 0,
      intervals: {},
      expression: '',
      failedExpression: false,
      calculateDisabled: false
    };
  },
  methods: {
    findInterval(bound) {
      const props = {
        interval: bound == 'max' ? this.getMaxInterval() : this.getMinInterval(),
        title: bound + ' interval'
      }
      this.$modal.open({
        props,
        component: IntervalModal,
        parent: this,
        hasModalCard: true
      })
    },
    calculateExpression() {
      this.expression = this.expression.replace(/\s+/g, '')
      if (!this.validateInput()) return 

      let stack = [], res = ''
      for (let char of this.expression) {
        if (char === '(' || char === ')' || char in aliases) {
          if (char == '(') {
            stack.push(char)
            continue
          }
          if (char == ')') {
            let c = stack.pop()
            while (c != '(') {
              res += c
              c = stack.pop()
             }
            continue
           }
          if (stack.length) {
            let lastOp = stack[stack.length - 1]
            if (priorities[char] <= priorities[lastOp]) {
              stack.pop(lastOp) 
              res += lastOp
             }
           }
          stack.push(char)
        } else {
          res += char.toUpperCase()
        }
      }

      res += stack.reverse().join('')

      stack = []

      for (let char of res) {
        if (char in aliases) {
          let operation = aliases[char],
            a = stack.pop(),
            b = stack.pop()

          a = a in this.intervals ? this.intervals[a] : a
          b = b in this.intervals ? this.intervals[b] : b

          if (char == '-' || char == '/') 
            [a, b] = [b, a]
          stack.push(IntervalCalculator.operation(
            operation, a, b
           ))
        } else {
          stack.push(char)
        }
      }
      this.$modal.open({
        props: {
          interval: stack[0],
          title: 'Result'
        },
        component: IntervalModal,
        parent: this,
        hasModalCard: true
      });
    },
    validateInput() {
      let currentIsInterval = true
      for (let char of this.expression) {
        if (char === '(' || char === ')') continue
        if ((currentIsInterval && !(char.toUpperCase() in this.intervals))
            || (!currentIsInterval && !(char in aliases))) {
          this.failedExpression = true
          this.calculateDisabled = true
          return false
        }
        currentIsInterval = !currentIsInterval
      }

      if (currentIsInterval) {
        this.failedExpression = true
        this.calculateDisabled = true
        return false
      }

      this.failedExpression = false
      this.calculateDisabled = false
      return true
    },
    addInterval() {
      if (this.intervalsCount > this.maxIntervals) {
        return this.$toast.open({
            duration: 5000,
            message: `You can add maximum ${this.maxIntervals} intervals`,
            type: 'is-danger'
        })
      }

      this.intervals[String.fromCharCode(65 + this.intervalsCount++)] = new Interval(0, 0)
    },
    deleteInterval(name) {
      delete this.intervals[name];
      this.intervalsCount--;
      this.rebuildIntervals()
    },
    updateInterval({ name, x, y }) {
      this.intervals[name].setLimits(x, y)
    },
    rebuildIntervals() {
      let newObject = {}, i = 0

      for (let name in this.intervals) {
        newObject[String.fromCharCode(65 + i++)] = this.intervals[name]
      }

      this.intervals = newObject
    },
    getMaxInterval() {
      return IntervalCalculator.max(...Object.values(this.intervals))
    },
    getMinInterval() {
      return IntervalCalculator.min(...Object.values(this.intervals))
    }
  },
  mounted() {
    this.addInterval()
    this.addInterval()
  },
  computed: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.actions {
  display: flex;
  justify-content: flex-start;

  *:not(:first-child) {
    margin-left: 10px;
  }
}

.expression {
  margin-top: 25px;
}
</style>
