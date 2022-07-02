<template>
  <q-input outlined style="max-width: 9em" model-value="0" :dense="dense">
    <template v-slot:prepend>
      <q-btn round flat color="primary" icon="remove" :dense="dense" @click="onDecrement"/>
    </template>
    <template v-slot:append>
      <q-btn round flat color="primary" icon="add" :dense="dense" @click="onIncrement"/>
    </template>
  </q-input>
</template>

<script lang="ts">
import { watch, defineComponent, ref } from 'vue';

function toNumber(v: string): number {
  let result = parseInt(v) || 0
  return result
}

export default defineComponent({
    name: "InputNumber",
    props: {
        dense: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: String,
            default: '',
        },
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
    },


    setup(props, ctx) {
      let value = toNumber(props.modelValue)

      function onDecrement() {
        if (props.max === undefined || props.value < props.max) {
          value++;
          props.modelValue = value 


        }
      }


      return { onIncrement, onDecrement }
    }
})

</script>
