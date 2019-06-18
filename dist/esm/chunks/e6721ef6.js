import { I as Directive, l as keys, b as isString, J as isNumber, A as isObject, K as eventOn, L as eventOff, M as observeDom, N as selectAll, H as getAttr, C as select, P as isVisible, d as isUndefined, Q as isElement, R as getBCR, S as hasClass, U as closest, V as matches, E as addClass, F as removeClass, W as position, X as offset } from './5cd47ea1.js';

/* eslint-disable no-this-before-super */
/*
 * Constants / Defaults
 */
const NAME = 'v-b-scrollspy';
const ACTIVATE_EVENT = 'bv::scrollspy::activate';
const Default = {
    element: 'body',
    offset: 10,
    method: 'auto',
    throttle: 75
};
const DefaultType = {
    element: '(string|element|component)',
    offset: 'number',
    method: 'string',
    throttle: 'number'
};
const ClassName = {
    DROPDOWN_ITEM: 'dropdown-item',
    ACTIVE: 'active'
};
const Selector = {
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown, .dropup',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
};
const OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
};
// HREFs must end with a hash followed by at least one non-hash character.
// HREFs in the links are assumed to point to non-external links.
// Comparison to the current page base URL is not performed!
const HREF_REGEX = /^.*(#[^#]+)$/;
// Transition Events
const TransitionEndEvents = [
    'webkitTransitionEnd',
    'transitionend',
    'otransitionend',
    'oTransitionEnd'
];
// Options for events
const EventOptions = { passive: true, capture: false };
/*
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
/* istanbul ignore next: not easy to test */
class ScrollSpy extends Directive /* istanbul ignore next: not easy to test */ {
    init() {
        this.$offsets = [];
        this.$targets = [];
        this.$scrollHeight = 0;
        this.$selector = [Selector.NAV_LINKS, Selector.LIST_ITEMS, Selector.DROPDOWN_ITEMS].join(',');
    }
    static get Name() {
        return NAME;
    }
    static get Default() {
        return Default;
    }
    static get DefaultType() {
        return DefaultType;
    }
    // Build a ScrollSpy config based on bindings (if any)
    // Arguments and modifiers take precedence over passed value config object
    /* istanbul ignore next: not easy to test */
    static ParseBindings(bindings) {
        // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
        const config = {};
        // If argument, assume element ID
        if (bindings.arg) {
            // Element ID specified as arg
            // We must prepend '#' to become a CSS selector
            config.element = `#${bindings.arg}`;
        }
        // Process modifiers
        keys(bindings.modifiers).forEach(mod => {
            if (/^\d+$/.test(mod)) {
                // Offset value
                config.offset = parseInt(mod, 10);
            }
            else if (/^(auto|position|offset)$/.test(mod)) {
                // Offset method
                config.method = mod;
            }
        });
        // Process value
        if (isString(bindings.value)) {
            // Value is a CSS ID or selector
            config.element = bindings.value;
        }
        else if (isNumber(bindings.value)) {
            // Value is offset
            config.offset = Math.round(bindings.value);
        }
        else if (isObject(bindings.value)) {
            keys(bindings.value)
                .filter(k => Boolean(ScrollSpy.DefaultType[k]))
                .forEach(k => {
                config[k] = bindings.value[k];
            });
        }
        return config;
    }
    listen() {
        if (this.$root) {
            const self = this;
            this.$root.$nextTick(() => {
                self._listen();
            });
        }
        else {
            this._listen();
        }
    }
    _listen() {
        const scroller = this.getScroller();
        if (scroller && scroller.tagName !== 'BODY') {
            eventOn(scroller, 'scroll', this, EventOptions);
        }
        eventOn(window, 'scroll', this, EventOptions);
        eventOn(window, 'resize', this, EventOptions);
        eventOn(window, 'orientationchange', this, EventOptions);
        TransitionEndEvents.forEach(evtName => {
            eventOn(window, evtName, this, EventOptions);
        });
        this.setObservers(true);
        // Schedule a refresh
        this.handleEvent('refresh');
    }
    unlisten() {
        const scroller = this.getScroller();
        this.setObservers(false);
        if (scroller && scroller.tagName !== 'BODY') {
            eventOff(scroller, 'scroll', this, EventOptions);
        }
        eventOff(window, 'scroll', this, EventOptions);
        eventOff(window, 'resize', this, EventOptions);
        eventOff(window, 'orientationchange', this, EventOptions);
        TransitionEndEvents.forEach(evtName => {
            eventOff(window, evtName, this, EventOptions);
        });
    }
    setObservers(on) {
        // We observe both the scroller for content changes, and the target links
        if (this.$obsScroller) {
            this.$obsScroller.disconnect();
            this.$obsScroller = undefined;
        }
        if (this.$obsTargets) {
            this.$obsTargets.disconnect();
            this.$obsTargets = undefined;
        }
        if (on) {
            this.$obsTargets =
                observeDom(this.$element || null, () => {
                    this.handleEvent('mutation');
                }, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    attributeFilter: ['href']
                }) || undefined;
            this.$obsScroller =
                observeDom(this.getScroller(), () => {
                    this.handleEvent('mutation');
                }, {
                    subtree: true,
                    childList: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['id', 'style', 'class']
                }) || undefined;
        }
    }
    // general event handler
    handleEvent(evt) {
        const type = isString(evt) ? evt : evt.type;
        const self = this;
        function resizeThrottle() {
            if (!self.activeTimeout('resize') && self.$config) {
                self.setTimeout('resize', () => {
                    self.refresh();
                    self.process();
                    self.clearTimeout('resize');
                }, self.$config.throttle);
            }
        }
        if (type === 'scroll') {
            if (!this.$obsScroller) {
                // Just in case we are added to the DOM before the scroll target is
                // We re-instantiate our listeners, just in case
                this.listen();
            }
            this.process();
        }
        else if (/(resize|orientationchange|mutation|refresh)/.test(type)) {
            // Postpone these events by throttle time
            resizeThrottle();
        }
    }
    // Refresh the list of target links on the element we are applied to
    refresh() {
        const scroller = this.getScroller();
        if (!scroller || !this.$config) {
            return;
        }
        const autoMethod = scroller !== scroller.window ? OffsetMethod.POSITION : OffsetMethod.OFFSET;
        const method = this.$config.method === 'auto' ? autoMethod : this.$config.method;
        const methodFn = method === OffsetMethod.POSITION ? position : offset;
        const offsetBase = method === OffsetMethod.POSITION ? this.getScrollTop() : 0;
        this.$offsets = [];
        this.$targets = [];
        this.$scrollHeight = this.getScrollHeight() // Find all the unique link HREFs that we will control // record only unique targets/offsets
        ;
        selectAll(String(this.$selector), this.$element)
            // Get HREF value
            .map(link => getAttr(link, 'href'))
            // Filter out HREFs that do not match our RegExp
            .filter(href => href && HREF_REGEX.test(href || ''))
            // Find all elements with ID that match HREF hash
            .map(href => {
            // Convert HREF into an ID (including # at beginning)
            const id = href.replace(HREF_REGEX, '$1').trim();
            if (!id) {
                return null;
            }
            // Find the element with the ID specified by id
            const el = select(id, scroller);
            if (el && isVisible(el)) {
                return {
                    offset: parseInt(methodFn(el).top.toString(), 10) + offsetBase,
                    target: id
                };
            }
            return null;
        })
            .filter(Boolean)
            // Sort them by their offsets (smallest first)
            .sort((a, b) => a.offset - b.offset)
            .reduce((memo, item) => {
            if (!memo[item.target] && this.$offsets && this.$targets) {
                this.$offsets.push(item.offset);
                this.$targets.push(item.target);
                memo[item.target] = true;
            }
            return memo;
        }, {});
        // Return this for easy chaining
        return this;
    }
    // Handle activating/clearing
    process() {
        if (!this.$config)
            return;
        const scrollTop = this.getScrollTop() + this.$config.offset;
        const scrollHeight = this.getScrollHeight();
        const maxScroll = this.$config.offset + scrollHeight - this.getOffsetHeight();
        if (this.$scrollHeight !== scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll && this.$targets) {
            const target = this.$targets[this.$targets.length - 1];
            if (this.$activeTarget !== target) {
                this.activate(target);
            }
            return;
        }
        if (this.$offsets &&
            this.$activeTarget &&
            scrollTop < this.$offsets[0] &&
            this.$offsets[0] > 0) {
            this.$activeTarget = undefined;
            this.clear();
            return;
        }
        if (!this.$offsets || !this.$targets)
            return;
        for (let i = this.$offsets.length; i--;) {
            const isActiveTarget = this.$activeTarget !== this.$targets[i] &&
                scrollTop >= this.$offsets[i] &&
                (isUndefined(this.$offsets[i + 1]) || scrollTop < this.$offsets[i + 1]);
            if (isActiveTarget) {
                this.activate(this.$targets[i]);
            }
        }
    }
    getScroller() {
        if (this.$scroller) {
            return this.$scroller;
        }
        let scroller = this.$config
            ? this.$config.element
            : undefined;
        if (!scroller) {
            return undefined;
        }
        else if (isElement(scroller.$el)) {
            scroller = scroller.$el;
        }
        else if (isString(scroller)) {
            scroller = select(scroller);
        }
        if (!scroller) {
            return undefined;
        }
        this.$scroller =
            scroller.tagName === 'BODY' ? window : scroller;
        return this.$scroller;
    }
    getScrollTop() {
        const scroller = this.getScroller();
        return scroller === window ? scroller.pageYOffset : scroller.scrollTop;
    }
    getScrollHeight() {
        return (this.getScroller().scrollHeight ||
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    }
    getOffsetHeight() {
        const scroller = this.getScroller();
        return scroller === window || !scroller
            ? window.innerHeight
            : getBCR(scroller).height;
    }
    activate(target) {
        this.$activeTarget = target;
        this.clear();
        // Grab the list of target links (<a href="{$target}">)
        const links = selectAll((this.$selector || '')
            // Split out the base selectors
            .split(',')
            // Map to a selector that matches links with HREF ending in the ID (including '#')
            .map(selector => `${selector}[href$="${target}"]`)
            // Join back into a single selector string
            .join(','), this.$element);
        links.forEach(link => {
            if (hasClass(link, ClassName.DROPDOWN_ITEM)) {
                // This is a dropdown item, so find the .dropdown-toggle and set it's state
                const dropdown = closest(Selector.DROPDOWN, link);
                if (dropdown) {
                    this.setActiveState(select(Selector.DROPDOWN_TOGGLE, dropdown), true);
                }
                // Also set this link's state
                this.setActiveState(link, true);
            }
            else {
                // Set triggered link as active
                this.setActiveState(link, true);
                if (matches(link.parentElement, Selector.NAV_ITEMS)) {
                    // Handle nav-link inside nav-item, and set nav-item active
                    this.setActiveState(link.parentElement, true);
                }
                // Set triggered links parents as active
                // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
                let el = link;
                while (el) {
                    el = closest(Selector.NAV_LIST_GROUP, el);
                    const sibling = el ? el.previousElementSibling : null;
                    if (sibling && matches(sibling, `${Selector.NAV_LINKS}, ${Selector.LIST_ITEMS}`)) {
                        this.setActiveState(sibling, true);
                    }
                    // Handle special case where nav-link is inside a nav-item
                    if (sibling && matches(sibling, Selector.NAV_ITEMS)) {
                        this.setActiveState(select(Selector.NAV_LINKS, sibling), true);
                        // Add active state to nav-item as well
                        this.setActiveState(sibling, true);
                    }
                }
            }
        });
        // Signal event to via $root, passing ID of activated target and reference to array of links
        if (links && links.length > 0 && this.$root) {
            this.$root.$emit(ACTIVATE_EVENT, target, links);
        }
    }
    clear() {
        selectAll(`${this.$selector}, ${Selector.NAV_ITEMS}`, this.$element)
            .filter(el => hasClass(el, ClassName.ACTIVE))
            .forEach(el => this.setActiveState(el, false));
    }
    setActiveState(el, active) {
        if (!el) {
            return;
        }
        if (active) {
            addClass(el, ClassName.ACTIVE);
        }
        else {
            removeClass(el, ClassName.ACTIVE);
        }
    }
}
const VBScrollspy = ScrollSpy.GetBvDirective();

export { ScrollSpy as S, VBScrollspy as V, VBScrollspy as a };
