<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { MODE, MODE_ID, rollHistoryType } from 'components/models';
import { Die } from 'src/die';
import AdvancedForm from 'components/AdvancedForm.vue';
import HistoryList from 'src/components/HistoryList.vue';
import PreviousRolls from 'components/PreviousRolls.vue';
import QuickButtons from 'components/QuickButtons.vue';
import RollDisplay from 'components/RollDisplay.vue';
import DieConsole from 'components/DieConsole.vue';
import DebugDie from 'components/DebugDie.vue';
import { onKeyStroke } from '@vueuse/core';

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
  mode: MODE_ID,
  rolls: rollHistoryType[],
  quantity?: number,
  min?: number,
  max?: number
): Die {
  if (min === undefined) min = die.min;
  if (max === undefined) max = die.max;
  if (quantity !== undefined && quantity !== die.dice) die.dice = quantity;

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
  props: {
    options: Object,
  },
  components: {
    QuickButtons,
    RollDisplay,
    PreviousRolls,
    HistoryList,
    AdvancedForm,
    DieConsole,
    DebugDie,
  },
  setup() {
    const _rolls: rollHistoryType[] = [];
    // all prevoius die objects, with label and mode (oldest last)
    const die = ref(new Die(DEFAULT_MIN, DEFAULT_MAX, DEFAULT_QUANTITY));
    const rolls = ref(_rolls);
    const lastUpdate = ref(new Date());
    const mode = ref(MODE_ID.default);
    const console_active = ref(false);

    const afrender = ref(0);

    const ttopen = ref(false); // hint tooltip
    //const prevModeState = ref(saveStateDictInit);
    //const [consoleState, setConsoleState] = useState(false);
    //const [pressRequired, setPressRequired] = useState(true);
    //const consoleInputRef = useRef<HTMLInputElement | null>(null);
    //const quantityInputRef = useRef<HTMLInputElement | null>(null);

    const lastRoll = computed(() => {
      return rolls.value.length > 0 ? rolls.value[0] : null;
    });

    const dice_count = computed(() => {
      return rolls.value.length > 0 ? rolls.value[0].die.dice : 0;
    });

    function bigButtonClick() {
      die.value = letsroll(die.value, mode.value, rolls.value);
      lastUpdate.value = new Date();
    }

    function handleQuickButton(v: number) {
      die.value.max = v;
      die.value.min = die.value.zerobase ? 0 : 1;
      bigButtonClick();
    }

    function advancedUpdate(v: number[]) {
      die.value.min = v[0];
      die.value.max = v[1];
      die.value.dice = v[2];
      //console.log('process advanced ', v);
    }

    function handleChipClick(v: rollHistoryType) {
      die.value = v.die.clone();
      mode.value = v.mode;
      bigButtonClick();
    }

    function handleModeChange(m: number) {
      if (m != mode.value) {
        const new_mode = MODE[m];
        if (new_mode) {
          die.value = die.value.clone();
          if (new_mode.override) {
            Object.assign(die.value, new_mode.override);
          }
          mode.value = m;
        }
      }
    }

    function handleZeroBaseToggle() {
      die.value.zerobase = !die.value.zerobase;
      die.value.min = die.value.zerobase ? 0 : 1;
      afrender.value++;
    }

    function handleReset() {
      die.value = new Die(DEFAULT_MIN, DEFAULT_MAX, DEFAULT_QUANTITY);
      mode.value = MODE_ID.default;
      rolls.value = [];
      // quantity is not resetting
    }

    onKeyStroke([' ', 'Enter'], (e) => {
      e.preventDefault();
      bigButtonClick();
    });

    onKeyStroke('`', () => (console_active.value = true));
    onKeyStroke('Escape', () => (console_active.value = false));

    return {
      lastRoll,
      dice_count,
      lastUpdate,
      mode,
      die,
      rolls,
      history,
      min: die.value.min,
      max: die.value.max,
      afrender,
      ttopen,
      console_active,
      bigButtonClick,
      handleQuickButton,
      handleChipClick,
      handleZeroBaseToggle,
      handleModeChange,
      handleReset,
      advancedUpdate,
    };
  },
});
</script>

<template>
  <q-page>
    <div class="row justify-center">
      <template v-if="lastRoll"
        ><div v-for="(v, idx) in lastRoll.die.getThrow()" :key="idx">
          <roll-display
            :value="v"
            :index="idx"
            :roll="lastRoll"
            @on-roll-display-click="bigButtonClick"
          ></roll-display></div
      ></template>
      <template v-else>
        <roll-display
          :value="0"
          :roll="null"
          @on-roll-display-click="bigButtonClick"
        ></roll-display>
      </template>
    </div>
    <div class="row justify-center items-start q-mt-sm">
      <i>
        <template v-if="dice_count > 0">
          <span v-if="dice_count > 1"
            >Total: {{ lastRoll?.die.getResult() }}
            {{ lastRoll?.die.getRangeString(false, ' to ') }} -
          </span>
          <span>Range: {{ lastRoll?.die.getRangeString(true, ' to ') }}</span>
        </template>
        <template v-else
          ><div style="color: #2a2a5a">
            &nbsp;{{ Math.random().toString().slice(2) }}&nbsp;
          </div></template
        >
      </i>
    </div>
    <div class="row justify-center">
      <i style="font-size: 60%">
        {{ lastRoll ? lastRoll.time.toLocaleString() : '&nbsp;' }}
      </i>
    </div>
    <div class="row justify-center q-mt-md" v-if="!options?.hideQuick">
      <quick-buttons
        label="Quick Roll:"
        :mode="mode"
        :current="die.max"
        @on-quick-button="(v:number) => handleQuickButton(v)"
      ></quick-buttons>
    </div>
    <div
      class="row justify-center items-start q-pt-sm"
      v-if="!options?.hidePrevious"
    >
      <previous-rolls :rolls="rolls"></previous-rolls>
    </div>
    <div class="row justify-center q-pt-sm" v-if="!options?.hideHistory">
      <history-list
        :rolls="rolls"
        @on-die-chip="(v) => handleChipClick(v)"
      ></history-list>
    </div>
    <div class="row justify-center q-pt-sm" v-if="!options?.hideAdvanced">
      <AdvancedForm
        :die="die"
        :watchmin="die.min"
        :watchmax="die.max"
        :mode="mode"
        :ignore_hotkeys="console_active"
        :afrender="afrender"
        @advanced-update="(v) => advancedUpdate(v)"
        @base-toggle="handleZeroBaseToggle"
        @exclusive-toggle="() => (die.exclusive = !die.exclusive)"
        @mode-change="(m) => handleModeChange(m)"
      ></AdvancedForm>
    </div>
    <div class="row justify-center q-pt-md">
      <q-btn
        flat
        round
        color="primary"
        icon="help_outline"
        @click="ttopen = !ttopen"
        ><q-tooltip v-model="ttopen">
          <div style="font-size: 133%">
            <b>Tips and tricks!</b>
            <ul>
              <li>
                Click/tap the top box, or the bottom right button, for
                <b>new number(s)</b> Too obvious?
              </li>
              <li>
                Long press (click and hold) random number to copy to
                <b>clipboard</b>
              </li>
              <li>
                Hot keys! Min: N/n, Max: X/x, # 'dice': D/d, roll: Enter/Space
              </li>
              <li>
                Use hex mode
                <span style="font-family: monospace">x1000000</span> button for
                random HTML colour codes (or
                <span style="font-family: monospace">3d256xz</span> if you
                prefer!)
              </li>
              <li>Use five dice to play Yahtzee?</li>
              <li>` for console. Is that crazy?</li>
            </ul>
            <i>Use the power of randomness only for good. Please.</i>
          </div>
        </q-tooltip></q-btn
      >
      <q-btn
        flat
        round
        color="primary"
        icon="computer"
        @click="console_active = !console_active"
      />
      <q-btn flat round color="primary" icon="refresh" @click="handleReset"
        ><q-tooltip :delay="1000">Reset to defaults</q-tooltip></q-btn
      >
    </div>

    <!-- Console -->
    <DieConsole :active="console_active" @console-close="console_active=false"></DieConsole>

    <!-- FAB -->
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

    <DebugDie
      :die="die"
      :active="options?.enableDebug"
      bg-color="#d5c396"
    ></DebugDie>
  </q-page>
</template>
