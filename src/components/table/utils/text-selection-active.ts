// Helper to determine if a there is an active text selection on the document page.
// Used to filter out click events caused by the mouse up at end of selection
//
// Accepts an element as only argument to test to see if selection overlaps or is
// contained within the element

import { isElement } from '@utils'

export const textSelectionActive = (el: HTMLElement | Document = document) => {
  const win = window
  /* istanbul ignore if: JSDOM doesn't support getSelection */
  if (win && win.getSelection && String(win.getSelection()) !== '' && isElement(el)) {
    /* istanbul ignore next: JSDOM doesn't support getSelection */
    const sel = win.getSelection() as Selection
    /* istanbul ignore next: JSDOM doesn't support getSelection */
    return sel.containsNode ? sel.containsNode(el, true) : false
  } else {
    return false
  }
}
export default textSelectionActive
