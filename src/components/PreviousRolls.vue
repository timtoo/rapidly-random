<!-- Display list of previous roll results, as a string. -->
<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { rollHistoryType } from 'components/models';
import { MODE_ID, MODE } from 'src/lib/modes';

// return list of strings of roll results from history (recent first)
export default defineComponent({
  name: 'PreviousRolls',
  props: {
    label: { type: String, default: 'Previous:' },
    rolls: { type: Object as PropType<rollHistoryType[]>, required: true },
    limit: { type: Number, default: 50 },
    skip: { type: Number, default: 1 },
  },
  setup(props) {
    const previousRollsString = computed((): string => {
      const result: string[] = [];
      let rs = '';
      let val = 0;

      // skip first roll
      for (const r of props.rolls.slice(
        props.skip,
        props.limit + 1 + props.skip
      )) {
        if (r.die.dice === 1) {
          result.push(MODE[r.mode].displayValue(r.die.getResult(), r.die.max));
        } else {
          result.push(MODE[r.mode].displayMulti(r.die.getThrow(), r.die.max));
        }
      }
      return result.join('&hellip; ');
    });

    return { previousRollsString };
  },
});
</script>

<template>
  <div
    style="overflow: hidden; white-space: nowrap"
    class="q-mx-lg rr-pr"
    v-if="previousRollsString"
  >
    <div>
      <span class="rr-pr-label">{{ label }}</span>
      <span class="grad" v-html="previousRollsString"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rr-pr {
  color: $primary;
  &-label {
    color: $text-default;
  }
}

.grad {
  color: black;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-image: linear-gradient(
    225deg,
    $paper 0%,
    $primary 50%,
    $primary 100%
  );
}
</style>
