<template>
  <q-page>
    <div class="row justify-center items-start">
      <display-button :roll="lastRoll" @click="bigButtonClick"></display-button>
    </div>
    <div class="row justify-center items-start q-mt-md" v-if="lastRoll">
      <i>
        {{ lastRoll.die.getRangeString(true, ' to ') }}
      </i>
    </div>
    <div class="row justify-center items-start q-mt-md" v-if="lastRoll">
      <i style="font-size: 50%"> {{ lastUpdate }} </i>
    </div>
    <div class="row justify-center items-start q-mt-md">
      <quick-buttons
        label="Quick Roll:"
        :mode="mode"
        :current="die.max"
        v-on:on-quick-button="(e) => handleQuickButton(e)"
      ></quick-buttons>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, shallowRef } from 'vue';
import {
  MODE,
  MODES,
  rollHistoryType,
  saveStateDictType,
  stateType,
} from 'components/models';
import QuickButtons from 'components/QuickButtons.vue';
import DisplayButton from 'components/DisplayButton.vue';
import { Die } from 'src/die';

const DEFAULT_QUANTITY = 1;
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 10;
const MAX_QUANTITY = 100;
const MAX_HISTORY = MAX_QUANTITY * 5;

// generate new randoms numbers to the front of the history list
function letsroll(
  die: Die,
  mode: MODE,
  rolls: rollHistoryType[],
  history: rollHistoryType[],
  repeats: number,
  min?: number,
  max?: number
): Die {
  if (min === undefined) min = die.min;
  if (max === undefined) max = die.max;

  // update number of dice requested
  if (repeats !== die.dice) die.dice = repeats;

  die.roll();
  const newDie = die.clone();

  rolls.unshift({
    label: die.toString(),
    die: die,
    mode: mode,
    time: new Date(),
  });

  // trim roll history
  if (rolls.length > MAX_HISTORY) rolls.pop();

  // add die to front of prevoius range list (removing duplicates)
  const prev_index = history.findIndex(
    (i) => i.label === rolls[0].label && i.mode === mode
  );
  if (prev_index >= 0) history.splice(prev_index, 1);
  history.unshift(rolls[0]);
  if (history.length > MAX_HISTORY) history.pop();

  return newDie;
}

// pass through to last die.getThrow with some safety
function getLastThrow(state: stateType): number[] {
  if (state.rolls.length > 0) {
    return state.rolls[0].die.getThrow();
  }
  return [];
}

export default defineComponent({
  name: 'IndexPage',
  components: { QuickButtons, DisplayButton },
  setup() {
    const initState: stateType = {
      die: new Die(
        DEFAULT_MIN,
        DEFAULT_MAX,
        DEFAULT_QUANTITY,
        0,
        1,
        1,
        false,
        false
      ),
      rolls: [],
      lastTime: new Date(),
      history: [],
      newQuantity: DEFAULT_QUANTITY, // don't change quantity directly or will
      needUpdate: 0,
    };

    const _rolls: rollHistoryType[] = [];
    const _history: rollHistoryType[] = [];
    // all prevoius die objects, with label and mode (oldest last)
    const die = shallowRef(new Die(DEFAULT_MIN, DEFAULT_MAX, DEFAULT_QUANTITY));
    const rolls = ref(_rolls);
    // same as rolls, but duplicates are removed (keeping only most recent)
    const history = ref(_history);
    const lastUpdate = ref(new Date());
    const mode = ref(MODE.default);
    const repeats = ref(DEFAULT_QUANTITY);

    //const prevModeState = ref(saveStateDictInit);
    //const ttopen = ref(false); // hint tooltip
    //const [consoleState, setConsoleState] = useState(false);
    //const [pressRequired, setPressRequired] = useState(true);
    //const consoleInputRef = useRef<HTMLInputElement | null>(null);
    //const quantityInputRef = useRef<HTMLInputElement | null>(null);

    function bigButtonClick() {
      die.value = letsroll(
        die.value,
        mode.value,
        rolls.value,
        history.value,
        repeats.value
      );
      lastUpdate.value = new Date();
      console.log('rolling');
    }

    function handleQuickButton(e : number) {
      die.value.max = e
      die.value = letsroll(die.value, mode.value, rolls.value, history.value, repeats.value)
    }

    const lastRoll = computed(() => {
      console.log('computing lastRoll ');
      return rolls.value.length > 0 ? rolls.value[0] : null;
    });

    console.log(JSON.parse(JSON.stringify(DisplayButton)));
    return {
      lastRoll,
      lastUpdate,
      mode,
      die,
      rolls,
      history,
      bigButtonClick,
      handleQuickButton,
    };
  },
});
</script>
