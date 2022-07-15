<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
//import { onLongPress } from '@vueuse/core';
import { vOnLongPress } from '@vueuse/components';
import { rollHistoryType, MODE_ID, yesno_answers } from 'components/models';
import SvgDie6 from 'components/SvgDie6.vue';

function handleLongPress(e: PointerEvent) {
  console.log('long pressed');
}

export default defineComponent({
  name: 'RollDisplay',
  props: {
    value: { type: Number, default: 0 },
    roll: { type: Object as PropType<rollHistoryType | null>, default: null }, // required: true causes typescript warnings
    index: { type: Number, default: 0 },
  },
  components: { SvgDie6 },
  emits: ['onRollDisplayClick'],
  setup(props) {
    const ttopen = ref(false);
    //const box_ref = ref<HTMLElement | null>(null);

    let padding = '1em 4em 1em 4em';
    const displayValue = computed(() => {
      if (props.roll) {
        if (props.roll.mode === MODE_ID.dice) padding = '1em 1em 1em 1em';
        if (props.roll.mode === MODE_ID.hex) {
          return props.value.toString(16);
        } else if (props.roll.mode === MODE_ID.binary) {
          return props.value
            .toString(2)
            .padStart(
              (
                props.roll.die.max - (props.roll.die.exclusive ? 1 : 0)
              ).toString(2).length,
              '0'
            );
        } else if (props.roll.mode === MODE_ID.yesno) {
          return yesno_answers[props.value % 3];
        } else {
          return props.value.toLocaleString();
        }
      }
      return 'Press Here';
    });

    //onLongPress(box_ref, handleLongPress, { delay: 750, modifiers: { prevent: true, stop: true } });

    return {
      displayValue,
      padding,
      ttopen,
      MODE_ID,
      handleLongPress,
      vOnLongPress,
    };
  },
});
//   <div class="clickable" on-long-press="[handleLongPress, { delay: 750 }]">
</script>

<template>
  <q-btn
    unelevated
    :outline="roll?.mode !== MODE_ID.dice"
    @click="$emit('onRollDisplayClick')"
    class="q-pa-lg rr-big-btn text-h3"
  >
    <template v-if="roll && roll.mode === MODE_ID.dice && roll.die.max <= 9">
      <SvgDie6
        viewBox="0 0 100 100"
        height="1.5em"
        :value="value"
        :alt="value + ' die'"
        :style="{ transform: 'rotate(' + (Math.random() * 90 - 45) + 'deg)' }"
      ></SvgDie6>
    </template>
    <template v-else>
      {{ displayValue }}
    </template>
  </q-btn>
</template>
