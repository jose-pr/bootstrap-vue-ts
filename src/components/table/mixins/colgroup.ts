import { Component, Mixins } from 'vue-property-decorator'
import ItemsMixin from './items'
import { NormalizeSlotMixin } from '@mixins'

@Component({})
export class ColgroupMixin extends Mixins(ItemsMixin, NormalizeSlotMixin) {
  renderColgroup() {
    const h = this.$createElement

    const fields = this.computedFields
    let $colgroup = h()

    if (this.hasNormalizedSlot('table-colgroup')) {
      $colgroup = h('colgroup', { key: 'colgroup' }, [
        this.normalizeSlot('table-colgroup', { columns: fields.length, fields: fields })
      ])
    }

    return $colgroup
  }
}
export default ColgroupMixin
