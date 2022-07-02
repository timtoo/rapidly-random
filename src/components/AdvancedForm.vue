<template>
  <div class="row">
    <q-input
      v-model.number="min"
      type="number"
      name="min"
      label="Min"
      color="secondary"
      bg-color="rrinput"
      label-color="primary"
      input-class="text-rrinput"
      maxlength="12"
      min="0"
      max="max-1"
      outlined
      standout
      dense
      style="max-width: 8rem"
      @update:model-value="handleMinMax('min')"
      @keydown="keyHandler"
    >
      <template v-slot:prepend>
        <q-icon color="primary" name="vertical_align_bottom" /> </template
    ></q-input>
    <q-input
      v-model.number="max"
      type="number"
      name="max"
      label="Max"
      color="secondary"
      bg-color="rrinput"
      label-color="primary"
      input-class="text-rrinput"
      maxlength="12"
      :min="max-1"
      outlined
      standout
      dense
      style="max-width: 8rem"
      @update:model-value="handleMinMax('max')"
      @keydown="(e) => keyHandler(e)"
    >
      <template v-slot:prepend>
        <q-icon color="primary" name="vertical_align_top" />
      </template>
    </q-input>

    <q-btn @click="handletest">test</q-btn>
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
import { watch, defineComponent, ref } from 'vue';
import { Die } from 'src/die';

export default defineComponent({
  props: {
    die: {
      type: Die,
      required: true,
    },
    mode: {
      type: Number,
      required: true,
    },
  },
  emits: ['advanced-update', 'input'],
  setup(props, ctx) {
    const min = ref(props.die.min);
    const max = ref(props.die.max);

    //    watch(min, (v) => props.die.min = v)

    //watch(min, ()=> {
    //  console.log('min change')
    //})

    function handleMinMax(v: string) {
      if (v == 'min') {
        if (min.value < 0) min.value = 0;
        if (min.value >= max.value) min.value = max.value - 1;
        ctx.emit('input', min.value)
      } else if (v == 'max') {
        if (max.value <= min.value) max.value = min.value + 1;
        ctx.emit('input', max.value)
      }
      console.log('new minmax ', min.value, ' ', max.value);
      ctx.emit('advanced-update', [min.value, max.value]);
    }

    function keyHandler(e) {
      console.log('key ',e)
    }

    function handletest() {
      min.value = 4
    }

    return { min, max, handleMinMax, keyHandler, handletest };
  },
});
</script>
