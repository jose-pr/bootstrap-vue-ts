import { u as bindTargets, v as unbindTargets, x as removeAttr, y as setAttr } from './fbe932e6.js';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Target listen types
const listenTypes = { click: true };
// Emitted show event for modal
const EVENT_SHOW = 'bv::show::modal';
const setRole = (el, binding, vnode) => {
    if (el.tagName !== 'BUTTON') {
        setAttr(el, 'role', 'button');
    }
};
/*
 * Export our directive
 */
const VBModal = {
    // eslint-disable-next-line no-shadow-restricted-names
    bind(el, binding, vnode) {
        bindTargets(vnode, binding, listenTypes, ({ targets, vnode }) => {
            targets.forEach((target) => {
                vnode.context.$root.$emit(EVENT_SHOW, target, vnode.elm);
            });
        });
        // If element is not a button, we add `role="button"` for accessibility
        setRole(el);
    },
    // @ts-ignore
    updated: setRole,
    componentUpdated: setRole,
    unbind(el, binding, vnode) {
        unbindTargets(vnode, binding, listenTypes);
        // If element is not a button, we add `role="button"` for accessibility
        if (el.tagName !== 'BUTTON') {
            removeAttr(el, 'role');
        }
    }
};

export { VBModal as V, VBModal as a };
