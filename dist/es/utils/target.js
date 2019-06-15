import { keys } from './object';
import { eventOn, eventOff } from './dom';
const allListenTypes = { hover: true, click: true, focus: true };
const BVBoundListeners = '__BV_boundEventListeners__';
const getTargets = (binding) => {
    const targets = keys(binding.modifiers || {}).filter(t => !allListenTypes[t]);
    if (binding.value) {
        targets.push(binding.value);
    }
    return targets;
};
const bindTargets = (vnode, binding, listenTypes, fn) => {
    const targets = getTargets(binding);
    const listener = () => {
        fn({ targets, vnode });
    };
    keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            let el = vnode.elm;
            eventOn(el, type, listener);
            const boundListeners = el[BVBoundListeners] || {};
            boundListeners[type] = boundListeners[type] || [];
            boundListeners[type].push(listener);
            el[BVBoundListeners] = boundListeners;
        }
    });
    // Return the list of targets
    return targets;
};
const unbindTargets = (vnode, binding, listenTypes) => {
    keys(allListenTypes).forEach(type => {
        if (listenTypes[type] || binding.modifiers[type]) {
            let el = vnode.elm;
            const boundListeners = el[BVBoundListeners] && el[BVBoundListeners][type];
            if (boundListeners) {
                boundListeners.forEach(listener => eventOff(el, type, listener));
                delete el[BVBoundListeners][type];
            }
        }
    });
};
export { bindTargets, unbindTargets, getTargets };
export default bindTargets;
