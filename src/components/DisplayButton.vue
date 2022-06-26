<template>
    <q-btn
      outline
      class="q-pa-lg rr-big-btn text-h3"
    >
      {{ displayValue }}
    </q-btn>
</template>

<script lang="ts">

import { computed, defineComponent, ref, PropType } from 'vue';
import { Die } from 'src/die';
import { rollHistoryType, MODE } from 'components/models';

export default defineComponent({
  name: 'DisplayButton',
  props: {
      roll: {type: Object as PropType<rollHistoryType | null>},
      index: {type: Number},
  },
  emits: ['onDisplayButtonClick'],
  setup(props) {
    const ttopen = ref(false);

    let padding = '1em 4em 1em 4em'
    const displayValue = computed(() => {
      console.log("computing displayvalue")    
      if (props.roll) {
        if (props.roll.mode === MODE.dice) padding = '1em 3em 1em 3em';
        if (props.roll.mode === MODE.hex) {
          return props.roll.die.getResult().toString(16)
        }
        else {
          return props.roll.die.getResult().toString()
        }
      }
      return "Press Here"
    })

    console.log(displayValue)
    console.log("diplaying box")
    return { displayValue, padding, ttopen }
  }

})




</script>