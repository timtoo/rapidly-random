<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SvgDie6',
  props: {
    value: { type: Number, default: 1 },
  },
});
</script>

<template>
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#000" class="die6">
      <rect class="die"
        width="98"
        height="98"
        x="1"
        y="1"
        ry="25"
        stroke-width="2"
      />
      <circle class="dot"
        cx="26"
        cy="26"
        r="10"
        stroke-width="2"
        v-if="[2, 3, 4, 5, 6].includes(value)"
      />
      <circle class="dot"
        cx="74"
        cy="26"
        r="10"
        stroke-width="2"
        v-if="[4, 5, 6].includes(value)"
      />
      <circle class="dot"
        cx="26"
        cy="50"
        r="10"
        stroke-width="2"
        v-if="[6].includes(value)"
      />
      <circle class="dot"
        cx="50"
        cy="50"
        r="10"
        stroke-width="2"
        v-if="[1, 3, 5].includes(value)"
      />
      <circle class="dot"
        cx="74"
        cy="50"
        r="10"
        stroke-width="2"
        v-if="[6].includes(value)"
      />
      <circle class="dot"
        cx="26"
        cy="74"
        r="10"
        stroke-width="2"
        v-if="[4, 5, 6].includes(value)"
      />
      <circle class="dot"
        cx="74"
        cy="74"
        r="10"
        stroke-width="2"
        v-if="[2, 3, 4, 5, 6].includes(value)"
      />
    </g>
  </svg>
</template>

<style scoped lang="scss">

.die6 {
  fill: #fff;
  stroke: #000;    
  .dot {
    fill: #141414;
  }
}
</style>
