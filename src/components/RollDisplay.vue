<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue';
import { onLongPress } from '@vueuse/core';
import { useQuasar, copyToClipboard } from 'quasar';
import { rollHistoryType } from 'components/models';
import { MODE_ID, MODE } from 'src/lib/modes';
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
        return MODE[props.roll.mode].displayValue(
          props.value,
          props.roll.die.max
        );
      }
      return 'Press Here';
    });

    function handleLongPress() {
      inLongPress.value = true;
      if (props.roll) {
        copyToClipboard(
          MODE[props.roll.mode].displayMulti(props.roll.die.getThrow(), props.roll.die.max)  
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
      <span v-html="displayValue"></span>
    </template>
  </q-btn>
</template>

<style lang="scss">
.rr-big-btn {
  color: $primary;
  min-width: 2.6em;
  font-variant: small-caps;
  text-transform: none;
}
</style>
