import { getComponentConfig, Component, Mixins, Prop, ElementClass } from '@utils'
import { ItemsMixin } from './items'
import { NormalizeSlotMixin } from '@mixins'

@Component({})
export class TFootMixin extends Mixins(ItemsMixin, NormalizeSlotMixin) {
  @Prop()
  footClone: boolean = false
  @Prop({ default: () => getComponentConfig('BTable', 'footVariant') })
  footVariant!: string
  @Prop()
  tfootClass?: ElementClass
  @Prop()
  tfootTrClass?: ElementClass

  get footClasses() {
    const variant =
      this.footVariant || ((this as unknown) as { headVariant: string }).headVariant || null
    return [variant ? `thead-${variant}` : '', this.tfootClass]
  }

  renderTfoot() {
    const h = this.$createElement

    // Passing true to renderThead will make it render a tfoot
    return this.footClone ? ((this as unknown) as { renderThead: Function }).renderThead(true) : h()
  }
}
