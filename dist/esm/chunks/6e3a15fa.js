import { z as Directive, A as noop, C as getComponentConfig, b as isString, s as isFunction, E as isObject, l as keys, F as isNumber, G as BvEvent, H as hasClass, I as isVisible, y as setAttr, J as addClass, K as removeClass, L as eventOn, M as eventOff, N as closest, P as select, Q as getAttr, x as removeAttr, d as isUndefined, R as isDisabled, S as from, T as getCS, U as isNull } from './a6dd0dc4.js';
import { warn } from 'vue';
import { P as Popper } from './0fa52133.js';

const NAME = 'tooltip';
const CLASS_PREFIX = 'bs-tooltip';
const BS_CLASS_PREFIX_REGEX = new RegExp(`\\b${CLASS_PREFIX}\\S+`, 'g');
const TRANSITION_DURATION = 150;
// Modal $root hidden event
const MODAL_CLOSE_EVENT = 'bv::modal::hidden';
// Modal container for appending tooltip/popover
const MODAL_CLASS = '.modal-content';
const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
    TOPLEFT: 'top',
    TOPRIGHT: 'top',
    RIGHTTOP: 'right',
    RIGHTBOTTOM: 'right',
    BOTTOMLEFT: 'bottom',
    BOTTOMRIGHT: 'bottom',
    LEFTTOP: 'left',
    LEFTBOTTOM: 'left'
};
const OffsetMap = {
    AUTO: 0,
    TOPLEFT: -1,
    TOP: 0,
    TOPRIGHT: +1,
    RIGHTTOP: -1,
    RIGHT: 0,
    RIGHTBOTTOM: +1,
    BOTTOMLEFT: -1,
    BOTTOM: 0,
    BOTTOMRIGHT: +1,
    LEFTTOP: -1,
    LEFT: 0,
    LEFTBOTTOM: +1
};
const HoverState = {
    SHOW: 'show',
    OUT: 'out'
};
const ClassName = {
    FADE: 'fade',
    SHOW: 'show'
};
const Selector = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
};
const Defaults = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<div class="tooltip-inner"></div>' +
        '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    placement: 'top',
    offset: 0,
    arrowPadding: 6,
    container: false,
    fallbackPlacement: 'flip',
    callbacks: {},
    boundary: 'scrollParent',
    boundaryPadding: 5,
    content: ''
};
// Transition event names
const TransitionEndEvents = {
    WebkitTransition: ['webkitTransitionEnd'],
    MozTransition: ['transitionend'],
    OTransition: ['otransitionend', 'oTransitionEnd'],
    transition: ['transitionend']
};
// Options for Native Event Listeners (since we never call preventDefault)
const EvtOpts = { passive: true, capture: false };
// Valid event triggers
const validTriggers = {
    focus: true,
    hover: true,
    click: true,
    blur: true
};
/*
 * ToolTip class definition
 */
class ToolTip extends Directive {
    // Main constructor
    init() {
        this.$isEnabled = true;
        this.$activeTrigger = {};
        this.$forceHide = this.forceHide.bind(this);
        this.$doHide = this.doHide.bind(this);
        this.$doShow = this.doShow.bind(this);
        this.$doDisable = this.doDisable.bind(this);
        this.$doEnable = this.doEnable.bind(this);
        this._noop = noop.bind(this);
        this.$timeouts = { hover: undefined, fade: undefined };
        this.$intervals = { visible: undefined };
    }
    // NOTE: Overridden by PopOver class
    static get Default() {
        return Defaults;
    }
    // NOTE: Overridden by PopOver class
    static get NAME() {
        return NAME;
    }
    static ValidateApply() {
        if (!Popper) {
            /* istanbul ignore next */
            warn('v-b-popover: Popper.js is required for PopOvers to work');
            /* istanbul ignore next */
            return false;
        }
        return true;
    }
    // Build a ToolTip config based on bindings (if any)
    // Arguments and modifiers take precedence over passed value config object
    /* istanbul ignore next: not easy to test */
    static ParseBindingss(bindings) {
        // We start out with a basic config
        const NAME = 'BTooltip';
        let config = {
            delay: getComponentConfig(NAME, 'delay'),
            boundary: String(getComponentConfig(NAME, 'boundary')),
            boundaryPadding: parseInt(getComponentConfig(NAME, 'boundaryPadding'), 10) || 0
        };
        // Process bindings.value
        if (isString(bindings.value)) {
            // Value is tooltip content (html optionally supported)
            config.title = bindings.value;
        }
        else if (isFunction(bindings.value)) {
            // Title generator function
            config.title = bindings.value;
        }
        else if (isObject(bindings.value)) {
            // Value is config object, so merge
            config = Object.assign({}, config, bindings.value);
        }
        // If argument, assume element ID of container element
        if (bindings.arg) {
            // Element ID specified as arg
            // We must prepend '#' to become a CSS selector
            config.container = `#${bindings.arg}`;
        }
        // Process modifiers
        keys(bindings.modifiers).forEach(mod => {
            if (/^html$/.test(mod)) {
                // Title allows HTML
                config.html = true;
            }
            else if (/^nofade$/.test(mod)) {
                // No animation
                config.animation = false;
            }
            else if (/^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(mod)) {
                // Placement of tooltip
                config.placement = mod;
            }
            else if (/^(window|viewport|scrollParent)$/.test(mod)) {
                // Boundary of tooltip
                config.boundary = mod;
            }
            else if (/^d\d+$/.test(mod)) {
                // Delay value
                const delay = parseInt(mod.slice(1), 10) || 0;
                if (delay) {
                    config.delay = delay;
                }
            }
            else if (/^o-?\d+$/.test(mod)) {
                // Offset value, negative allowed
                const offset = parseInt(mod.slice(1), 10) || 0;
                if (offset) {
                    config.offset = offset;
                }
            }
        });
        // Special handling of event trigger modifiers trigger is
        // a space separated list
        const selectedTriggers = {};
        // Parse current config object trigger
        let triggers = isString(config.trigger) ? config.trigger.trim().split(/\s+/) : [];
        triggers.forEach(trigger => {
            if (validTriggers[trigger]) {
                selectedTriggers[trigger] = true;
            }
        });
        // Parse modifiers for triggers
        keys(validTriggers).forEach(trigger => {
            if (bindings.modifiers[trigger]) {
                selectedTriggers[trigger] = true;
            }
        });
        // Sanitize triggers
        config.trigger = keys(selectedTriggers).join(' ');
        if (config.trigger === 'blur') {
            // Blur by itself is useless, so convert it to 'focus'
            config.trigger = 'focus';
        }
        if (!config.trigger) {
            // Remove trigger config
            delete config.trigger;
        }
        return config;
    }
    // Update config
    processConfig(config) {
        // Merge config into defaults. We use "this" here because PopOver overrides Default
        // Sanitize delay
        if (config.delay && isNumber(config.delay)) {
            /* istanbul ignore next */
            config.delay = {
                show: config.delay,
                hide: config.delay
            };
        }
        // Title for tooltip and popover
        if (config.title && isNumber(config.title)) {
            /* istanbul ignore next */
            config.title = config.title.toString();
        }
        // Content only for popover
        if (config.content && isNumber(config.content)) {
            /* istanbul ignore next */
            config.content = config.content.toString();
        }
        // Hide element original title if needed
        this.fixTitle();
        // Update the config
        return config;
    }
    // Destroy this instance
    preDispose() {
        // Disable while open listeners/watchers
        this.setWhileOpenListeners(false);
        // Remove popper
        if (this.$popper) {
            this.$popper.destroy();
        }
        // Remove tip from document
        if (this.$tip && this.$tip.parentElement) {
            this.$tip.parentElement.removeChild(this.$tip);
        }
    }
    enable() {
        // Create a non-cancelable BvEvent
        const enabledEvt = new BvEvent('enabled', {
            cancelable: false,
            target: this.$element,
            relatedTarget: null
        });
        this.$isEnabled = true;
        this.emitEvent(enabledEvt);
    }
    disable() {
        // Create a non-cancelable BvEvent
        const disabledEvt = new BvEvent('disabled', {
            cancelable: false,
            target: this.$element,
            relatedTarget: null
        });
        this.$isEnabled = false;
        this.emitEvent(disabledEvt);
    }
    // Click toggler
    toggle(event) {
        if (!this.$isEnabled) {
            /* istanbul ignore next */
            return;
        }
        /* istanbul ignore else */
        if (event && this.$activeTrigger) {
            this.$activeTrigger.click = !this.$activeTrigger.click;
            if (this.isWithActiveTrigger()) {
                this.enter(null);
            }
            else {
                this.leave(null);
            }
        }
        else {
            if (hasClass(this.getTipElement(), ClassName.SHOW)) {
                this.leave(null);
            }
            else {
                this.enter(null);
            }
        }
    }
    // Show tooltip
    show() {
        if (!this.$element || !document.body.contains(this.$element) || !isVisible(this.$element)) {
            // If trigger element isn't in the DOM or is not visible
            return;
        }
        // Build tooltip element (also sets this.$tip)
        const tip = this.getTipElement();
        this.fixTitle();
        this.setContent(tip);
        if (!this.isWithContent(tip)) {
            // If no content, don't bother showing
            /* istanbul ignore next */
            this.$tip = undefined;
            /* istanbul ignore next */
            return;
        }
        // Set ID on tip and aria-describedby on element
        setAttr(tip, 'id', this.$id || '');
        this.addAriaDescribedby();
        // Set animation on or off
        if (!this.$config)
            return;
        if (this.$config.animation) {
            addClass(tip, ClassName.FADE);
        }
        else {
            removeClass(tip, ClassName.FADE);
        }
        const placement = this.getPlacement();
        const attachment = this.constructor.getAttachment(placement);
        this.addAttachmentClass(attachment);
        // Create a cancelable BvEvent
        const showEvt = new BvEvent('show', {
            cancelable: true,
            target: this.$element,
            relatedTarget: tip
        });
        this.emitEvent(showEvt);
        if (showEvt.defaultPrevented) {
            // Don't show if event cancelled
            this.$tip = undefined;
            return;
        }
        // Insert tooltip if needed
        const container = this.getContainer();
        if (!document.body.contains(tip)) {
            container.appendChild(tip);
        }
        // Refresh popper
        this.removePopper();
        this.$popper = this.$element
            ? new Popper(this.$element, tip, this.getPopperConfig(placement, tip))
            : undefined;
        // Transitionend callback
        const complete = () => {
            if (this.$config && this.$config.animation) {
                this.fixTransition(tip);
            }
            const prevHoverState = this.$hoverState;
            this.$hoverState = undefined;
            if (prevHoverState === HoverState.OUT) {
                this.leave(null);
            }
            // Create a non-cancelable BvEvent
            const shownEvt = new BvEvent('shown', {
                cancelable: false,
                target: this.$element,
                relatedTarget: tip
            });
            this.emitEvent(shownEvt);
        };
        // Enable while open listeners/watchers
        this.setWhileOpenListeners(true);
        // Show tip
        addClass(tip, ClassName.SHOW);
        // Start the transition/animation
        this.transitionOnce(tip, complete);
    }
    // Handler for periodic visibility check
    visibleCheck(on) {
        this.clearInterval('visible');
        if (on) {
            this.setInterval('visible', () => {
                const tip = this.$tip;
                if (tip && !isVisible(this.$element) && hasClass(tip, ClassName.SHOW)) {
                    // Element is no longer visible, so force-hide the tooltip
                    this.forceHide();
                }
            }, 100);
        }
    }
    setWhileOpenListeners(on) {
        // Modal close events
        this.setModalListener(on);
        // Periodic $element visibility check
        // For handling when tip is in <keepalive>, tabs, carousel, etc
        this.visibleCheck(on);
        // Route change events
        this.setRouteWatcher(on);
        // On-touch start listeners
        this.setOnTouchStartListener(on);
        if (on && this.$config && /(focus|blur)/.test(this.$config.trigger)) {
            // If focus moves between trigger element and tip container, don't close
            eventOn(this.$tip, 'focusout', this, EvtOpts);
        }
        else {
            eventOff(this.$tip, 'focusout', this, EvtOpts);
        }
    }
    // Force hide of tip (internal method)
    forceHide() {
        if (!this.$tip || !hasClass(this.$tip, ClassName.SHOW)) {
            /* istanbul ignore next */
            return;
        }
        // Disable while open listeners/watchers
        this.setWhileOpenListeners(false);
        // Clear any hover enter/leave event
        this.clearTimeout('hover');
        this.$hoverState = '';
        // Hide the tip
        this.hide(null, true);
    }
    // Hide tooltip
    hide(callback, force) {
        const tip = this.$tip;
        if (!tip) {
            /* istanbul ignore next */
            return;
        }
        // Create a cancelable BvEvent
        const hideEvt = new BvEvent('hide', {
            // We disable cancelling if force is true
            cancelable: !force,
            target: this.$element,
            relatedTarget: tip
        });
        this.emitEvent(hideEvt);
        if (hideEvt.defaultPrevented) {
            // Don't hide if event cancelled
            return;
        }
        // Transitionend callback
        const complete = () => {
            if (this.$hoverState !== HoverState.SHOW && tip.parentNode) {
                // Remove tip from DOM, and force recompile on next show
                tip.parentNode.removeChild(tip);
                this.removeAriaDescribedby();
                this.removePopper();
                this.$tip = undefined;
            }
            if (callback) {
                callback();
            }
            // Create a non-cancelable BvEvent
            const hiddenEvt = new BvEvent('hidden', {
                cancelable: false,
                target: this.$element,
                relatedTarget: null
            });
            this.emitEvent(hiddenEvt);
        };
        // Disable while open listeners/watchers
        this.setWhileOpenListeners(false);
        // If forced close, disable animation
        if (force) {
            removeClass(tip, ClassName.FADE);
        }
        // Hide tip
        removeClass(tip, ClassName.SHOW);
        if (this.$activeTrigger) {
            this.$activeTrigger.click = false;
            this.$activeTrigger.focus = false;
            this.$activeTrigger.hover = false;
        }
        // Start the hide transition
        this.transitionOnce(tip, complete);
        this.$hoverState = '';
    }
    emitEvent(evt) {
        const evtName = evt.type;
        if (this.$root && this.$root.$emit) {
            // Emit an event on $root
            this.$root.$emit(`bv::${this.constructor.NAME}::${evtName}`, evt);
        }
        const callbacks = this.$config
            ? this.$config.callbacks || {}
            : {};
        if (callbacks && isFunction(callbacks[evtName])) {
            callbacks[evtName](evt);
        }
    }
    getContainer() {
        const container = this.$config ? this.$config.container : false;
        const body = document.body;
        // If we are in a modal, we append to the modal instead of body,
        // unless a container is specified
        return container === false
            ? closest(MODAL_CLASS, this.$element) || body
            : select(container, body) || body;
    }
    // Will be overridden by PopOver if needed
    addAriaDescribedby() {
        // Add aria-describedby on trigger element, without removing any other IDs
        let desc = getAttr(this.$element, 'aria-describedby') || '';
        desc = desc
            .split(/\s+/)
            .concat(this.$id || '')
            .join(' ')
            .trim();
        setAttr(this.$element, 'aria-describedby', desc);
    }
    // Will be overridden by PopOver if needed
    removeAriaDescribedby() {
        let desc = getAttr(this.$element, 'aria-describedby') || '';
        desc = desc
            .split(/\s+/)
            .filter((d) => d !== (this.$id || ''))
            .join(' ')
            .trim();
        if (desc) {
            /* istanbul ignore next */
            setAttr(this.$element, 'aria-describedby', desc);
        }
        else {
            removeAttr(this.$element, 'aria-describedby');
        }
    }
    removePopper() {
        if (this.$popper) {
            this.$popper.destroy();
        }
        this.$popper = undefined;
    }
    transitionOnce(tip, complete) {
        const transEvents = this.getTransitionEndEvents();
        let called = false;
        this.clearTimeout('fade');
        const fnOnce = () => {
            if (called) {
                /* istanbul ignore next */
                return;
            }
            called = true;
            this.clearTimeout('fade');
            transEvents.forEach((evtName) => {
                eventOff(tip, evtName, fnOnce, EvtOpts);
            });
            // Call complete callback
            complete();
        };
        if (hasClass(tip, ClassName.FADE)) {
            transEvents.forEach((evtName) => {
                eventOn(tip, evtName, fnOnce, EvtOpts);
            });
            // Fallback to setTimeout()
            this.setTimeout('fade', fnOnce, TRANSITION_DURATION);
        }
        else {
            fnOnce();
        }
    }
    // What transitionend event(s) to use? (returns array of event names)
    getTransitionEndEvents() {
        for (const name in TransitionEndEvents) {
            if (this.$element && !isUndefined(this.$element.style.getPropertyValue(name))) {
                return TransitionEndEvents[name];
            }
        }
        // Fallback
        /* istanbul ignore next */
        return [];
    }
    /* istanbul ignore next */
    update() {
        if (!isUndefined(this.$popper)) {
            this.$popper.scheduleUpdate();
        }
    }
    // NOTE: Overridden by PopOver class
    isWithContent(tip) {
        tip = tip || this.$tip;
        if (!tip) {
            /* istanbul ignore next */
            return false;
        }
        return Boolean((select(Selector.TOOLTIP_INNER, tip) || {}).innerHTML);
    }
    // NOTE: Overridden by PopOver class
    addAttachmentClass(attachment) {
        addClass(this.getTipElement(), `${CLASS_PREFIX}-${attachment}`);
    }
    getTipElement() {
        if (!this.$tip && this.$config) {
            // Try and compile user supplied template, or fallback to default template
            this.$tip =
                this.compileTemplate(this.$config.template) ||
                    this.compileTemplate(this.constructor.Default.template);
        }
        this.$tip.tabIndex = -1;
        return this.$tip;
    }
    compileTemplate(html) {
        if (!html || !isString(html)) {
            /* istanbul ignore next */
            return;
        }
        let div = document.createElement('div');
        div.innerHTML = html.trim();
        const node = div.firstElementChild ? div.removeChild(div.firstElementChild) : undefined;
        div = null;
        return node;
    }
    // NOTE: Overridden by PopOver class
    setContent(tip) {
        this.setElementContent(select(Selector.TOOLTIP_INNER, tip), this.getTitle());
        removeClass(tip, ClassName.FADE);
        removeClass(tip, ClassName.SHOW);
    }
    setElementContent(container, content) {
        if (!container) {
            // If container element doesn't exist, just return
            /* istanbul ignore next */
            return;
        }
        const allowHtml = this.$config ? this.$config.html : false;
        if (isObject(content) && content.nodeType) {
            // Content is a DOM node
            if (allowHtml) {
                if (content.parentElement !== container) {
                    container.innerHTML = '';
                    container.appendChild(content);
                }
            }
            else {
                /* istanbul ignore next */
                container.innerText = content.innerText;
            }
        }
        else {
            // We have a plain HTML string or Text
            container[allowHtml ? 'innerHTML' : 'innerText'] = content;
        }
    }
    // NOTE: Overridden by PopOver class
    getTitle() {
        let title = this.$config && this.$config.title ? this.$config.title : '';
        if (isFunction(title)) {
            // Call the function to get the title value
            /* istanbul ignore next */
            title = title(this.$element);
        }
        if (isObject(title) && title.nodeType && !title.innerHTML.trim()) {
            // We have a DOM node, but without inner content,
            // so just return empty string
            /* istanbul ignore next */
            title = '';
        }
        if (isString(title)) {
            title = title.trim();
        }
        if (!title) {
            // If an explicit title is not given, try element's title attributes
            title = getAttr(this.$element, 'title') || getAttr(this.$element, 'data-original-title') || '';
            title = title.trim();
        }
        return title;
    }
    static getAttachment(placement) {
        return AttachmentMap[placement.toUpperCase()];
    }
    listen() {
        const triggers = this.$config && this.$config.trigger
            ? this.$config.trigger.trim().split(/\s+/)
            : [];
        const el = this.$element;
        // Listen for global show/hide events
        this.setRootListener(true);
        // Using 'this' as the handler will get automatically directed to
        // this.handleEvent and maintain our binding to 'this'
        triggers.forEach((trigger) => {
            if (trigger === 'click') {
                eventOn(el, 'click', this, EvtOpts);
            }
            else if (trigger === 'focus') {
                eventOn(el, 'focusin', this, EvtOpts);
                eventOn(el, 'focusout', this, EvtOpts);
            }
            else if (trigger === 'blur') {
                // Used to close $tip when element looses focus
                eventOn(el, 'focusout', this, EvtOpts);
            }
            else if (trigger === 'hover') {
                eventOn(el, 'mouseenter', this, EvtOpts);
                eventOn(el, 'mouseleave', this, EvtOpts);
            }
        }, this);
    }
    unListen() {
        const events = ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave'];
        // Using "this" as the handler will get automatically directed to this.handleEvent
        events.forEach((evt) => {
            eventOff(this.$element, evt, this, EvtOpts);
        }, this);
        // Stop listening for global show/hide/enable/disable events
        this.setRootListener(false);
    }
    handleEvent(e) {
        // This special method allows us to use "this" as the event handlers
        if (isDisabled(this.$element)) {
            // If disabled, don't do anything. Note: If tip is shown before element gets
            // disabled, then tip not close until no longer disabled or forcefully closed.
            /* istanbul ignore next */
            return;
        }
        if (!this.$isEnabled) {
            // If not enable
            return;
        }
        const type = e.type;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const $element = this.$element;
        const $tip = this.$tip;
        if (type === 'click') {
            this.toggle(e);
        }
        else if (type === 'focusin' || type === 'mouseenter') {
            this.enter(e);
        }
        else if (type === 'focusout') {
            // target is the element which is loosing focus
            // and relatedTarget is the element gaining focus
            if ($tip && $element && $element.contains(target) && $tip.contains(relatedTarget)) {
                // If focus moves from $element to $tip, don't trigger a leave
                /* istanbul ignore next */
                return;
            }
            if ($tip && $element && $tip.contains(target) && $element.contains(relatedTarget)) {
                // If focus moves from $tip to $element, don't trigger a leave
                /* istanbul ignore next */
                return;
            }
            /* istanbul ignore next: difficult to test */
            if ($tip && $tip.contains(target) && $tip.contains(relatedTarget)) {
                // If focus moves within $tip, don't trigger a leave
                return;
            }
            /* istanbul ignore next: difficult to test */
            if ($element && $element.contains(target) && $element.contains(relatedTarget)) {
                // If focus moves within $element, don't trigger a leave
                return;
            }
            // Otherwise trigger a leave
            this.leave(e);
        }
        else if (type === 'mouseleave') {
            this.leave(e);
        }
    }
    /* istanbul ignore next */
    setRouteWatcher(on) {
        if (on) {
            this.setRouteWatcher(false);
            if (this.$root && Boolean(this.$root.$route)) {
                this.$routeWatcher = this.$root.$watch('$route', (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return;
                    }
                    // If route has changed, we force hide the tooltip/popover
                    this.forceHide();
                });
            }
        }
        else {
            if (this.$routeWatcher) {
                // Cancel the route watcher by calling the stored reference
                this.$routeWatcher();
                this.$routeWatcher = undefined;
            }
        }
    }
    /* istanbul ignore next */
    setModalListener(on) {
        const modal = closest(MODAL_CLASS, this.$element);
        if (!modal) {
            // If we are not in a modal, don't worry. be happy
            return;
        }
        // We can listen for modal hidden events on $root
        if (this.$root) {
            this.$root[on ? '$on' : '$off'](MODAL_CLOSE_EVENT, this.$forceHide);
        }
    }
    setRootListener(on) {
        // Listen for global 'bv::{hide|show}::{tooltip|popover}' hide request event
        if (this.$root) {
            this.$root[on ? '$on' : '$off'](`bv::hide::${this.name}`, this.$doHide);
            this.$root[on ? '$on' : '$off'](`bv::show::${this.name}`, this.$doShow);
            this.$root[on ? '$on' : '$off'](`bv::disable::${this.name}`, this.$doDisable);
            this.$root[on ? '$on' : '$off'](`bv::enable::${this.name}`, this.$doEnable);
        }
    }
    doHide(id) {
        // Programmatically hide tooltip or popover
        if (!id) {
            // Close all tooltips or popovers
            this.forceHide();
        }
        else if (this.$element && this.$element.id && this.$element.id === id) {
            // Close this specific tooltip or popover
            this.hide();
        }
    }
    doShow(id) {
        // Programmatically show tooltip or popover
        if (!id) {
            // Open all tooltips or popovers
            this.show();
        }
        else if (id && this.$element && this.$element.id && this.$element.id === id) {
            // Show this specific tooltip or popover
            this.show();
        }
    }
    doDisable(id) {
        // Programmatically disable tooltip or popover
        if (!id) {
            // Disable all tooltips or popovers
            this.disable();
        }
        else if (this.$element && this.$element.id && this.$element.id === id) {
            // Disable this specific tooltip or popover
            this.disable();
        }
    }
    doEnable(id) {
        // Programmatically enable tooltip or popover
        if (!id) {
            // Enable all tooltips or popovers
            this.enable();
        }
        else if (this.$element && this.$element.id && this.$element.id === id) {
            // Enable this specific tooltip or popover
            this.enable();
        }
    }
    setOnTouchStartListener(on) {
        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children
        // Only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
            /* istanbul ignore next: JSDOM does not support 'ontouchstart' event */
            from(document.body.children).forEach((el) => {
                if (on) {
                    eventOn(el, 'mouseover', this._noop);
                }
                else {
                    eventOff(el, 'mouseover', this._noop);
                }
            });
        }
    }
    fixTitle() {
        const el = this.$element;
        if (getAttr(el, 'title') || !isString(getAttr(el, 'data-original-title'))) {
            setAttr(el, 'data-original-title', getAttr(el, 'title') || '');
            setAttr(el, 'title', '');
        }
    }
    // Enter handler
    enter(e) {
        if (e && this.$activeTrigger) {
            this.$activeTrigger[e.type === 'focusin' ? 'focus' : 'hover'] = true;
        }
        if (hasClass(this.getTipElement(), ClassName.SHOW) || this.$hoverState === HoverState.SHOW) {
            this.$hoverState = HoverState.SHOW;
            return;
        }
        this.clearTimeout('hover');
        this.$hoverState = HoverState.SHOW;
        let config = this.$config;
        if (config && (!config.delay || !config.delay.show)) {
            this.show();
            return;
        }
        this.setTimeout('hover', () => {
            if (this.$hoverState === HoverState.SHOW) {
                this.show();
            }
        }, this.$config && this.$config.delay
            ? this.$config.delay.show
            : undefined);
    }
    // Leave handler
    leave(e) {
        let config = this.$config;
        if (e && this.$activeTrigger) {
            this.$activeTrigger[e.type === 'focusout' ? 'focus' : 'hover'] = false;
            if (e.type === 'focusout' && /blur/.test(config.trigger)) {
                // Special case for `blur`: we clear out the other triggers
                this.$activeTrigger.click = false;
                this.$activeTrigger.hover = false;
            }
        }
        if (this.isWithActiveTrigger()) {
            return;
        }
        this.clearTimeout('hover');
        this.$hoverState = HoverState.OUT;
        if (!config.delay || (config.delay && !config.delay.hide)) {
            this.hide();
            return;
        }
        this.setTimeout('hover', () => {
            if (this.$hoverState === HoverState.OUT) {
                this.hide();
            }
        }, config.delay.hide);
    }
    getPopperConfig(placement, tip) {
        let config = this.$config;
        return {
            placement: this.constructor.getAttachment(placement),
            modifiers: {
                offset: { offset: this.getOffset(placement, tip) },
                flip: { behavior: config.fallbackPlacement },
                arrow: { element: '.arrow' },
                preventOverflow: {
                    padding: config.boundaryPadding,
                    boundariesElement: config.boundary
                }
            },
            onCreate: (data) => {
                // Handle flipping arrow classes
                /* istanbul ignore next */
                if (data.originalPlacement !== data.placement) {
                    this.handlePopperPlacementChange(data);
                }
            },
            onUpdate: (data) => {
                // Handle flipping arrow classes
                /* istanbul ignore next */
                this.handlePopperPlacementChange(data);
            }
        };
    }
    /* istanbul ignore next */
    getOffset(placement, tip) {
        let config = this.$config;
        if (!config || !config.offset) {
            const arrow = select(Selector.ARROW, tip);
            const arrowOffset = parseFloat(getCS(arrow).width || '0') + parseFloat(config.arrowPadding);
            switch (OffsetMap[placement.toUpperCase()]) {
                case +1:
                    return `+50%p - ${arrowOffset}px`;
                case -1:
                    return `-50%p + ${arrowOffset}px`;
                default:
                    return 0;
            }
        }
        return config.offset;
    }
    getPlacement() {
        let config = this.$config;
        const placement = config.placement;
        if (isFunction(placement)) {
            /* istanbul ignore next */
            return placement.call(this, this.$tip, this.$element);
        }
        return placement;
    }
    isWithActiveTrigger() {
        for (const trigger in this.$activeTrigger) {
            if (this.$activeTrigger[trigger]) {
                return true;
            }
        }
        return false;
    }
    // NOTE: Overridden by PopOver class
    /* istanbul ignore next */
    cleanTipClass() {
        const tip = this.getTipElement();
        const tabClass = tip.className.match(BS_CLASS_PREFIX_REGEX);
        if (!isNull(tabClass) && tabClass.length > 0) {
            tabClass.forEach((cls) => {
                removeClass(tip, cls);
            });
        }
    }
    /* istanbul ignore next */
    handlePopperPlacementChange(data) {
        this.cleanTipClass();
        this.addAttachmentClass(this.constructor.getAttachment(data.placement));
    }
    /* istanbul ignore next */
    fixTransition(tip) {
        let config = this.$config;
        const initConfigAnimation = config.animation || false;
        if (!isNull(getAttr(tip, 'x-placement'))) {
            return;
        }
        removeClass(tip, ClassName.FADE);
        config.animation = false;
        this.hide();
        this.show();
        config.animation = initConfigAnimation;
    }
}
/*
 * Export our directive
 */
const VBToolTip = ToolTip.GetBvDirective();

export { ToolTip as T, VBToolTip as V, VBToolTip as a };
