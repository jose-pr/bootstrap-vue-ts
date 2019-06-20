import { Component, Prop, Mixins } from 'vue-property-decorator'
import { htmlOrText, VNodeData } from '@utils'
import { IdMixin, NormalizeSlotMixin } from '@mixins'

@Component({})
export class CaptionMixin<T = unknown> extends Mixins(IdMixin, NormalizeSlotMixin) {
  @Prop() caption?: string
  @Prop() captionHtml?: string
  @Prop({ default: false }) captionTop!: boolean

  //placeholder
  isStacked?: boolean

  get captionClasses() {
    return {
      'b-table-caption-top': this.captionTop
    }
  }
  get captionId() {
    // Even though this.safeId looks like a method, it is a computed prop
    // that returns a new function if the underlying ID changes
    return this.isStacked ? this.safeId('_caption_') : null
  }

  renderCaption() {
    const h = this.$createElement

    // Build the caption
    const $captionSlot = this.normalizeSlot('table-caption')
    let $caption = h()

    if ($captionSlot || this.caption || this.captionHtml) {
      const data: VNodeData = {
        key: 'caption',
        class: this.captionClasses,
        attrs: { id: this.captionId }
      }
      if (!$captionSlot) {
        data.domProps = htmlOrText(this.captionHtml, this.caption)
      }
      $caption = h('caption', data, [$captionSlot])
    }

    return $caption
  }
}
export default CaptionMixin
