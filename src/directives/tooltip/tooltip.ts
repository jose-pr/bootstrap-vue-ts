import Popper, { PopperOptions, Placement, Boundary, Behavior, Data } from 'popper.js'
import {
  VueExtended as Vue,
  from as arrayFrom,
  closest,
  select,
  isVisible,
  isDisabled,
  getCS,
  addClass,
  removeClass,
  hasClass,
  setAttr,
  removeAttr,
  getAttr,
  eventOn,
  eventOff,
  Dict,
  Primitive,
  isObject,
  Directive,
  warn,
  noop,
  isNumber,
  BvEvent,
  isFunction,
  isUndefined,
  isString,
  isNull,
  DirectiveBinding,
  getComponentConfig,
  keys
} from '../../utils'

export interface ToolTipConfig {
  animation: boolean
  template: string
  trigger: string
  title: string
  delay: number | { show: number; hide: number }
  html: boolean
  placement: Placement
  offset: number
  arrowPadding: number | string
  container: boolean | string
  fallbackPlacement: Behavior
  callbacks: Dict<Function>
  boundary: HTMLElement | Boundary
  boundaryPadding: number
  content: string
}

const NAME = 'tooltip'
const CLASS_PREFIX = 'bs-tooltip'
const BS_CLASS_PREFIX_REGEX = new RegExp(`\\b${CLASS_PREFIX}\\S+`, 'g')

const TRANSITION_DURATION = 150

// Modal $root hidden event
const MODAL_CLOSE_EVENT = 'bv::modal::hidden'
// Modal container for appending tooltip/popover
const MODAL_CLASS = '.modal-content'

const AttachmentMap: Dict<string> = {
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
}

const OffsetMap: Dict<any> = {
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
}

const HoverState = {
  SHOW: 'show',
  OUT: 'out'
}

const ClassName = {
  FADE: 'fade',
  SHOW: 'show'
}

const Selector = {
  TOOLTIP: '.tooltip',
  TOOLTIP_INNER: '.tooltip-inner',
  ARROW: '.arrow'
}

const Defaults: ToolTipConfig = {
  animation: true,
  template:
    '<div class="tooltip" role="tooltip">' +
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
}

// Transition event names
const TransitionEndEvents: Dict<string[]> = {
  WebkitTransition: ['webkitTransitionEnd'],
  MozTransition: ['transitionend'],
  OTransition: ['otransitionend', 'oTransitionEnd'],
  transition: ['transitionend']
}

// Options for Native Event Listeners (since we never call preventDefault)
const EvtOpts = { passive: true, capture: false }

// Client-side tip ID counter for aria-describedby attribute
// Each tooltip requires a unique client side ID
let NEXTID = 1
/* istanbul ignore next */
const generateId = (name: string): string => `__BV_${name}_${NEXTID++}__`

// Key which we use to store tooltip object on element
const BV_TOOLTIP = '__BV_ToolTip__'

// Valid event triggers
const validTriggers = {
  focus: true,
  hover: true,
  click: true,
  blur: true
}
/*
 * ToolTip class definition
 */
export class ToolTip extends Directive<ToolTipConfig> {
  public $isEnabled?: boolean
  public $hoverState?: string
  public $activeTrigger?: Dict<boolean>
  public $popper?: Popper
  public $tip?: HTMLElement
  public $id?: string
  public $routeWatcher?: () => void

  public $forceHide?: () => void
  public $doHide?: (id: string) => void
  public $doShow?: (id: string) => void
  public $doDisable?: (id: string) => void
  public $doEnable?: (id: string) => void
  public _noop?: () => void
  // Main constructor

  init() {
    this.$isEnabled = true
    this.$activeTrigger = {}
    this.$forceHide = this.forceHide.bind(this)
    this.$doHide = this.doHide.bind(this)
    this.$doShow = this.doShow.bind(this)
    this.$doDisable = this.doDisable.bind(this)
    this.$doEnable = this.doEnable.bind(this)
    this._noop = noop.bind(this)
    this.$timeouts = { hover: undefined, fade: undefined }
    this.$intervals = { visible: undefined }
  }

  // NOTE: Overridden by PopOver class
  public static get Default(): ToolTipConfig {
    return Defaults
  }

  // NOTE: Overridden by PopOver class
  public static get NAME(): string {
    return NAME
  }

  static ValidateApply() {
    if (!Popper) {
      /* istanbul ignore next */
      warn('v-b-popover: Popper.js is required for PopOvers to work')
      /* istanbul ignore next */
      return false
    }
    return true
  }

  // Build a ToolTip config based on bindings (if any)
  // Arguments and modifiers take precedence over passed value config object
  /* istanbul ignore next: not easy to test */
  static ParseBindingss<T = ToolTipConfig>(
    bindings: DirectiveBinding
  ): ToolTipConfig /* istanbul ignore next: not easy to test */ {
    // We start out with a basic config
    const NAME = 'BTooltip'
    let config: Partial<ToolTipConfig> = {
      delay: getComponentConfig(NAME, 'delay'),
      boundary: String(getComponentConfig(NAME, 'boundary')) as Boundary,
      boundaryPadding: parseInt(getComponentConfig(NAME, 'boundaryPadding'), 10) || 0
    }

    // Process bindings.value
    if (isString(bindings.value)) {
      // Value is tooltip content (html optionally supported)
      config.title = bindings.value
    } else if (isFunction(bindings.value)) {
      // Title generator function
      config.title = bindings.value
    } else if (isObject(bindings.value)) {
      // Value is config object, so merge
      config = { ...config, ...bindings.value }
    }

    // If argument, assume element ID of container element
    if (bindings.arg) {
      // Element ID specified as arg
      // We must prepend '#' to become a CSS selector
      config.container = `#${bindings.arg}`
    }

    // Process modifiers
    keys(bindings.modifiers).forEach(mod => {
      if (/^html$/.test(mod)) {
        // Title allows HTML
        config.html = true
      } else if (/^nofade$/.test(mod)) {
        // No animation
        config.animation = false
      } else if (
        /^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(
          mod
        )
      ) {
        // Placement of tooltip
        config.placement = mod as Placement
      } else if (/^(window|viewport|scrollParent)$/.test(mod)) {
        // Boundary of tooltip
        config.boundary = mod as Boundary
      } else if (/^d\d+$/.test(mod)) {
        // Delay value
        const delay = parseInt(mod.slice(1), 10) || 0
        if (delay) {
          config.delay = delay
        }
      } else if (/^o-?\d+$/.test(mod)) {
        // Offset value, negative allowed
        const offset = parseInt(mod.slice(1), 10) || 0
        if (offset) {
          config.offset = offset
        }
      }
    })

    // Special handling of event trigger modifiers trigger is
    // a space separated list
    const selectedTriggers: Dict<boolean> = {}

    // Parse current config object trigger
    let triggers = isString(config.trigger) ? config.trigger.trim().split(/\s+/) : []
    triggers.forEach(trigger => {
      if ((validTriggers as Dict<boolean>)[trigger]) {
        selectedTriggers[trigger] = true
      }
    })

    // Parse modifiers for triggers
    keys(validTriggers).forEach(trigger => {
      if (bindings.modifiers[trigger]) {
        selectedTriggers[trigger] = true
      }
    })

    // Sanitize triggers
    config.trigger = keys(selectedTriggers).join(' ')
    if (config.trigger === 'blur') {
      // Blur by itself is useless, so convert it to 'focus'
      config.trigger = 'focus'
    }
    if (!config.trigger) {
      // Remove trigger config
      delete config.trigger
    }

    return config as ToolTipConfig
  }

  // Update config
  public processConfig(config: ToolTipConfig): ToolTipConfig {
    // Merge config into defaults. We use "this" here because PopOver overrides Default
    // Sanitize delay
    if (config.delay && isNumber(config.delay)) {
      /* istanbul ignore next */
      config.delay = {
        show: config.delay,
        hide: config.delay
      }
    }

    // Title for tooltip and popover
    if (config.title && isNumber(config.title)) {
      /* istanbul ignore next */
      config.title = config.title.toString()
    }

    // Content only for popover
    if (config.content && isNumber(config.content)) {
      /* istanbul ignore next */
      config.content = config.content.toString()
    }

    // Hide element original title if needed
    this.fixTitle()
    // Update the config
    return config
  }

  // Destroy this instance
  public preDispose(): void {
    // Disable while open listeners/watchers
    this.setWhileOpenListeners(false)
    // Remove popper
    if (this.$popper) {
      this.$popper.destroy()
    }
    // Remove tip from document
    if (this.$tip && this.$tip.parentElement) {
      this.$tip.parentElement.removeChild(this.$tip)
    }
  }

  public enable(): void {
    // Create a non-cancelable BvEvent
    const enabledEvt = new BvEvent('enabled', {
      cancelable: false,
      target: this.$element,
      relatedTarget: null
    })
    this.$isEnabled = true
    this.emitEvent(enabledEvt)
  }

  public disable(): void {
    // Create a non-cancelable BvEvent
    const disabledEvt = new BvEvent('disabled', {
      cancelable: false,
      target: this.$element,
      relatedTarget: null
    })
    this.$isEnabled = false
    this.emitEvent(disabledEvt)
  }

  // Click toggler
  public toggle(event: BvEvent): void {
    if (!this.$isEnabled) {
      /* istanbul ignore next */
      return
    }
    /* istanbul ignore else */
    if (event && this.$activeTrigger) {
      this.$activeTrigger.click = !this.$activeTrigger.click

      if (this.isWithActiveTrigger()) {
        this.enter(null)
      } else {
        this.leave(null)
      }
    } else {
      if (hasClass(this.getTipElement(), ClassName.SHOW)) {
        this.leave(null)
      } else {
        this.enter(null)
      }
    }
  }

  // Show tooltip
  public show(): void {
    if (!this.$element || !document.body.contains(this.$element) || !isVisible(this.$element)) {
      // If trigger element isn't in the DOM or is not visible
      return
    }
    // Build tooltip element (also sets this.$tip)
    const tip = this.getTipElement()
    this.fixTitle()
    this.setContent(tip)
    if (!this.isWithContent(tip)) {
      // If no content, don't bother showing
      /* istanbul ignore next */
      this.$tip = undefined
      /* istanbul ignore next */
      return
    }

    // Set ID on tip and aria-describedby on element
    setAttr(tip, 'id', this.$id || '')
    this.addAriaDescribedby()

    // Set animation on or off
    if (!this.$config) return
    if (this.$config.animation) {
      addClass(tip, ClassName.FADE)
    } else {
      removeClass(tip, ClassName.FADE)
    }

    const placement = this.getPlacement()
    const attachment = (this.constructor as typeof ToolTip).getAttachment(placement)
    this.addAttachmentClass(attachment)

    // Create a cancelable BvEvent
    const showEvt = new BvEvent('show', {
      cancelable: true,
      target: this.$element,
      relatedTarget: tip
    })
    this.emitEvent(showEvt)
    if (showEvt.defaultPrevented) {
      // Don't show if event cancelled
      this.$tip = undefined
      return
    }

    // Insert tooltip if needed
    const container = this.getContainer()
    if (!document.body.contains(tip)) {
      container.appendChild(tip)
    }

    // Refresh popper
    this.removePopper()
    this.$popper = this.$element
      ? new Popper(this.$element, tip, this.getPopperConfig(placement, tip))
      : undefined

    // Transitionend callback
    const complete = (): void => {
      if (this.$config && this.$config.animation) {
        this.fixTransition(tip)
      }
      const prevHoverState = this.$hoverState
      this.$hoverState = undefined
      if (prevHoverState === HoverState.OUT) {
        this.leave(null)
      }
      // Create a non-cancelable BvEvent
      const shownEvt = new BvEvent('shown', {
        cancelable: false,
        target: this.$element,
        relatedTarget: tip
      })
      this.emitEvent(shownEvt)
    }

    // Enable while open listeners/watchers
    this.setWhileOpenListeners(true)

    // Show tip
    addClass(tip, ClassName.SHOW)

    // Start the transition/animation
    this.transitionOnce(tip, complete)
  }

  // Handler for periodic visibility check
  public visibleCheck(on: boolean): void {
    this.clearInterval('visible')
    if (on) {
      this.setInterval(
        'visible',
        (): void => {
          const tip = this.$tip
          if (tip && !isVisible(this.$element) && hasClass(tip, ClassName.SHOW)) {
            // Element is no longer visible, so force-hide the tooltip
            this.forceHide()
          }
        },
        100
      )
    }
  }

  public setWhileOpenListeners(on: boolean): void {
    // Modal close events
    this.setModalListener(on)
    // Periodic $element visibility check
    // For handling when tip is in <keepalive>, tabs, carousel, etc
    this.visibleCheck(on)
    // Route change events
    this.setRouteWatcher(on)
    // On-touch start listeners
    this.setOnTouchStartListener(on)
    if (on && this.$config && /(focus|blur)/.test(this.$config.trigger as string)) {
      // If focus moves between trigger element and tip container, don't close
      eventOn(this.$tip, 'focusout', this, EvtOpts)
    } else {
      eventOff(this.$tip, 'focusout', this, EvtOpts)
    }
  }

  // Force hide of tip (internal method)
  public forceHide(): void {
    if (!this.$tip || !hasClass(this.$tip, ClassName.SHOW)) {
      /* istanbul ignore next */
      return
    }
    // Disable while open listeners/watchers
    this.setWhileOpenListeners(false)
    // Clear any hover enter/leave event
    this.clearTimeout('hover')
    this.$hoverState = ''
    // Hide the tip
    this.hide(null, true)
  }

  // Hide tooltip
  public hide(callback?: null | (() => void), force?: boolean): void {
    const tip = this.$tip
    if (!tip) {
      /* istanbul ignore next */
      return
    }

    // Create a cancelable BvEvent
    const hideEvt = new BvEvent('hide', {
      // We disable cancelling if force is true
      cancelable: !force,
      target: this.$element,
      relatedTarget: tip
    })
    this.emitEvent(hideEvt)
    if (hideEvt.defaultPrevented) {
      // Don't hide if event cancelled
      return
    }

    // Transitionend callback
    const complete = (): void => {
      if (this.$hoverState !== HoverState.SHOW && tip.parentNode) {
        // Remove tip from DOM, and force recompile on next show
        tip.parentNode.removeChild(tip)
        this.removeAriaDescribedby()
        this.removePopper()
        this.$tip = undefined
      }
      if (callback) {
        callback()
      }
      // Create a non-cancelable BvEvent
      const hiddenEvt = new BvEvent('hidden', {
        cancelable: false,
        target: this.$element,
        relatedTarget: null
      })
      this.emitEvent(hiddenEvt)
    }

    // Disable while open listeners/watchers
    this.setWhileOpenListeners(false)

    // If forced close, disable animation
    if (force) {
      removeClass(tip, ClassName.FADE)
    }
    // Hide tip
    removeClass(tip, ClassName.SHOW)
    if (this.$activeTrigger) {
      this.$activeTrigger.click = false
      this.$activeTrigger.focus = false
      this.$activeTrigger.hover = false
    }

    // Start the hide transition
    this.transitionOnce(tip, complete)

    this.$hoverState = ''
  }

  public emitEvent(evt: BvEvent): void {
    const evtName = evt.type
    if (this.$root && this.$root.$emit) {
      // Emit an event on $root
      this.$root.$emit(`bv::${(this.constructor as typeof ToolTip).NAME}::${evtName}`, evt)
    }
    const callbacks: Dict<Function> = this.$config
      ? (this.$config.callbacks as Dict<Function>) || {}
      : {}
    if (callbacks && isFunction(callbacks[evtName])) {
      callbacks[evtName](evt)
    }
  }

  public getContainer(): HTMLElement {
    const container: string | boolean = this.$config ? (this.$config.container as string) : false
    const body = document.body
    // If we are in a modal, we append to the modal instead of body,
    // unless a container is specified
    return container === false
      ? closest(MODAL_CLASS, this.$element) || body
      : select(container, body) || body
  }

  // Will be overridden by PopOver if needed
  public addAriaDescribedby(): void {
    // Add aria-describedby on trigger element, without removing any other IDs
    let desc = getAttr(this.$element, 'aria-describedby') || ''
    desc = desc
      .split(/\s+/)
      .concat(this.$id || '')
      .join(' ')
      .trim()
    setAttr(this.$element, 'aria-describedby', desc)
  }

  // Will be overridden by PopOver if needed
  public removeAriaDescribedby(): void {
    let desc = getAttr(this.$element, 'aria-describedby') || ''
    desc = desc
      .split(/\s+/)
      .filter((d): boolean => d !== (this.$id || ''))
      .join(' ')
      .trim()
    if (desc) {
      /* istanbul ignore next */
      setAttr(this.$element, 'aria-describedby', desc)
    } else {
      removeAttr(this.$element, 'aria-describedby')
    }
  }

  public removePopper(): void {
    if (this.$popper) {
      this.$popper.destroy()
    }
    this.$popper = undefined
  }

  public transitionOnce(tip: HTMLElement, complete: Function): void {
    const transEvents: string[] = this.getTransitionEndEvents()
    let called = false
    this.clearTimeout('fade')
    const fnOnce = (): void => {
      if (called) {
        /* istanbul ignore next */
        return
      }
      called = true
      this.clearTimeout('fade')
      transEvents.forEach((evtName): void => {
        eventOff(tip, evtName, fnOnce, EvtOpts)
      })
      // Call complete callback
      complete()
    }
    if (hasClass(tip, ClassName.FADE)) {
      transEvents.forEach((evtName): void => {
        eventOn(tip, evtName, fnOnce, EvtOpts)
      })
      // Fallback to setTimeout()
      this.setTimeout('fade', fnOnce, TRANSITION_DURATION)
    } else {
      fnOnce()
    }
  }

  // What transitionend event(s) to use? (returns array of event names)
  public getTransitionEndEvents(): string[] {
    for (const name in TransitionEndEvents) {
      if (this.$element && !isUndefined(this.$element.style.getPropertyValue(name))) {
        return TransitionEndEvents[name]
      }
    }
    // Fallback
    /* istanbul ignore next */
    return []
  }

  /* istanbul ignore next */
  public update(): void {
    if (!isUndefined(this.$popper)) {
      this.$popper.scheduleUpdate()
    }
  }

  // NOTE: Overridden by PopOver class
  public isWithContent(tip: HTMLElement): boolean {
    tip = tip || this.$tip
    if (!tip) {
      /* istanbul ignore next */
      return false
    }
    return Boolean(((select(Selector.TOOLTIP_INNER, tip) || {}) as HTMLElement).innerHTML)
  }

  // NOTE: Overridden by PopOver class
  public addAttachmentClass(attachment: string): void {
    addClass(this.getTipElement(), `${CLASS_PREFIX}-${attachment}`)
  }

  public getTipElement(): HTMLElement {
    if (!this.$tip && this.$config) {
      // Try and compile user supplied template, or fallback to default template
      this.$tip =
        this.compileTemplate(this.$config.template) ||
        this.compileTemplate((this.constructor as typeof ToolTip).Default.template)
    }
    // Add tab index so tip can be focused, and to allow it to be
    // set as relatedTarget in focusin/out events
    ;(this.$tip as HTMLElement).tabIndex = -1
    return this.$tip as HTMLElement
  }

  public compileTemplate(html: unknown): HTMLElement | undefined {
    if (!html || !isString(html)) {
      /* istanbul ignore next */
      return
    }
    let div: HTMLElement | null = document.createElement('div')
    div.innerHTML = html.trim()
    const node = div.firstElementChild ? div.removeChild(div.firstElementChild) : undefined
    div = null
    return node as HTMLElement
  }

  // NOTE: Overridden by PopOver class
  public setContent(tip: HTMLElement): void {
    this.setElementContent(select(Selector.TOOLTIP_INNER, tip), this.getTitle())
    removeClass(tip, ClassName.FADE)
    removeClass(tip, ClassName.SHOW)
  }

  public setElementContent(container: HTMLElement | null, content: HTMLElement | string): void {
    if (!container) {
      // If container element doesn't exist, just return
      /* istanbul ignore next */
      return
    }
    const allowHtml = this.$config ? this.$config.html : false
    if (isObject(content) && content.nodeType) {
      // Content is a DOM node
      if (allowHtml) {
        if (content.parentElement !== container) {
          container.innerHTML = ''
          container.appendChild(content)
        }
      } else {
        /* istanbul ignore next */
        container.innerText = content.innerText
      }
    } else {
      // We have a plain HTML string or Text
      container[allowHtml ? 'innerHTML' : 'innerText'] = content as string
    }
  }

  // NOTE: Overridden by PopOver class
  public getTitle(): string {
    let title: string = this.$config && this.$config.title ? (this.$config.title as string) : ''
    if (isFunction(title)) {
      // Call the function to get the title value
      /* istanbul ignore next */
      title = title(this.$element)
    }
    if (isObject(title) && title.nodeType && !title.innerHTML.trim()) {
      // We have a DOM node, but without inner content,
      // so just return empty string
      /* istanbul ignore next */
      title = ''
    }
    if (isString(title)) {
      title = title.trim()
    }
    if (!title) {
      // If an explicit title is not given, try element's title attributes
      title = getAttr(this.$element, 'title') || getAttr(this.$element, 'data-original-title') || ''
      title = title.trim()
    }

    return title
  }

  public static getAttachment(placement: string): Placement {
    return AttachmentMap[placement.toUpperCase()] as Placement
  }

  public listen(): void {
    const triggers =
      this.$config && this.$config.trigger
        ? (this.$config.trigger as string).trim().split(/\s+/)
        : []
    const el = this.$element

    // Listen for global show/hide events
    this.setRootListener(true)

    // Using 'this' as the handler will get automatically directed to
    // this.handleEvent and maintain our binding to 'this'
    triggers.forEach((trigger: string): void => {
      if (trigger === 'click') {
        eventOn(el, 'click', this, EvtOpts)
      } else if (trigger === 'focus') {
        eventOn(el, 'focusin', this, EvtOpts)
        eventOn(el, 'focusout', this, EvtOpts)
      } else if (trigger === 'blur') {
        // Used to close $tip when element looses focus
        eventOn(el, 'focusout', this, EvtOpts)
      } else if (trigger === 'hover') {
        eventOn(el, 'mouseenter', this, EvtOpts)
        eventOn(el, 'mouseleave', this, EvtOpts)
      }
    }, this)
  }

  public unListen(): void {
    const events = ['click', 'focusin', 'focusout', 'mouseenter', 'mouseleave']
    // Using "this" as the handler will get automatically directed to this.handleEvent
    events.forEach((evt): void => {
      eventOff(this.$element, evt, this as EventListenerObject, EvtOpts)
    }, this)

    // Stop listening for global show/hide/enable/disable events
    this.setRootListener(false)
  }

  public handleEvent(e: BvEvent & Event): void {
    // This special method allows us to use "this" as the event handlers
    if (isDisabled(this.$element as HTMLInputElement)) {
      // If disabled, don't do anything. Note: If tip is shown before element gets
      // disabled, then tip not close until no longer disabled or forcefully closed.
      /* istanbul ignore next */
      return
    }
    if (!this.$isEnabled) {
      // If not enable
      return
    }
    const type = e.type
    const target = e.target
    const relatedTarget = e.relatedTarget
    const $element = this.$element
    const $tip = this.$tip
    if (type === 'click') {
      this.toggle(e)
    } else if (type === 'focusin' || type === 'mouseenter') {
      this.enter(e)
    } else if (type === 'focusout') {
      // target is the element which is loosing focus
      // and relatedTarget is the element gaining focus
      if ($tip && $element && $element.contains(target) && $tip.contains(relatedTarget)) {
        // If focus moves from $element to $tip, don't trigger a leave
        /* istanbul ignore next */
        return
      }
      if ($tip && $element && $tip.contains(target) && $element.contains(relatedTarget)) {
        // If focus moves from $tip to $element, don't trigger a leave
        /* istanbul ignore next */
        return
      }
      /* istanbul ignore next: difficult to test */
      if ($tip && $tip.contains(target) && $tip.contains(relatedTarget)) {
        // If focus moves within $tip, don't trigger a leave
        return
      }
      /* istanbul ignore next: difficult to test */
      if ($element && $element.contains(target) && $element.contains(relatedTarget)) {
        // If focus moves within $element, don't trigger a leave
        return
      }
      // Otherwise trigger a leave
      this.leave(e)
    } else if (type === 'mouseleave') {
      this.leave(e)
    }
  }

  /* istanbul ignore next */
  public setRouteWatcher(on: boolean): void {
    if (on) {
      this.setRouteWatcher(false)
      if (this.$root && Boolean(this.$root.$route)) {
        this.$routeWatcher = this.$root.$watch('$route', (newVal, oldVal): void => {
          if (newVal === oldVal) {
            return
          }
          // If route has changed, we force hide the tooltip/popover
          this.forceHide()
        })
      }
    } else {
      if (this.$routeWatcher) {
        // Cancel the route watcher by calling the stored reference
        this.$routeWatcher()
        this.$routeWatcher = undefined
      }
    }
  }

  /* istanbul ignore next */
  public setModalListener(on: boolean): void {
    const modal = closest(MODAL_CLASS, this.$element)
    if (!modal) {
      // If we are not in a modal, don't worry. be happy
      return
    }
    // We can listen for modal hidden events on $root
    if (this.$root) {
      this.$root[on ? '$on' : '$off'](MODAL_CLOSE_EVENT, this.$forceHide as (() => void))
    }
  }

  public setRootListener(on: boolean): void {
    // Listen for global 'bv::{hide|show}::{tooltip|popover}' hide request event
    if (this.$root) {
      this.$root[on ? '$on' : '$off'](`bv::hide::${this.name}`, this.$doHide as (() => void))
      this.$root[on ? '$on' : '$off'](`bv::show::${this.name}`, this.$doShow as (() => void))
      this.$root[on ? '$on' : '$off'](`bv::disable::${this.name}`, this.$doDisable as (() => void))
      this.$root[on ? '$on' : '$off'](`bv::enable::${this.name}`, this.$doEnable as (() => void))
    }
  }

  public doHide(id: string): void {
    // Programmatically hide tooltip or popover
    if (!id) {
      // Close all tooltips or popovers
      this.forceHide()
    } else if (this.$element && this.$element.id && this.$element.id === id) {
      // Close this specific tooltip or popover
      this.hide()
    }
  }

  public doShow(id: string): void {
    // Programmatically show tooltip or popover
    if (!id) {
      // Open all tooltips or popovers
      this.show()
    } else if (id && this.$element && this.$element.id && this.$element.id === id) {
      // Show this specific tooltip or popover
      this.show()
    }
  }

  public doDisable(id: string): void {
    // Programmatically disable tooltip or popover
    if (!id) {
      // Disable all tooltips or popovers
      this.disable()
    } else if (this.$element && this.$element.id && this.$element.id === id) {
      // Disable this specific tooltip or popover
      this.disable()
    }
  }

  public doEnable(id: string): void {
    // Programmatically enable tooltip or popover
    if (!id) {
      // Enable all tooltips or popovers
      this.enable()
    } else if (this.$element && this.$element.id && this.$element.id === id) {
      // Enable this specific tooltip or popover
      this.enable()
    }
  }

  public setOnTouchStartListener(on: boolean): void {
    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children
    // Only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      /* istanbul ignore next: JSDOM does not support 'ontouchstart' event */
      arrayFrom(document.body.children).forEach((el): void => {
        if (on) {
          eventOn(el, 'mouseover', this._noop as (() => void))
        } else {
          eventOff(el, 'mouseover', this._noop as (() => void))
        }
      })
    }
  }

  public fixTitle(): void {
    const el = this.$element
    if (getAttr(el, 'title') || !isString(getAttr(el, 'data-original-title'))) {
      setAttr(el, 'data-original-title', getAttr(el, 'title') || '')
      setAttr(el, 'title', '')
    }
  }

  // Enter handler
  public enter(e: Event | null): void {
    if (e && this.$activeTrigger) {
      this.$activeTrigger[e.type === 'focusin' ? 'focus' : 'hover'] = true
    }
    if (hasClass(this.getTipElement(), ClassName.SHOW) || this.$hoverState === HoverState.SHOW) {
      this.$hoverState = HoverState.SHOW
      return
    }
    this.clearTimeout('hover')
    this.$hoverState = HoverState.SHOW
    let config = this.$config as ToolTipConfig
    if (config && (!config.delay || !(config.delay as { show: number }).show)) {
      this.show()
      return
    }
    this.setTimeout(
      'hover',
      (): void => {
        if (this.$hoverState === HoverState.SHOW) {
          this.show()
        }
      },
      this.$config && this.$config.delay
        ? ((this.$config.delay as Dict<Primitive>).show as number)
        : undefined
    )
  }

  // Leave handler
  public leave(e: Event | null): void {
    let config = this.$config as ToolTipConfig
    if (e && this.$activeTrigger) {
      this.$activeTrigger[e.type === 'focusout' ? 'focus' : 'hover'] = false
      if (e.type === 'focusout' && /blur/.test(config.trigger)) {
        // Special case for `blur`: we clear out the other triggers
        this.$activeTrigger.click = false
        this.$activeTrigger.hover = false
      }
    }
    if (this.isWithActiveTrigger()) {
      return
    }
    this.clearTimeout('hover')
    this.$hoverState = HoverState.OUT
    if (!config.delay || (config.delay && !(config.delay as { hide: number }).hide)) {
      this.hide()
      return
    }
    this.setTimeout(
      'hover',
      (): void => {
        if (this.$hoverState === HoverState.OUT) {
          this.hide()
        }
      },
      (config.delay as { hide: number }).hide
    )
  }

  public getPopperConfig(placement: Placement, tip: HTMLElement | null): PopperOptions {
    let config = this.$config as ToolTipConfig
    return {
      placement: (this.constructor as typeof ToolTip).getAttachment(placement),
      modifiers: {
        offset: { offset: this.getOffset(placement, tip) },
        flip: { behavior: config.fallbackPlacement },
        arrow: { element: '.arrow' },
        preventOverflow: {
          padding: config.boundaryPadding,
          boundariesElement: config.boundary
        }
      },
      onCreate: (data): void => {
        // Handle flipping arrow classes
        /* istanbul ignore next */
        if (data.originalPlacement !== data.placement) {
          this.handlePopperPlacementChange(data)
        }
      },
      onUpdate: (data): void => {
        // Handle flipping arrow classes
        /* istanbul ignore next */
        this.handlePopperPlacementChange(data)
      }
    }
  }

  /* istanbul ignore next */
  public getOffset(placement: Placement, tip: HTMLElement | null): number | string {
    let config = this.$config as ToolTipConfig
    if (!config || !config.offset) {
      const arrow = select(Selector.ARROW, tip)
      const arrowOffset =
        parseFloat(getCS(arrow).width || '0') + parseFloat(config.arrowPadding as string)
      switch (OffsetMap[placement.toUpperCase()]) {
        case +1:
          return `+50%p - ${arrowOffset}px`
        case -1:
          return `-50%p + ${arrowOffset}px`
        default:
          return 0
      }
    }
    return config.offset
  }

  public getPlacement(): Placement {
    let config = this.$config as ToolTipConfig
    const placement = config.placement
    if (isFunction(placement)) {
      /* istanbul ignore next */
      return placement.call(this, this.$tip, this.$element)
    }
    return placement
  }

  public isWithActiveTrigger(): boolean {
    for (const trigger in this.$activeTrigger) {
      if (this.$activeTrigger[trigger]) {
        return true
      }
    }
    return false
  }

  // NOTE: Overridden by PopOver class
  /* istanbul ignore next */
  public cleanTipClass(): void {
    const tip = this.getTipElement()
    const tabClass = tip.className.match(BS_CLASS_PREFIX_REGEX)
    if (!isNull(tabClass) && tabClass.length > 0) {
      tabClass.forEach((cls): void => {
        removeClass(tip, cls)
      })
    }
  }

  /* istanbul ignore next */
  public handlePopperPlacementChange(data: Data): void {
    this.cleanTipClass()
    this.addAttachmentClass((this.constructor as typeof ToolTip).getAttachment(data.placement))
  }

  /* istanbul ignore next */
  public fixTransition(tip: HTMLElement): void {
    let config = this.$config as ToolTipConfig
    const initConfigAnimation = config.animation || false
    if (!isNull(getAttr(tip, 'x-placement'))) {
      return
    }
    removeClass(tip, ClassName.FADE)
    config.animation = false
    this.hide()
    this.show()
    config.animation = initConfigAnimation
  }
}

/*
 * Export our directive
 */
export const VBToolTip = ToolTip.GetBvDirective()

export default VBToolTip
