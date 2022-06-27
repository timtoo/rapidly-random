<template>
    <div style="overflow:hidden;white-space: nowrap; color:white" class="q-mx-lg rr-hl" v-if="filteredRolls">
        <div>{{label}} 
        <template v-for="r of filteredRolls" :key="r.label+':'+r.mode">
            <q-chip dense color="primary" @click="$emit('onDieChip', r)" icon="star">{{r.label}}</q-chip>
        </template>
       </div>
    </div>
</template>

<style scoped lang="scss">
.rr-hl { color: $primary}
</style>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { rollHistoryType } from 'components/models';

// return list of strings of roll results from history (recent first)
export default defineComponent({
    name: 'HistoryList',
    props: {
        label: { type: String, default: 'History:'},
        rolls: { type: Object as PropType<rollHistoryType[]>, required: true},
        limit: { type: Number, default: 50},
    },
    emits: ['onDieChip'],
    setup(props) {
        const filteredRolls = computed((): rollHistoryType[] => {
            const history: rollHistoryType[] = []
            const seen = new Set()

            for (const r of props.rolls) {
                const key = r.label + ':' + r.mode;
                if (! seen.has(key)) {
                    seen.add(key)
                    history.push(r)
                    if (history.length === props.limit) break;
                }                
            }
            return history
        })

    return { filteredRolls }
    }
})

</script>