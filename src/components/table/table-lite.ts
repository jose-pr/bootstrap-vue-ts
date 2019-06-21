import { VueExtended as Vue } from '@utils'

// Mixins
import { IdMixin, NormalizeSlotMixin } from '@mixins'

// Local Mixins
import {
  ItemsMixin,
  CaptionMixin,
  ColgroupMixin,
  THeadMixin,
  TFootMixin,
  TBodyMixin
} from './mixins'

// b-table-lite component definition
// @vue/component
export const BTableLite = /*#__PURE__*/ Vue.extend({
  name: 'BTableLite',
  // Order of mixins is important!
  // They are merged from first to last, followed by this component.
  mixins: [
    // Required mixins
    idMixin,
    normalizeSlotMixin,
    itemsMixin,
    tableRendererMixin,
    theadMixin,
    tfootMixin,
    tbodyMixin,
    // Features Mixins
    // These are pretty lightweight, and are useful for plain tables
    captionMixin,
    colgroupMixin
  ]
  // render function provided by table-renderer mixin
})

export default BTableLite
