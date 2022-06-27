<template>
  <div style="color: $secondary" class="text-sm">
    {{ label }}
  </div>
  <div class="row justify-center">
    <template v-for="v in values" :key="v">
      <q-btn
        flat
        @click="$emit('onQuickButton', v)"
        class="rr-qb"
        :class="{ 'rr-qb-selected': current === v }"
      >
        {{ mode === MODE.hex ? v.toString(16) : v.toLocaleString() }}
      </q-btn>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { MODE } from 'components/models';

const quick_sets = {
  [MODE.default as number]: [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 1000000,
  ],
  [MODE.hex as number]: [
    16, 32, 64, 128, 256, 1024, 2048, 4096, 9182, 65536, 1048576, 16777216,
  ],
  [MODE.dice as number]: [2, 4, 6, 8, 10, 12, 20, 100],
};

export default defineComponent({
  name: 'QuickButtons',
  props: {
    label: {
      type: String,
      default: '',
    },
    mode: {
      //type: Object as PropType<MODE>, // caused "Expected Object, got Number"
      type: Number,
      required: true,
   },
    current: {
      type: Number,
      default: 0,
    },
  },
  emits: ['onQuickButton'],
  setup(props) {
    const values = quick_sets[props.mode];
    return { values, MODE };
  },
});
</script>
