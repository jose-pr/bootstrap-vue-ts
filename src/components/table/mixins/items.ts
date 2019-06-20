import { Component, Prop, Watch } from 'vue-property-decorator'
import { Vue, looseEqual, isArray, isNull, isUndefined } from '@utils'
import normalizeFields from '../utils/normalize-fields'
import { TableFieldAcceptedFormat, TableField } from '../utils/field'

@Component({})
export class ItemsMixin<T = unknown> extends Vue {
  @Prop({
    default() {
      return []
    }
  })
  items!: T[]
  @Prop() fields?: TableFieldAcceptedFormat
  // Primary key for record.
  // If provided the value in each row must be unique!!!
  @Prop() primaryKey?: string
  // v-model for retrieving the current displayed rows
  @Prop({
    default() {
      return []
    }
  })
  value?: T[]

  // Our local copy of the items. Must be an array
  localItems: T[] = [] //isArray(this.items) ? this.items.slice() : []
  //PLaceholders
  paginatedItems?: T[]
  sortedItems?: T[]
  filteredItems?: T[]
  localFilter?: Function
  localSortBy?: string
  localSortDesc?: boolean
  perPage: number | string = 0
  currentPage: number | string = 1
  apiUrl?: string
  hasProvider?: boolean
  isSortable?: boolean
  footClasses?: unknown
  isStacked?: boolean

  get computedFields() {
    // We normalize fields into an array of objects
    // [ { key:..., label:..., ...}, {...}, ..., {..}]
    return normalizeFields(this.fields, this.localItems)
  }
  get computedFieldsObj() /* istanbul ignore next: not using at the moment */ {
    // Fields as a simple lookup hash object
    // Mainly for scopedSlots for convenience
    return this.computedFields.reduce<Dict<TableField>>((obj, f) => {
      obj[f.key] = f as TableField
      return obj
    }, {})
  }
  get computedItems() {
    // Fallback if various mixins not provided
    return (
      this.paginatedItems ||
      this.sortedItems ||
      this.filteredItems ||
      this.localItems ||
      []
    ).slice()
  }
  get context() {
    // Current state of sorting, filtering and pagination props/values
    return {
      filter: this.localFilter,
      sortBy: this.localSortBy,
      sortDesc: this.localSortDesc,
      perPage: parseInt(this.perPage as string, 10) || 0,
      currentPage: parseInt(this.currentPage as string, 10) || 1,
      apiUrl: this.apiUrl
    }
  }

  //WATCH
  @Watch('items')
  onItemsChange(newItems: T[]) {
    /* istanbul ignore else */
    if (isArray(newItems)) {
      // Set localItems/filteredItems to a copy of the provided array
      this.localItems = newItems.slice()
    } else if (isUndefined(newItems) || isNull(newItems)) {
      /* istanbul ignore next */
      this.localItems = []
    }
  }
  @Watch('computedItems')
  // Watch for changes on computedItems and update the v-model
  onComputedItemsChange(newVal: T[]) {
    this.$emit('input', newVal)
  }
  @Watch('context')
  // Watch for context changes
  onContextChange(newVal: unknown, oldVal: unknown) {
    // Emit context info for external paging/filtering/sorting handling
    if (!looseEqual(newVal, oldVal)) {
      this.$emit('context-changed', newVal)
    }
  }

  created() {
    this.localItems = isArray(this.items) ? this.items.slice() : []
  }

  mounted() {
    // Initially update the v-model of displayed items
    this.$emit('input', this.computedItems)
  }
}
export default ItemsMixin
