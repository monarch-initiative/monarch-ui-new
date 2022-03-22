<template>
  <div class="ring">
    <div>{{ score }}</div>
    <svg viewBox="-50 -50 100 100">
      <circle cx="0" cy="0" r="50" />
      <path :d="d" />
    </svg>
  </div>
</template>

<script lang="ts">
import { sin, cos } from "@/util/math";
import { clamp } from "lodash";
import { defineComponent } from "vue";

// ring/arc with number in middle
export default defineComponent({
  props: {
    // value to show in center of ring
    score: {
      type: Number,
      default: 50,
    },
    // range of score for normalization
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
  },
  computed: {
    // normalized score value
    normalized() {
      let value = (this.score - this.min) / (this.max - this.min);
      // if max === min (essentially, if only one ring result to show in list)
      if (Number.isNaN(value)) value = 0.5;
      return clamp(value, 0.05, 0.95);
    },
    // arc path
    d() {
      let angle = 360 * this.normalized;
      const x = sin(angle) * 50;
      const y = -cos(angle) * 50;
      return `M 0 -50 A 50 50 0 ${angle >= 180 ? 1 : 0} 1 ${x} ${y}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.ring {
  position: relative;
  width: 40px;
  height: 40px;
  flex-grow: 0;
  flex-shrink: 0;

  & > * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  circle {
    fill: none;
    stroke: $light-gray;
    stroke-width: 10px;
  }

  path {
    fill: none;
    stroke: $theme;
    stroke-width: 10px;
  }
}
</style>
