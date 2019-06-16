/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  setAttr,
  removeAttr,
  bindTargets,
  unbindTargets,
  VNode,
  DirectiveOptions,
  DirectiveBinding
} from '../../utils'

// Target listen types
const listenTypes = { click: true }

// Emitted show event for modal
const EVENT_SHOW = 'bv::show::modal'

const setRole = (el: Element, binding: DirectiveBinding, vnode: VNode): void => {
  if (el.tagName !== 'BUTTON') {
    setAttr(el, 'role', 'button')
  }
}

/*
 * Export our directive
 */
export const VBModal: DirectiveOptions = {
  // eslint-disable-next-line no-shadow-restricted-names
  bind(el: Element, binding: DirectiveBinding, vnode: VNode): void {
    bindTargets(vnode, binding, listenTypes, ({ targets, vnode }): void => {
      targets.forEach((target): void => {
        vnode!.context!.$root.$emit(EVENT_SHOW, target, vnode.elm)
      })
    })
    // If element is not a button, we add `role="button"` for accessibility
    setRole(el, binding, vnode)
  },
  // @ts-ignore
  updated: setRole,
  componentUpdated: setRole,
  unbind(el: Element, binding: DirectiveBinding, vnode: VNode): void {
    unbindTargets(vnode, binding, listenTypes)
    // If element is not a button, we add `role="button"` for accessibility
    if (el.tagName !== 'BUTTON') {
      removeAttr(el, 'role')
    }
  }
}

export default VBModal
