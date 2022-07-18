<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
import { onLongPress } from '@vueuse/core';
import { useQuasar, copyToClipboard } from 'quasar';
import { rollHistoryType, MODE_ID, MODE } from 'components/models';
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
    const $q = useQuasar();
    const btn_ref = ref<HTMLElement | null>(null);
    const inLongPress = ref(false);
    const ttopen = ref(false);
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
        } else if (MODE[props.roll.mode].mapping && Object.keys(MODE[props.roll.mode].mapping)) {
          return yesno_answers[props.value % 3];
        } else {
          return props.value.toLocaleString();
        }
      }
      return 'Press Here';
    });

    function handleLongPress() {
      inLongPress.value = true;
      if (props.roll) {
        copyToClipboard(
          displayValue.value +
            (displayValue.value !== props.value.toString()
              ? ' (' + props.value + ')'
              : '')
        )
          .then(() => {
            $q.notify({
              message: 'Copied to clipboard!',
              icon: 'announcement',
              color: 'primary',
              position: 'top',
              textColor: 'background',
            });
          })
          .catch(() => {
            $q.notify({
              message: 'Clipboard failed',
              icon: 'warning',
              color: 'warn',
              position: 'top',
              textColor: 'background',
            });
          });
      }
    }

    onLongPress(btn_ref, handleLongPress, {
      delay: 1000,
      modifiers: { stop: true, prevent: true },
    });

    return {
      btn_ref,
      displayValue,
      handleLongPress,
      inLongPress,
      MODE_ID,
      padding,
      ttopen,
    };
  },
});
//   <div class="clickable" on-long-press="[handleLongPress, { delay: 750 }]">
</script>

<template>
  <q-btn
    ref="btn_ref"
    unelevated
    :outline="roll?.mode !== MODE_ID.dice"
    @click="inLongPress ? (inLongPress = false) : $emit('onRollDisplayClick')"
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
