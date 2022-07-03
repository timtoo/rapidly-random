<template>
  <div class="row">
    <InputNumber
      dense
      label="Min"
      v-model="min"
      input-class="text-rrinput"
      bg-color="rrinput"
      label-color="primary"
      @update:model-value="handleMinMax('min')"
      :min="0"
      :max="max - 1"
    ></InputNumber>

    <InputNumber
      dense
      label="Max"
      v-model="max"
      input-class="text-rrinput"
      bg-color="rrinput"
      label-color="primary"
      @update:model-value="handleMinMax('max')"
      :min="min + 1"
    ></InputNumber>
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
import { watch, defineComponent, ref } from 'vue';
import { Die } from 'src/die';
import InputNumber from 'src/components/InputNumber.vue';

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
  components: { InputNumber },
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
        ctx.emit('input', min.value);
      } else if (v == 'max') {
        if (max.value <= min.value) max.value = min.value + 1;
        ctx.emit('input', max.value);
      }
      console.log('new minmax ', min.value, ' ', max.value);
      ctx.emit('advanced-update', [min.value, max.value]);
    }

    return { min, max, handleMinMax };
  },
});
</script>
