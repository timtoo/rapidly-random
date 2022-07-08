<script lang="ts">
import { computed, defineComponent, ref, shallowRef } from 'vue';
import { MODE, rollHistoryType } from 'components/models';
import { Die } from 'src/die';
import AdvancedForm from 'components/AdvancedForm.vue';
import HistoryList from 'src/components/HistoryList.vue';
import PreviousRolls from 'components/PreviousRolls.vue';
import QuickButtons from 'components/QuickButtons.vue';
import RollDisplay from 'components/RollDisplay.vue';
import DebugDie from 'components/DebugDie.vue';

const DEFAULT_QUANTITY = 1;
const DEFAULT_MIN = 1;
const DEFAULT_MAX = 10;
const MAX_QUANTITY = 100;
const MAX_HISTORY = MAX_QUANTITY * 5;

// generate new randoms numbers based on the current die
// update roll histories
// return a new cloned, but unrolled, die
function letsroll(
  die: Die,
  mode: MODE,
  rolls: rollHistoryType[],
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

  return newDie;
}

export default defineComponent({
  name: 'IndexPage',
  components: {
    QuickButtons,
    RollDisplay,
    PreviousRolls,
    HistoryList,
    AdvancedForm,
    DebugDie,
  },
  setup() {
    const _rolls: rollHistoryType[] = [];
    // all prevoius die objects, with label and mode (oldest last)
    const die = ref(new Die(DEFAULT_MIN, DEFAULT_MAX, DEFAULT_QUANTITY));
    const rolls = ref(_rolls);
    const lastUpdate = ref(new Date());
    const mode = ref(MODE.default);
    const repeats = ref(DEFAULT_QUANTITY);
    const afrender = ref(0);

    //const prevModeState = ref(saveStateDictInit);
    //const ttopen = ref(false); // hint tooltip
    //const [consoleState, setConsoleState] = useState(false);
    //const [pressRequired, setPressRequired] = useState(true);
    //const consoleInputRef = useRef<HTMLInputElement | null>(null);
    //const quantityInputRef = useRef<HTMLInputElement | null>(null);

    const lastRoll = computed(() => {
      return rolls.value.length > 0 ? rolls.value[0] : null;
    });

    function bigButtonClick() {
      die.value = letsroll(die.value, mode.value, rolls.value, repeats.value);
      lastUpdate.value = new Date();
    }

    function handleQuickButton(v: number) {
      die.value.max = v;
      die.value.min = die.value.zerobase ? 0 : 1;
      bigButtonClick();
    }

    function advancedUpdate(v: any) {
      die.value.min = v[0];
      die.value.max = v[1];
      console.log('process advanced ', v);
    }

    function handleChipClick(v: rollHistoryType) {
      die.value = v.die.clone();
      mode.value = v.mode;
      bigButtonClick();
    }

    function handleModeChange(m: number) {
      if (m != mode.value) {
        mode.value = m;
      }
    }

    function handleZeroBaseToggle() {
      die.value.zerobase = !die.value.zerobase;
      die.value.min = die.value.zerobase ? 0 : 1;
      afrender.value++;
    }

    return {
      lastRoll,
      lastUpdate,
      mode,
      die,
      rolls,
      history,
      min: die.value.min,
      max: die.value.max,
      afrender,
      bigButtonClick,
      handleQuickButton,
      handleChipClick,
      handleZeroBaseToggle,
      handleModeChange,
      advancedUpdate,
    };
  },
});
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <roll-display :roll="lastRoll" @click="bigButtonClick"></roll-display>
    </div>
    <div class="row justify-center items-start q-mt-sm">
      <i>
        {{ lastRoll ? lastRoll.die.getRangeString(true, ' to ') : '&nbsp;' }}
      </i>
    </div>
    <div class="row justify-center">
      <i style="font-size: 60%">
        {{ lastRoll ? lastRoll.time.toLocaleString() : '&nbsp;' }}
      </i>
    </div>
    <div class="row justify-center q-mt-md">
      <quick-buttons
        label="Quick Roll:"
        :mode="mode"
        :current="die.max"
        @on-quick-button="(v:number) => handleQuickButton(v)"
      ></quick-buttons>
    </div>
    <div class="row justify-center items-start">
      <previous-rolls :rolls="rolls"></previous-rolls>
    </div>
    <div class="row justify-center">
      <history-list
        :rolls="rolls"
        @on-die-chip="(v) => handleChipClick(v)"
      ></history-list>
    </div>
    <div class="row justify-center">
      <AdvancedForm
        :die="die"
        :watchmin="die.min"
        :watchmax="die.max"
        :mode="mode"
        :afrender="afrender"
        @advanced-update="(v) => advancedUpdate(v)"
        @base-toggle="handleZeroBaseToggle"
        @exclusive-toggle="() => (die.exclusive = !die.exclusive)"
        @mode-change="(m) => handleModeChange(m)"
      ></AdvancedForm>
    </div>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn
        fab
        icon="auto_awesome"
        color="secondary"
        text-color="black"
        @click="bigButtonClick"
      >
        &nbsp;
        <span style="text-transform: none">{{ die.toString() }}</span></q-btn
      >
    </q-page-sticky>
    <DebugDie :die="die" :active="true" bg-color="#d5c396"></DebugDie>
  </q-page>
</template>
