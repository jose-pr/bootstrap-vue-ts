import { Component, Prop } from 'vue-property-decorator'
import { Vue } from '@utils'

/*
 * SSR Safe Client Side ID attribute generation
 * id's can only be generated client side, after mount.
 * this._uid is not synched between server and client.
 */

@Component({})
export class IdMixin extends Vue {
  @Prop() id?: string
  localId_?: string

  get safeId(): (suffix: unknown) => string | undefined {
    // Computed property that returns a dynamic function for creating the ID.
    // Reacts to changes in both .id and .localId_ And regens a new function
    const id = this.id || this.localId_

    // We return a function that accepts an optional suffix string
    // So this computed prop looks and works like a method!!!
    // But benefits from Vue's Computed prop caching
    const fn = (suffix: unknown) => {
      if (!id) {
        return undefined
      }
      suffix = String(suffix || '').replace(/\s+/g, '_')
      return suffix ? id + '_' + suffix : id
    }
    return fn
  }

  mounted() {
    // mounted only occurs client side
    this.$nextTick(() => {
      // Update dom with auto ID after dom loaded to prevent
      // SSR hydration errors.
      this.localId_ = `__BVID__${this._uid}`
    })
  }
}
export default IdMixin
