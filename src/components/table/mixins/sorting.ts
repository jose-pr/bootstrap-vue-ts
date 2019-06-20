import { arrayIncludes, startCase, isFunction, isNull, isUndefined, stableSort } from '@utils'
import { defaultSortCompare, TableField } from '../utils'
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ItemsMixin from './items'

export function isSortable(obj: unknown): obj is SortingMixin {
  return (obj as SortingMixin).isSortable
}

export class SortingMixin extends Mixins(ItemsMixin) {
  @Prop({ default: '' })
  sortBy!: string
  // To Do: Make this tri-state: true, false, null
  @Prop({ default: false })
  sortDesc!: boolean | null
  // This prop is named incorrectly.
  // It should be initialSortDirection
  // As it is a bit misleading (not to mention screws up
  // the Aria Label on the headers)
  @Prop({
    default: 'asc',
    validator: direction => arrayIncludes(['asc', 'desc', 'last'], direction)
  })
  sortDirection!: 'asc' | 'desc' | 'last'
  @Prop()
  sortCompare?: Function
  // Another prop that should have had a better name.
  // It should be noSortClear (on non-sortable headers).
  // We will need to make sure the documentation is clear on what
  // this prop does (as well as in the code for future reference)
  @Prop()
  noSortReset: boolean = false
  @Prop({ default: 'Click to sort Ascending' })
  labelSortAsc!: string
  @Prop({ default: 'Click to sort Descending' })
  labelSortDesc!: string
  @Prop({ default: 'Click to clear sorting' })
  labelSortClear!: string
  @Prop()
  noLocalSorting: boolean = false
  @Prop()
  noFooterSorting: boolean = false

  //Data
  localSortBy: string = ''
  localSortDesc: boolean = false

  //Placeholder
  noProviderSorting?: Function

  created() {
    this.localSortBy = this.sortBy || ''
    this.localSortDesc = this.sortDesc || false
    if (this.isSortable) {
      this.$on('head-clicked', this.handleSort)
    }
  }

  get localSorting() {
    return this.hasProvider ? !!this.noProviderSorting : !this.noLocalSorting
  }

  get isSortable() {
    return this.computedFields.some(f => f.sortable)
  }

  get sortedItems() {
    // Sorts the filtered items and returns a new array of the sorted items
    // or the original items array if not sorted.
    let items = (this.filteredItems || this.localItems || []).slice()
    const sortBy = this.localSortBy
    const sortDesc = this.localSortDesc
    const sortCompare = this.sortCompare
    const localSorting = this.localSorting
    if (sortBy && localSorting) {
      // stableSort returns a new array, and leaves the original array intact
      return stableSort(items, (a, b) => {
        let result = null
        if (isFunction(sortCompare)) {
          // Call user provided sortCompare routine
          result = sortCompare(a, b, sortBy, sortDesc)
        }
        if (isUndefined(result) || isNull(result) || result === false) {
          // Fallback to built-in defaultSortCompare if sortCompare
          // is not defined or returns null/false
          result = defaultSortCompare(a, b, sortBy)
        }
        // Negate result if sorting in descending order
        return (result || 0) * (sortDesc ? -1 : 1)
      })
    }
    return items
  }

  @Watch('isSortable')
  onIsSortableChange(newVal: boolean) /* istanbul ignore next: pain in the butt to test */ {
    if (newVal) {
      if (this.isSortable) {
        this.$on('head-clicked', this.handleSort)
      }
    } else {
      this.$off('head-clicked', this.handleSort)
    }
  }
  onSortDescChange(newVal: boolean) {
    if (newVal === this.localSortDesc) {
      /* istanbul ignore next */
      return
    }
    this.localSortDesc = newVal || false
  }
  onSortByChange(newVal: string) {
    if (newVal === this.localSortBy) {
      /* istanbul ignore next */
      return
    }
    this.localSortBy = newVal || ''
  }
  // Update .sync props
  onLocalSortDescChange(newVal: boolean, oldVal: boolean) {
    // Emit update to sort-desc.sync
    if (newVal !== oldVal) {
      this.$emit('update:sortDesc', newVal)
    }
  }
  onLocalSortByChange(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.$emit('update:sortBy', newVal)
    }
  }

  // Handlers
  // Need to move from thead-mixin
  handleSort(key: string, field: TableField, evt: Event, isFoot: boolean) {
    if (!this.isSortable) {
      /* istanbul ignore next */
      return
    }
    if (isFoot && this.noFooterSorting) {
      return
    }
    // TODO: make this tri-state sorting
    // cycle desc => asc => none => desc => ...
    let sortChanged = false
    const toggleLocalSortDesc = () => {
      const sortDirection = field.sortDirection || this.sortDirection
      if (sortDirection === 'asc') {
        this.localSortDesc = false
      } else if (sortDirection === 'desc') {
        this.localSortDesc = true
      } else {
        // sortDirection === 'last'
        // Leave at last sort direction from previous column
      }
    }
    if (field.sortable) {
      if (key === this.localSortBy) {
        // Change sorting direction on current column
        this.localSortDesc = !this.localSortDesc
      } else {
        // Start sorting this column ascending
        this.localSortBy = key
        // this.localSortDesc = false
        toggleLocalSortDesc()
      }
      sortChanged = true
    } else if (this.localSortBy && !this.noSortReset) {
      this.localSortBy = ''
      toggleLocalSortDesc()
      sortChanged = true
    }
    if (sortChanged) {
      // Sorting parameters changed
      this.$emit('sort-changed', this.context)
    }
  }
  // methods to compute classes and attrs for thead>th cells
  sortTheadThClasses(key: string, field: TableField, isFoot: boolean) {
    return {
      // No Classes for sorting currently...
      // All styles targeted using aria-* attrs
    }
  }
  sortTheadThAttrs(
    key: string,
    field: TableField,
    isFoot: boolean
  ): { 'aria-label'?: string; 'aria-sort'?: string } {
    if (!this.isSortable || (isFoot && this.noFooterSorting)) {
      // No attributes if not a sortable table
      return {}
    }
    const sortable = field.sortable
    let ariaLabel = ''
    if ((!field.label || !field.label.trim()) && !field.headerTitle) {
      // In case field's label and title are empty/blank, we need to
      // add a hint about what the column is about for non-sighted users.
      // This is duplicated code from tbody-row mixin, but we need it
      // here as well, since we overwrite the original aria-label.
      /* istanbul ignore next */
      ariaLabel = startCase(key)
    }
    // The correctness of these labels is very important for screen-reader users.
    let ariaLabelSorting = ''
    if (sortable) {
      if (this.localSortBy === key) {
        // currently sorted sortable column.
        ariaLabelSorting = this.localSortDesc ? this.labelSortAsc : this.labelSortDesc
      } else {
        // Not currently sorted sortable column.
        // Not using nested ternary's here for clarity/readability
        // Default for ariaLabel
        ariaLabelSorting = this.localSortDesc ? this.labelSortDesc : this.labelSortAsc
        // Handle sortDirection setting
        const sortDirection = this.sortDirection || field.sortDirection
        if (sortDirection === 'asc') {
          ariaLabelSorting = this.labelSortAsc
        } else if (sortDirection === 'desc') {
          ariaLabelSorting = this.labelSortDesc
        }
      }
    } else if (!this.noSortReset) {
      // Non sortable column
      ariaLabelSorting = this.localSortBy ? this.labelSortClear : ''
    }
    // Assemble the aria-label attribute value
    ariaLabel = [ariaLabel.trim(), ariaLabelSorting.trim()].filter(Boolean).join(': ')
    // Assemble the aria-sort attribute value
    const ariaSort =
      sortable && this.localSortBy === key
        ? this.localSortDesc
          ? 'descending'
          : 'ascending'
        : sortable
        ? 'none'
        : undefined
    // Return the attributes
    // (All the above just to get these two values)
    return {
      'aria-label': ariaLabel || undefined,
      'aria-sort': ariaSort
    }
  }
}
