<script lang="ts">
import { ref, defineComponent, PropType, computed } from 'vue';

import { MODE_ID, MODE } from 'components/models';

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
    const button_set = computed(() => MODE[props.mode].quick);
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
