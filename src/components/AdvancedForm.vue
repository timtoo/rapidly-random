<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { Die } from 'src/die';
import { MODE, MODE_ID } from 'components/models';
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
  emits: [
    'advanced-update',
    'input',
    'base-toggle',
    'exclusive-toggle',
    'mode-change',
  ],
  components: { InputNumber },
  setup(props, ctx) {
    const min = ref(props.die.min);
    const max = ref(props.die.max);
    const dice = ref(props.die.dice);
  
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

    function handleMinMaxDice(v: string) {
      if (v === 'min') {
        if (min.value < 0) min.value = 0;
        if (min.value >= max.value) min.value = max.value - 1;
        ctx.emit('input', min.value, v);
      } else if (v === 'max') {
        if (max.value <= min.value) max.value = min.value + 1;
        ctx.emit('input', max.value, v);
      } else if (v === 'repeat') {
        if (dice.value < 1) dice.value = 1;
        if (dice.value > 10) dice.value = 10;
        ctx.emit('input', dice.value, v);
      }
      console.log('new minmax ', min.value, ' ', max.value, ' ', dice.value);
      ctx.emit('advanced-update', [min.value, max.value, dice.value]);
    }

    return { min, max, dice, MODE, handleMinMaxDice };
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
      @update:model-value="handleMinMaxDice('min')"
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
      @update:model-value="handleMinMaxDice('max')"
      :min="min + 1"
    ></InputNumber>
  </div>
  <div>
    <InputNumber
      dense
      label="#"
      v-model="dice"
      input-class="text-rrinput"
      class="bg-rrinput"
      :style="{ width: '9em' }"
      label-color="primary"
      @update:model-value="handleMinMaxDice('dice')"
      :min="1"
      :max="10"
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
      :label="MODE[mode].name"
      :icon="MODE[mode].material_icon"
      ><q-list bordered dense class="bg-rrinput">
        <template v-for="m of Object.keys(MODE).map(k => parseInt(k))" :key="m">
          <q-item clickable v-close-popup @click="$emit('mode-change', m)">
            <q-item-section>                
              <q-item-label><q-icon :name="MODE[m].material_icon"></q-icon>&nbsp;&nbsp;{{ MODE[m].name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list></q-btn-dropdown
    >
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
