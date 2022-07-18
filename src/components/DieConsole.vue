<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { onKeyStroke } from '@vueuse/core'

export default defineComponent({
  name: 'DieConsole',
  props: {
    active: Boolean,
  },
  emits: ['console-close', 'submit'],
  setup(props) {
    const console_active = ref(props.active);
    const console_input = ref('');

    watch(
      () => props.active,
      () => (console_active.value = props.active)
    );

    onKeyStroke('Enter', (e) => {
        console.log('console enter')
        e.preventDefault()
        e.stopPropagation()
        })

    return {
      console_active,
      console_input,
    };
  },
});
</script>

<template>
  <q-dialog v-model="console_active" seamless position="bottom">
    <div class="row console justify-center items-center">
      <div class="col-grow">
        <q-input
          label="Console"
          placeholder="Dice hacking mode enabled..."
          hint="Sadly this doesn't work well..."
          filled
          clearable
          autofocus
          outlined
          stack-label
          bottom-slots
          v-model="console_input"
          input-class="text-rrinput"
        >
          <template v-slot:prepend>
            <q-icon name="computer" color="primary" /> </template
        ></q-input>
      </div>
      <div style="margin-left: 1em">
        <div class="col">
          <div>
            <q-btn
              style="width: 100%"
              outline
              @click="$emit('console-close')"
              color="primary"
              >Esc</q-btn
            >
          </div>
          <div>
            <q-btn outline @click="null" color="primary">Enter</q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss">
.console {
  color: $text-default;
  background-color: $paper;
  border-radius: 4px;
  margin: 1em;
  padding: 1em;
  width: 80vw;
  border: 1px solid $background;
}
</style>
