import { Dict } from '@utils'
export type Formatter<FieldType = unknown, ItemType = unknown> = (
  value?: FieldType | undefined,
  key?: string,
  item?: ItemType
) => string | undefined | null
export interface TableField<FieldType = unknown, ItemType = unknown> {
  key: string
  label?: string
  formatter?: Formatter<FieldType, ItemType>
  variant?: string
  class?: string
  thClass?: string
  headerTitle?: string
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | 'last'
  thStyle?: string
  headerAbbr?: string
  labelHtml?: string
}
export type TableFieldAcceptedFormat<ItemType = unknown> =
  | TableField<unknown, ItemType>[]
  | string[]
  | Dict<TableField<unknown, ItemType>>
