<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { Die } from 'src/die';
import {MODE, MODES} from 'components/models'
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
    watchmin: Number,
    watchmax: Number,
    afrender: Number,
  },
  emits: ['advanced-update', 'input', 'base-toggle', 'exclusive-toggle', 'mode-change'],
  components: { InputNumber },
  setup(props, ctx) {
    const min = ref(props.die.min);
    const max = ref(props.die.max);
    const current_mode = ref(props.mode)

    const mode_options = MODES.map((v) => {return {label: v[1], value: v[0]}})

    const mode_label = computed(() => {
        return MODES.filter((v) => { return v[0] === props.mode})[0][1]
    })

    // test?
    watch(
      () => props.die,
      () => {
        min.value = props.die.min;
        max.value = props.die.max;
        console.log('af watch die');
      }
    );

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

    return { min, max, mode_label, MODES, handleMinMax };
  },
});
</script>

<template>
  <div class="row">
    <InputNumber
      dense
      label="Min"
      v-model="min"
      input-class="text-rrinput"
      class="bg-rrinput"
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
      class="bg-rrinput"
      label-color="primary"
      @update:model-value="handleMinMax('max')"
      :min="min + 1"
    ></InputNumber>
  </div>
  <div>
    <q-btn-dropdown
      style="height: 100%"
      class="q-px-sm"
      dense
      outline
      no-caps
      color="primary"
      :label="mode_label"
    ><q-list bordered dense class="bg-rrinput">
        <template v-for="m in MODES" :key="m[0]">
        <q-item clickable v-close-popup @click="$emit('mode-change', m[0])">
          <q-item-section>
            <q-item-label>{{m[1]}}</q-item-label>
          </q-item-section>
        </q-item>
        </template>
      </q-list></q-btn-dropdown>
  </div>

  <div>
    <q-btn
      dense
      outline
      no-caps
      class="q-px-sm"
      color="primary"
      style="height: 100%"
      :class="die.zerobase ? 'rr-active-button' : ''"
      @click="$emit('base-toggle')"
    >
      {{ die.zerobase ? 'Zero-based' : 'One-based' }}
    </q-btn>
    <q-btn
      dense
      outline
      no-caps
      class="q-px-sm"
      color="primary"
      style="height: 100%"
      :class="die.exclusive ? 'rr-active-button' : ''"
      @click="$emit('exclusive-toggle')"
    >
      {{ die.exclusive ? 'Exclusive' : 'Inclusive' }}
    </q-btn>
  </div>
</template>

<style scoped lang="scss">
.rr-active-button {
  color: $text-default !important;
}

</style>
