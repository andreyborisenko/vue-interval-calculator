<template>
  <div class="interval" 
    @mouseover="showActions"
    @mouseleave="hideActions"
    :class="{ 'interval--with-actions': actionsShown }">
    <b-field grouped>
      <b-field>
        <p class="control">
          <span class="button is-static">{{ name }}.x</span>
        </p>
        <b-input type="number"
          v-model="interval.x"
          :max="interval.y"
          class="min-input"
          expanded>
        </b-input>
      </b-field>
      <b-field>
        <p class="control">
          <span class="button is-static">{{ name }}.y</span>
        </p>
        <b-input type="number"
          v-model="interval.y"
          :min="interval.x"
          class="max-input"
          expanded>
        </b-input>
      </b-field>
    </b-field>

    <div class="interval-actions">
      <button class="button is-danger"
        @click="deleteInterval">
        <b-icon icon="close"></b-icon>
      </button>

      <button class="button is-info"
        @click="mutateInterval('inverse')">
        <b-icon icon="swap-vertical"></b-icon>
      </button>
      
      <button class="button is-info"
        @click="mutateInterval('reverse')">
        <b-icon icon="rotate-3d"></b-icon>
      </button>
    </div>
  </div>
</template>

<script>
import { Interval } from "../implementation";
import $ from 'jquery';

export default {
  name: "Interval",
  props: {
    value: {
      type: Interval
    },
    name: {
      type: String
    }
  },
  data() {
    return {
      interval: this.value,
      actionsShown: false,
      focused: false
    }
  },
  methods: {
    deleteInterval() {
      this.$emit('deleteInterval', this.name)
    },
    mutateInterval(mutation, ...params) {
      try {
        const { x, y } = this.interval[mutation](...params)
        this.interval.setLimits(x, y)
      } catch(e) {
        this.$toast.open({
          duration: 5000,
          message: e.message,
          type: 'is-warning',
          position: 'is-bottom'
        })
      }
    },
    showActions() {
      this.focused = true
      setTimeout(() => this.actionsShown = true, 300)
    },
    hideActions() {
      this.focused = false
      setTimeout(() => {
        if (!this.focused) this.actionsShown = false
      }, 600)
    }
  },
  watch: {
    interval: {
      handler(nV, oV){
        this.$el.querySelector('.max-input > .input').min = nV.x; 
        this.$el.querySelector('.min-input > .input').max = nV.y; 
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.control .button {
  min-width: 55px;
}

.field.is-grouped {
  .field {
    flex: 1 1 50%;
  }
}

.interval {
  position: relative;

  &--with-actions {
    .interval-actions {
      left: 100%;
      z-index: 1;
      opacity: 1;
    }
  }
}

.interval-actions {
  position: absolute;
  left: 50%;
  top: -15px;

  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  
  padding: 15px;

  opacity: 0;

  transition: all 300ms;

  .button:not(:first-child) {
    margin-left: 10px;
  }
}
</style>

