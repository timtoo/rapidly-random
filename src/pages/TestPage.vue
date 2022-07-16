<script setup lang="ts">
import { ref } from 'vue';
import { vOnLongPress } from '@vueuse/components';

const longPressedDirective = ref(false);
const fallthrough = ref(false);

const onLongPressCallbackDirective = () => {
  longPressedDirective.value = true;
};
const resetDirective = () => {
  longPressedDirective.value = false;
};
const click_if_not_longpress = () => {
  if (longPressedDirective.value == false) {
    fallthrough.value = !fallthrough.value;
  }
};
</script>

<template>
  <p>
    Long Pressed: {{ longPressedDirective }} (fallthrough: {{ fallthrough }})
  </p>

  <button
    v-on-long-press.prevent="onLongPressCallbackDirective"
    class="ml-2 button small"
    @click="click_if_not_longpress"
  >
    Press long
  </button>

  <q-btn
    v-on-long-press="[
      onLongPressCallbackDirective,
      { delay: 1000, modifiers: { stop: true } },
    ]"
    class="ml-2button small"
    @click="click_if_not_longpress"
  >
    Press long (with options)
  </q-btn>

  <button class="ml-2 button small" @click="resetDirective">Reset</button>
</template>
