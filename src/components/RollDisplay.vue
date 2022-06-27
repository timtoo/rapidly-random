<template>
  <q-btn outline @click="$emit('onRollDisplayClick')" class="q-pa-lg rr-big-btn text-h3">
    {{ displayValue }}
  </q-btn>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
import { rollHistoryType, MODE } from 'components/models';

export default defineComponent({
  name: 'RollDisplay',
  props: {
    roll: { type: Object as PropType<rollHistoryType | null>, required: true },
    index: { type: Number },
  },
  emits: ['onRollDisplayClick'],
  setup(props) {
    const ttopen = ref(false);

    let padding = '1em 4em 1em 4em';
    const displayValue = computed(() => {
      if (props.roll) {
        if (props.roll.mode === MODE.dice) padding = '1em 3em 1em 3em';
        if (props.roll.mode === MODE.hex) {
          return props.roll.die.getResult().toString(16);
        } else {
          return props.roll.die.getResult().toLocaleString();
        }
      }
      return 'Press Here';
    });

    return { displayValue, padding, ttopen };
  },
});
</script>
