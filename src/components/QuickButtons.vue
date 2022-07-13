<script lang="ts">
import { ref, defineComponent, PropType, computed } from 'vue';

import { MODE_ID } from 'components/models';

const quick_sets = {
  [MODE_ID.default as number]: [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 100, 256, 1000, 1000000,
  ],
  [MODE_ID.hex as number]: [
    16, 32, 64, 128, 256, 1024, 2048, 4096, 8192, 65536, 1048576, 16777216,
  ],
  [MODE_ID.dice as number]: [2, 4, 6, 8, 10, 12, 20, 100],
  [MODE_ID.binary as number]: [2, 4, 8, 16, 32, 64, 256, 256 * 256],
  [MODE_ID.yesno as number]: [2, 3],
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
    const button_set = computed(() => quick_sets[props.mode]);
    return { button_set, MODE: MODE_ID };
  },
});
</script>

<template>
  <template v-if="button_set">
    <div style="color: $secondary" class="text-sm">
      {{ label }}
    </div>
    <div class="row justify-center">
      <template v-for="v in button_set" :key="v">
        <q-btn
          flat
          no-caps
          @click="$emit('onQuickButton', v)"
          class="rr-qb"
          :class="{ 'rr-qb-selected': current === v }"
        >
          {{
            mode === MODE.hex
              ? 'x' + v.toString(16)
              : mode === MODE.binary
              ? 'b' + v.toString(2)
              : v.toLocaleString()
          }}
        </q-btn>
      </template>
    </div>
  </template>
</template>
