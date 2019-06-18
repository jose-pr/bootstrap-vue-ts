import ToolTip, { ToolTipConfig } from '../../utils/tooltip'
import { select, addClass, removeClass, getAttr } from '../../utils/dom'
import { isFunction, isNull, isString } from '../../utils/inspect'
import { isObject, keys } from '../../utils/object'
import { DirectiveBinding, getComponentConfig } from '../../utils'
import { Boundary, Placement } from 'popper.js'

const NAME = 'popover'
const CLASS_PREFIX = 'bs-popover'
const BS_CLASS_PREFIX_REGEX = new RegExp(`\\b${CLASS_PREFIX}\\S+`, 'g')

const Defaults: ToolTipConfig = {
  ...ToolTip.Default,
  placement: 'right',
  trigger: 'click',
  content: '',
  template:
    '<div class="popover" role="tooltip">' +
    '<div class="arrow"></div>' +
    '<h3 class="popover-header"></h3>' +
    '<div class="popover-body"></div></div>'
}

const ClassName = {
  FADE: 'fade',
  SHOW: 'show'
}

const Selector = {
  TITLE: '.popover-header',
  CONTENT: '.popover-body'
}

// Valid event triggers
const validTriggers: { [k in Triggers]?: boolean } = {
  focus: true,
  hover: true,
  click: true,
  blur: true
}
export type Triggers = 'focus' | 'hover' | 'click' | 'blur'

export class PopOver extends ToolTip {
  // --- Getter overrides ---

  public static get Default(): ToolTipConfig {
    return Defaults
  }

  public static get NAME(): string {
    return NAME
  }

  // Build a PopOver config based on bindings (if any)
  // Arguments and modifiers take precedence over passed value config object
  /* istanbul ignore next: not easy to test */

  static ParseBindings<T = ToolTipConfig>(bindings: DirectiveBinding): T {
    // We start out with a basic config
    const NAME = 'BPopover'
    let config: Partial<ToolTipConfig> = {
      delay: getComponentConfig(NAME, 'delay'),
      boundary: String(getComponentConfig(NAME, 'boundary')) as Boundary,
      boundaryPadding: parseInt(getComponentConfig(NAME, 'boundaryPadding'), 10) || 0
    }

    // Process bindings.value
    if (isString(bindings.value)) {
      // Value is popover content (html optionally supported)
      config.content = bindings.value
    } else if (isFunction(bindings.value)) {
      // Content generator function
      config.content = bindings.value
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
    keys(bindings.modifiers).forEach((mod): void => {
      if (/^html$/.test(mod)) {
        // Title allows HTML
        config.html = true
      } else if (/^nofade$/.test(mod)) {
        // no animation
        config.animation = false
      } else if (
        /^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(
          mod
        )
      ) {
        // placement of popover
        config.placement = mod as Placement
      } else if (/^(window|viewport|scrollParent)$/.test(mod)) {
        // Boundary of popover
        config.boundary = mod as Boundary
      } else if (/^d\d+$/.test(mod)) {
        // Delay value
        const delay = parseInt(mod.slice(1), 10) || 0
        if (delay) {
          config.delay = delay
        }
      } else if (/^o-?\d+$/.test(mod)) {
        // Offset value (negative allowed)
        const offset = parseInt(mod.slice(1), 10) || 0
        if (offset) {
          config.offset = offset
        }
      }
    })

    // Special handling of event trigger modifiers trigger is
    // a space separated list
    const selectedTriggers: { [key in Triggers]?: boolean } = {}

    // Parse current config object trigger
    let triggers = isString(config.trigger) ? config.trigger.trim().split(/\s+/) : []
    triggers.forEach((trigger: string): void => {
      if (validTriggers[trigger as Triggers]) {
        selectedTriggers[trigger as Triggers] = true
      }
    })

    // Parse modifiers for triggers
    keys(validTriggers).forEach((trigger): void => {
      if (bindings.modifiers[trigger]) {
        selectedTriggers[trigger as Triggers] = true
      }
    })

    // Sanitize triggers
    config.trigger = keys(selectedTriggers).join(' ')
    if (config.trigger === 'blur') {
      // Blur by itself is useless, so convert it to focus
      config.trigger = 'focus'
    }
    if (!config.trigger) {
      // Remove trigger config
      delete config.trigger
    }

    return config as T
  }

  // --- Method overrides ---

  public isWithContent(tip: HTMLElement): boolean {
    tip = tip || this.$tip
    if (!tip) {
      /* istanbul ignore next */
      return false
    }
    const hasTitle = Boolean(((select(Selector.TITLE, tip) || {}) as HTMLElement).innerHTML)
    const hasContent = Boolean(((select(Selector.CONTENT, tip) || {}) as HTMLElement).innerHTML)
    return hasTitle || hasContent
  }

  public addAttachmentClass(attachment: string): void /* istanbul ignore next */ {
    addClass(this.getTipElement(), `${CLASS_PREFIX}-${attachment}`)
  }

  public setContent(tip: HTMLElement): void {
    // we use append for html objects to maintain js events/components
    this.setElementContent(select(Selector.TITLE, tip), this.getTitle())
    this.setElementContent(select(Selector.CONTENT, tip), this.getContent())

    removeClass(tip, ClassName.FADE)
    removeClass(tip, ClassName.SHOW)
  }

  // This method may look identical to ToolTip version, but it uses a different RegEx defined above
  public cleanTipClass(): void /* istanbul ignore next */ {
    const tip = this.getTipElement()
    const tabClass = tip.className.match(BS_CLASS_PREFIX_REGEX)
    if (!isNull(tabClass) && tabClass.length > 0) {
      tabClass.forEach((cls): void => {
        removeClass(tip, cls)
      })
    }
  }

  public getTitle(): string {
    let config = this.$config as ToolTipConfig
    let title = config.title || ''
    /* istanbul ignore next */
    if (isFunction(title)) {
      title = title(this.$element)
    }
    /* istanbul ignore next */
    if (isObject(title) && title.nodeType && !title.innerHTML.trim()) {
      // We have a dom node, but without inner content, so just return an empty string
      title = ''
    }
    if (isString(title)) {
      title = title.trim()
    }
    if (!title) {
      // Try and grab element's title attribute
      title = getAttr(this.$element, 'title') || getAttr(this.$element, 'data-original-title') || ''
      title = title.trim()
    }
    return title
  }

  // New methods

  public getContent(): string {
    let config = this.$config as ToolTipConfig
    let content = config.content || ''
    /* istanbul ignore next */
    if (isFunction(content)) {
      content = content(this.$element)
    }
    /* istanbul ignore next */
    if (isObject(content) && content.nodeType && !content.innerHTML.trim()) {
      // We have a dom node, but without inner content, so just return an empty string
      content = ''
    }
    if (isString(content)) {
      content = content.trim()
    }
    return content
  }
}

/*
 * Export our directive
 */
export const VBPopover = PopOver.GetBvDirective()

export default VBPopover
