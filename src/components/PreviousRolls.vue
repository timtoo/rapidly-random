<template>
    <div style="overflow:hidden;white-space: nowrap;" class="q-mx-lg rr-pr" v-if="previousRollsString">
        <div>{{label}} <span v-html="previousRollsString"></span>
       </div>
    </div>
</template>

<style scoped lang="scss">
.rr-pr { color: $primary}
</style>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { rollHistoryType } from 'components/models';

// return list of strings of roll results from history (recent first)
export default defineComponent({
    name: 'PreviousRolls',
    props: {
        label: { type: String, default: 'Previous:'},
        rolls: { type: Object as PropType<rollHistoryType[]>, required: true},
        limit: { type: Number, default: 50},
        skip: {type: Number, default: 1}
    },
    setup(props) {
        const previousRollsString = computed((): string => {
            const result: string[] = [];
            let rs = '';
            // skip first roll
            for (const r of props.rolls.slice(props.skip, props.limit+1+props.skip)) {
            rs = r.die.getResult().toLocaleString()
            if (r.die.results.length > 1) {
                rs = rs + ' ' + r.die.getThrow().toString()
            }
            result.push(rs)
            }
            return result.join('&hellip; ')
        })

    return { previousRollsString }
    }
})

</script>