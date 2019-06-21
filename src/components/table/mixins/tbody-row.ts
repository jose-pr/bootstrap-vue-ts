import {
  isFunction,
  isNull,
  isString,
  isUndefined,
  get,
  arrayIncludes,
  Component,
  Mixins,
  Prop,
  ElementClass,
  Vue,
  KEY_CODES as KeyCodes
} from '@utils'
import { textSelectionActive, TableField, TableItem, filterEvent } from '../utils'

import { ItemsMixin } from './items'
import { IdMixin } from '@mixins'
@Component({})
export class TBodyRowMixin extends Mixins(IdMixin, ItemsMixin) {
  @Prop() tbodyTrClass?: ElementClass & ((item: TableItem, type: string) => string)

  //Placeholders
  dark?: string
  isStacked?: boolean
  stopIfBusy?: (evt: Event) => void
  selectedRows?: TableItem[]
  striped?: boolean
  selectable?: boolean
  selectableRowClasses?: (i: number) => Dict<boolean>
  selectableRowAttrs?: (i: number) => Dict<boolean>

  // Methods for computing classes, attributes and styles for table cells
  tdClasses(field: TableField, item: TableItem) {
    let cellVariant = ''
    if (item._cellVariants && item._cellVariants[field.key]) {
      cellVariant = `${this.dark ? 'bg' : 'table'}-${item._cellVariants[field.key]}`
    }
    return [
      field.variant && !cellVariant ? `${this.dark ? 'bg' : 'table'}-${field.variant}` : '',
      cellVariant,
      field.class ? field.class : '',
      this.getTdValues(item, field.key, field.tdClass, '')
    ]
  }
  tdAttrs(field: TableField, item: TableItem, colIndex: number) {
    const attrs: Dict<string | undefined> = {
      role: 'cell',
      'aria-colindex': String(colIndex + 1)
    }
    if (field.isRowHeader) {
      attrs.scope = 'row'
      attrs.role = 'rowheader'
    }
    if (this.isStacked) {
      // Generate the "header cell" label content in stacked mode
      attrs['data-label'] = field.label
    }
    return { ...attrs, ...this.getTdValues(item, field.key, field.tdAttr, {}) }
  }
  rowClasses(item: TableItem) {
    return [
      item._rowVariant ? `${this.dark ? 'bg' : 'table'}-${item._rowVariant}` : '',
      isFunction(this.tbodyTrClass) ? this.tbodyTrClass(item, 'row') : this.tbodyTrClass
    ]
  }
  getTdValues(
    item: TableItem,
    key: string,
    tdValue:
      | string
      | Dict<string>
      | undefined
      | ((val: unknown, key: string, item: TableItem) => Dict<string>),
    defValue: {}
  ) {
    const parent = this.$parent
    if (tdValue) {
      const value = get(item, key, '')
      if (isFunction(tdValue)) {
        return tdValue(value, key, item)
      } else if (isString(tdValue) && isFunction(parent[tdValue as keyof Vue])) {
        return parent[tdValue as keyof Vue](value, key, item)
      }
      return tdValue
    }
    return defValue
  }
  // Method to get the value for a field
  getFormattedValue(item: TableItem, field: TableField) {
    const key = field.key
    const formatter = field.formatter
    const parent = this.$parent
    let value = get(item, key, null)
    if (formatter) {
      if (isFunction(formatter)) {
        value = formatter(value, key, item)
      } else if (isString(formatter) && isFunction(parent[formatter])) {
        value = parent[formatter as keyof Vue](value, key, item)
      }
    }
    return isUndefined(value) || isNull(value) ? '' : value
  }
  tbodyRowKeydown(evt: Event & KeyboardEvent, item: TableItem, rowIndex: number) {
    const keyCode = evt.keyCode
    const target = evt.target as HTMLElement
    const trs = this.$refs.itemRows as HTMLElement[]
    if (this.stopIfBusy && this.stopIfBusy(evt)) {
      // If table is busy (via provider) then don't propagate
      return
    } else if (!(target && target.tagName === 'TR' && target === document.activeElement)) {
      // Ignore if not the active tr element
      return
    } else if (target.tabIndex !== 0) {
      // Ignore if not focusable
      /* istanbul ignore next */
      return
    } else if (trs && trs.length === 0) {
      /* istanbul ignore next */
      return
    }
    const index = trs.indexOf(target)
    if (keyCode === KeyCodes.ENTER || keyCode === KeyCodes.SPACE) {
      evt.stopPropagation()
      evt.preventDefault()
      // We also allow enter/space to trigger a click (when row is focused)
      // We translate to a row-clicked event
      this.rowClicked(evt, item, rowIndex)
    } else if (arrayIncludes([KeyCodes.UP, KeyCodes.DOWN, KeyCodes.HOME, KeyCodes.END], keyCode)) {
      evt.stopPropagation()
      evt.preventDefault()
      const shift = evt.shiftKey
      if (keyCode === KeyCodes.HOME || (shift && keyCode === KeyCodes.UP)) {
        // Focus first row
        trs[0].focus()
      } else if (keyCode === KeyCodes.END || (shift && keyCode === KeyCodes.DOWN)) {
        // Focus last row
        trs[trs.length - 1].focus()
      } else if (keyCode === KeyCodes.UP && index > 0) {
        // Focus previous row
        trs[index - 1].focus()
      } else if (keyCode === KeyCodes.DOWN && index < trs.length - 1) {
        // Focus next row
        trs[index + 1].focus()
      }
    }
  }
  // Row event handlers
  rowClicked(e: Event, item: TableItem, index: number) {
    if (this.stopIfBusy && this.stopIfBusy(e)) {
      // If table is busy (via provider) then don't propagate
      return
    } else if (filterEvent(e)) {
      // clicked on a non-disabled control so ignore
      return
    } else if (textSelectionActive(this.$el)) {
      // User is selecting text, so ignore
      /* istanbul ignore next: JSDOM doesn't support getSelection() */
      return
    }
    this.$emit('row-clicked', item, index, e)
  }
  middleMouseRowClicked(e: Event, item: TableItem, index: number) {
    if (this.stopIfBusy && this.stopIfBusy(e)) {
      // If table is busy (via provider) then don't propagate
      return
    }
    this.$emit('row-middle-clicked', item, index, e)
  }
  rowDblClicked(e: Event, item: TableItem, index: number) {
    if (this.stopIfBusy && this.stopIfBusy(e)) {
      // If table is busy (via provider) then don't propagate
      return
    } else if (filterEvent(e)) {
      // clicked on a non-disabled control so ignore
      /* istanbul ignore next: event filtering already tested via click handler */
      return
    }
    this.$emit('row-dblclicked', item, index, e)
  }
  rowHovered(e: Event, item: TableItem, index: number) {
    if (this.stopIfBusy && this.stopIfBusy(e)) {
      // If table is busy (via provider) then don't propagate
      return
    }
    this.$emit('row-hovered', item, index, e)
  }
  rowUnhovered(e: Event, item: TableItem, index: number) {
    if (this.stopIfBusy && this.stopIfBusy(e)) {
      // If table is busy (via provider) then don't propagate
      return
    }
    this.$emit('row-unhovered', item, index, e)
  }
  rowContextmenu(e: Event, item: TableItem, index: number) {
    if (this.stopIfBusy && this.stopIfBusy(e)) {
      // If table is busy (via provider) then don't propagate
      return
    }
    this.$emit('row-contextmenu', item, index, e)
  }
  // Render helpers
  renderTbodyRowCell(field: TableField, colIndex: number, item: TableItem, rowIndex: number) {
    const h = this.$createElement

    // Renders a TD or TH for a row's field
    const $scoped = this.$scopedSlots
    const detailsSlot = $scoped['row-details']
    const formatted = this.getFormattedValue(item, field)
    const data = {
      // For the Vue key, we concatenate the column index and
      // field key (as field keys can be duplicated)
      key: `row-${rowIndex}-cell-${colIndex}-${field.key}`,
      class: this.tdClasses(field, item),
      attrs: this.tdAttrs(field, item, colIndex)
    }
    const toggleDetailsFn = () => {
      if (detailsSlot) {
        this.$set(item, '_showDetails', !item._showDetails)
      }
    }
    const slotScope = {
      item: item,
      index: rowIndex,
      field: field,
      unformatted: get(item, field.key, ''),
      value: formatted,
      toggleDetails: toggleDetailsFn,
      detailsShowing: Boolean(item._showDetails),
      rowSelected: undefined as undefined | boolean
    }
    if (this.selectedRows) {
      // Add in rowSelected scope property if selectable rows supported
      slotScope.rowSelected = Boolean(this.selectedRows[rowIndex])
    }
    let scope = $scoped[field.key]
    let $childNodes = scope ? scope(slotScope) : toString(formatted)
    if (this.isStacked) {
      // We wrap in a DIV to ensure rendered as a single cell when visually stacked!
      $childNodes = [h('div', {}, [$childNodes])]
    }
    // Render either a td or th cell
    return h(field.isRowHeader ? 'th' : 'td', data, [$childNodes])
  }
  renderTbodyRow(item: TableItem, rowIndex: number) {
    // Renders an item's row (or rows if details supported)
    const h = this.$createElement
    const $scoped = this.$scopedSlots
    const fields = this.computedFields
    const tableStriped = this.striped
    const hasRowClickHandler = this.$listeners['row-clicked'] || this.selectable
    const $detailsSlot = $scoped['row-details']
    const rowShowDetails = Boolean(item._showDetails && $detailsSlot)

    // We can return more than one TR if rowDetails enabled
    const $rows = []

    // Details ID needed for aria-describedby when details showing
    const detailsId = rowShowDetails ? this.safeId(`_details_${rowIndex}_`) : null
    const toggleDetailsFn = () => {
      if ($detailsSlot) {
        this.$set(item, '_showDetails', !item._showDetails)
      }
    }

    // For each item data field in row
    const $tds = fields.map((field, colIndex) => {
      return this.renderTbodyRowCell(field, colIndex, item, rowIndex)
    })

    // Calculate the row number in the dataset (indexed from 1)
    let ariaRowIndex = null
    if (this.currentPage && this.perPage && this.perPage > 0) {
      ariaRowIndex = String(
        ((this.currentPage as number) - 1) * (this.perPage as number) + rowIndex + 1
      )
    }

    // Create a unique :key to help ensure that sub components are re-rendered rather than
    // re-used, which can cause issues. If a primary key is not provided we use the rendered
    // rows index within the tbody.
    // See: https://github.com/bootstrap-vue/bootstrap-vue/issues/2410
    const primaryKey = this.primaryKey
    const rowKey =
      primaryKey && !isUndefined(item[primaryKey]) && !isNull(item[primaryKey])
        ? toString(item[primaryKey])
        : String(rowIndex)

    // If primary key is provided, use it to generate a unique ID on each tbody > tr
    // In the format of '{tableId}__row_{primaryKeyValue}'
    const rowId =
      primaryKey && !isUndefined(item[primaryKey]) && !isNull(item[primaryKey])
        ? this.safeId(`_row_${item[primaryKey]}`)
        : null

    const handlers: Dict<(evt: Event & KeyboardEvent) => void> = {}
    if (hasRowClickHandler) {
      handlers['click'] = evt => {
        this.rowClicked(evt, item, rowIndex)
      }
      handlers['keydown'] = evt => {
        this.tbodyRowKeydown(evt, item, rowIndex)
      }
    }

    // Selctable classes and attributes
    const selectableClasses = this.selectableRowClasses ? this.selectableRowClasses(rowIndex) : {}
    const selectableAttrs = this.selectableRowAttrs ? this.selectableRowAttrs(rowIndex) : {}

    // Add the item row
    $rows.push(
      h(
        'tr',
        {
          key: `__b-table-row-${rowKey}__`,
          ref: 'itemRows',
          refInFor: true,
          class: [
            this.rowClasses(item),
            selectableClasses,
            {
              'b-table-has-details': rowShowDetails
            }
          ],
          attrs: {
            id: rowId,
            tabindex: hasRowClickHandler ? '0' : null,
            'data-pk': rowId ? String(item[primaryKey as string]) : null,
            'aria-describedby': detailsId,
            'aria-owns': detailsId,
            'aria-rowindex': ariaRowIndex,
            role: 'row',
            ...selectableAttrs
          },
          on: {
            ...handlers,
            // TODO: Instantiate the following handlers only if we have registered
            //       listeners i.e. this.$listeners['row-middle-clicked'], etc.
            auxclick: (evt: KeyboardEvent) => {
              if (evt.which === 2) {
                this.middleMouseRowClicked(evt, item, rowIndex)
              }
            },
            contextmenu: (evt: KeyboardEvent) => {
              this.rowContextmenu(evt, item, rowIndex)
            },
            // Note: these events are not accessibility friendly!
            dblclick: (evt: KeyboardEvent) => {
              this.rowDblClicked(evt, item, rowIndex)
            },
            mouseenter: (evt: KeyboardEvent) => {
              this.rowHovered(evt, item, rowIndex)
            },
            mouseleave: (evt: KeyboardEvent) => {
              this.rowUnhovered(evt, item, rowIndex)
            }
          }
        },
        $tds
      )
    )

    // Row Details slot
    if (rowShowDetails) {
      const tdAttrs = {
        colspan: String(fields.length),
        role: 'cell'
      }
      const trAttrs = {
        id: detailsId,
        role: 'row'
      }
      // Render the details slot
      const $details = h('td', { attrs: tdAttrs }, [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $detailsSlot!({
          item: item,
          index: rowIndex,
          fields: fields,
          toggleDetails: toggleDetailsFn
        })
      ])

      // Add a hidden row to keep table row striping consistent when details showing
      if (tableStriped) {
        $rows.push(
          h('tr', {
            key: `__b-table-details-${rowIndex}-stripe__`,
            staticClass: 'd-none',
            attrs: { 'aria-hidden': 'true', role: 'presentation' }
          })
        )
      }

      // Add the actual details row
      $rows.push(
        h(
          'tr',
          {
            key: `__b-table-details-${rowIndex}__`,
            staticClass: 'b-table-details',
            class: [
              isFunction(this.tbodyTrClass)
                ? this.tbodyTrClass(item, 'row-details')
                : this.tbodyTrClass
            ],
            attrs: trAttrs
          },
          [$details]
        )
      )
    } else if ($detailsSlot) {
      // Only add the placeholder if a the table has a row-details slot defined (but not shown)
      $rows.push(h())
      if (tableStriped) {
        // add extra placeholder if table is striped
        $rows.push(h())
      }
    }

    // Return the row(s)
    return $rows
  }
}
