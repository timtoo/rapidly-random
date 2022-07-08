<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
import { rollHistoryType, MODE } from 'components/models';
import SvgDie6 from 'components/SvgDie6.vue';

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

    let padding = '1em 4em 1em 4em';
    const displayValue = computed(() => {
      if (props.roll) {
        if (props.roll.mode === MODE.dice) padding = '1em 3em 1em 3em';
        if (props.roll.mode === MODE.hex) {
          return props.value.toString(16);
        } else if (props.roll.mode === MODE.binary) {
          return props.value
            .toString(2)
            .padStart(
              (
                props.roll.die.max - (props.roll.die.exclusive ? 1 : 0)
              ).toString(2).length,
              '0'
            );
        } else {
          return props.value.toLocaleString();
        }
      }
      return 'Press Here';
    });

    return { displayValue, padding, ttopen, MODE };
  },
});
</script>

<template>
  <q-btn
    unelevated
    :outline="roll?.mode !== MODE.dice"
    @click="$emit('onRollDisplayClick')"
    class="q-pa-lg rr-big-btn text-h3"
  >
    <template v-if="roll && roll.mode === MODE.dice && roll.die.max <= 9">
      <SvgDie6
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
