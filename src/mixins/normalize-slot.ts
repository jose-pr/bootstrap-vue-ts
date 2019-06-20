import { Component, Prop } from 'vue-property-decorator'
import { Vue, concat, hasNormalizedSlot, normalizeSlot, ScopedSlot } from '@utils'

Component({})
export class NormalizeSlotMixin extends Vue {
  hasNormalizedSlot(name: string) {
    // Returns true if the either a $scopedSlot or $slot exists with the specified name
    return hasNormalizedSlot(name, this.$scopedSlots, this.$slots)
  }
  normalizeSlot(name: string, scope?: Dict<unknown>) {
    // Returns an array of rendered vNodes if slot found.
    // Returns undefined if not found.
    const vNodes = normalizeSlot(name, scope, this.$scopedSlots, this.$slots)
    return vNodes ? concat(vNodes) : vNodes
  }
}
export default NormalizeSlotMixin
