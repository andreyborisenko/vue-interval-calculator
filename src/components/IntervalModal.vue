<template>
  <div class="modal-card">
    <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
    </header>
    <section class="modal-card-body">
      <b-field grouped>
        <b-field>
          <p class="control">
            <span class="button is-static">{{ name }}.x</span>
          </p>
          <b-input type="number"
            v-model="interval.x"
            :max="interval.y"
            class="min-input">
          </b-input>
        </b-field>
        <b-field>
          <p class="control">
            <span class="button is-static">{{ name }}.y</span>
          </p>
          <b-input type="number"
            v-model="interval.y"
            :min="interval.x"
            class="max-input">
          </b-input>
        </b-field>
      </b-field>
    </section>
    <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
    </footer>
  </div>
</template>

<script>
import { Interval } from "../implementation";
import IntervalUI from "./Interval";

export default {
  name: "InvervalModal",
  components: {
    IntervalUI
  },
  props: {
    interval: {
      type: Interval
    },
    title: {
      default: "Interval",
      type: String
    }
  },
  mounted() {
    console.log(this);
  },
  computed: {
    name() {
      return this.title.split(' ').shift()
    }
  }
};
</script>

<style>
</style>
