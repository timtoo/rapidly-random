<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'DieConsole',
  props: {
    active: Boolean,
    error: String,
  },
  emits: ['console-close', 'submit'],
  setup(props, ctx) {
    const console_active = ref(props.active);
    const console_input = ref('');
    const error_status = ref(false);

    watch(
      () => props.error,
      () => (error_status.value = props.error ? true : false)
    );

    watch(
      () => props.active,
      () => (console_active.value = props.active)
    );

    watch(console_input, () => { console_input.value === '' ? error_status.value = false : null})

    function onSubmit() {
      ctx.emit('submit', console_input.value);
    }

    return {
      console_active,
      console_input,
      error_status,
      onSubmit,
    };
  },
});
</script>

<template>
  <q-dialog
    v-model="console_active"
    seamless
    position="bottom"
    ref="console_ref"
  >
    <div class="row console justify-center items-center">
      <div class="col-grow">
        <q-input
          placeholder="Dice hacking mode enabled..."
          hint="Your dice notation console is ready to serve."
          filled
          clearable
          autofocus
          outlined
          stack-label
          bottom-slots
          :error-message="error"
          :error="error_status"
          v-model="console_input"
          @keyup.enter="onSubmit"
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
            <q-btn outline @click="onSubmit" color="primary">Enter</q-btn>
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
