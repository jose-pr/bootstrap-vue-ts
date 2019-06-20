import { BvPlugin, installFactory } from '../../core/BvPlugin'
//
//Import all plugin components
//
import * as BTableLiteComponent from './table-lite'

export const TableComponents = {
  BTableLite: BTableLiteComponent.default
}
//
//Plugin
//
const TablePlugin: BvPlugin = {
  install: installFactory({
    components: TableComponents
  })
}
//
//Exports
//
export default TablePlugin
export { TablePlugin }
export * from './table-lite'
