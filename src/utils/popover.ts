import ToolTip, { ToolTipConfig } from './tooltip'
import { select, addClass, removeClass, getAttr } from './dom'
import { isFunction, isNull, isString } from './inspect'
import { isObject } from './object'

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

class PopOver extends ToolTip {
  // --- Getter overrides ---

  public static get Default(): ToolTipConfig {
    return Defaults
  }

  public static get NAME(): string {
    return NAME
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

export default PopOver
