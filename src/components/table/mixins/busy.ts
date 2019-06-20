import { htmlOrText, VNodeData, Component, Prop, Mixins, Vue, Watch, isFunction } from '@utils'
import { NormalizeSlotMixin } from '@mixins';

export function isBusy(val:unknown):val is BusyMixin{
  return (val as BusyMixin).stopIfBusy != undefined
}
@Component({})
export class BusyMixin extends Mixins(NormalizeSlotMixin) {
  @Prop({})
  busy: boolean = false

  localBusy: boolean = false


  get computedBusy() {
    return this.busy || this.localBusy
  }

  @Watch('localBusy')
  onLocalBusyChange(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      this.$emit('update:busy', newVal)
    }
  }

  // Event handler helper
  stopIfBusy(evt:Event) {
    if (this.computedBusy) {
      // If table is busy (via provider) then don't propagate
      evt.preventDefault()
      evt.stopPropagation()
      return true
    }
    return false
  }
  // Renter the busy indicator or return null if not busy
  renderBusy() {
    const h = this.$createElement

    // Return a busy indicator row, or null if not busy
    if (this.computedBusy && this.hasNormalizedSlot('table-busy')) {
      // Show the busy slot
      const trAttrs = {
        role: this.isStacked ? 'row' : null
      }
      const tdAttrs = {
        colspan: String(this.computedFields.length),
        role: this.isStacked ? 'cell' : null
      }
      return h(
        'tr',
        {
          key: 'table-busy-slot',
          staticClass: 'b-table-busy-slot',
          class: [
            isFunction(this.tbodyTrClass)
              ? this.tbodyTrClass(null, 'table-busy')
              : this.tbodyTrClass
          ],
          attrs: trAttrs
        },
        [h('td', { attrs: tdAttrs }, [this.normalizeSlot('table-busy', {})])]
      )
    } else {
      // We return null here so that we can determine if we need to
      // render the table items rows or not.
      return null
    }
  }
}
}