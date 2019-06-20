import { startCase, isArray, isFunction, isObject, isString, keys, Dict } from '@utils'
import { IGNORED_FIELD_KEYS } from './constants'
import { TableField, Formatter, TableFieldAcceptedFormat } from './field'

// Private function to massage field entry into common object format
const processField = (key: string, value: unknown): TableField | undefined => {
  if (isString(value)) {
    // Label shortcut
    return { key: key, label: value }
  } else if (isFunction(value)) {
    // Formatter shortcut
    return { key: key, formatter: value as Formatter }
  } else if (isObject(value)) {
    let field = { ...(value as Partial<TableField> & { key: string }) }
    field.key = field.key || key
    return field
  } else if (value !== false) {
    // Fallback to just key
    /* istanbul ignore next */
    return { key: key }
  }
}

// We normalize fields into an array of objects
// [ { key:..., label:..., ...}, {...}, ..., {..}]
export const normalizeFields = (
  origFields: TableFieldAcceptedFormat | undefined | null,
  items: (unknown)[]
) => {
  let fields: (TableField)[] = []

  if (isArray(origFields)) {
    // Normalize array Form
    ;(origFields as (string | TableField)[])
      .filter(f => f)
      .forEach(f => {
        if (isString(f)) {
          fields.push({ key: f, label: startCase(f) })
        } else if (isObject(f) && f.key && isString(f.key)) {
          // Full object definition. We use assign so that we don't mutate the original
          fields.push({ ...f })
        } else if (isObject(f) && keys(f).length === 1) {
          // Shortcut object (i.e. { 'foo_bar': 'This is Foo Bar' }
          const key = keys(f)[0]
          const field = processField(key, f[key])
          if (field) {
            fields.push(field)
          }
        }
      })
  } else if (origFields && isObject(origFields) && keys(origFields).length > 0) {
    // Normalize object Form (deprecated)
    keys(origFields).forEach(key => {
      let field = processField(key, origFields[key])
      if (field) {
        fields.push(field)
      }
    })
  }

  // If no field provided, take a sample from first record (if exits)
  if (fields.length === 0 && isArray(items) && items.length > 0) {
    const sample = items[0]
    keys(sample).forEach(k => {
      if (!(IGNORED_FIELD_KEYS as Dict<boolean>)[k]) {
        fields.push({ key: k, label: startCase(k) })
      }
    })
  }

  // Ensure we have a unique array of fields and that they have String labels
  const memo: Dict<boolean> = {}
  return fields.filter(f => {
    if (!memo[f.key]) {
      memo[f.key] = true
      f.label = isString(f.label) ? f.label : startCase(f.key)
      return true
    }
    return false
  })
}

export default normalizeFields
