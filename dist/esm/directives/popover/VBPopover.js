import { C as getComponentConfig, b as isString, s as isFunction, E as isObject, l as keys, P as select, J as addClass, K as removeClass, U as isNull, Q as getAttr } from '../../chunks/a6dd0dc4.js';
import 'vue';
import '../../chunks/224339a2.js';
import '../../chunks/d4da053b.js';
import '../../chunks/0fa52133.js';
import { T as ToolTip } from '../../chunks/6e3a15fa.js';
import '../../chunks/cfdbb5bc.js';

const NAME = 'popover';
const CLASS_PREFIX = 'bs-popover';
const BS_CLASS_PREFIX_REGEX = new RegExp(`\\b${CLASS_PREFIX}\\S+`, 'g');
const Defaults = Object.assign({}, ToolTip.Default, { placement: 'right', trigger: 'click', content: '', template: '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-header"></h3>' +
        '<div class="popover-body"></div></div>' });
const ClassName = {
    FADE: 'fade',
    SHOW: 'show'
};
const Selector = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
};
// Valid event triggers
const validTriggers = {
    focus: true,
    hover: true,
    click: true,
    blur: true
};
class PopOver extends ToolTip {
    // --- Getter overrides ---
    static get Default() {
        return Defaults;
    }
    static get NAME() {
        return NAME;
    }
    // Build a PopOver config based on bindings (if any)
    // Arguments and modifiers take precedence over passed value config object
    /* istanbul ignore next: not easy to test */
    static ParseBindings(bindings) {
        // We start out with a basic config
        const NAME = 'BPopover';
        let config = {
            delay: getComponentConfig(NAME, 'delay'),
            boundary: String(getComponentConfig(NAME, 'boundary')),
            boundaryPadding: parseInt(getComponentConfig(NAME, 'boundaryPadding'), 10) || 0
        };
        // Process bindings.value
        if (isString(bindings.value)) {
            // Value is popover content (html optionally supported)
            config.content = bindings.value;
        }
        else if (isFunction(bindings.value)) {
            // Content generator function
            config.content = bindings.value;
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
        keys(bindings.modifiers).forEach((mod) => {
            if (/^html$/.test(mod)) {
                // Title allows HTML
                config.html = true;
            }
            else if (/^nofade$/.test(mod)) {
                // no animation
                config.animation = false;
            }
            else if (/^(auto|top(left|right)?|bottom(left|right)?|left(top|bottom)?|right(top|bottom)?)$/.test(mod)) {
                // placement of popover
                config.placement = mod;
            }
            else if (/^(window|viewport|scrollParent)$/.test(mod)) {
                // Boundary of popover
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
                // Offset value (negative allowed)
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
        triggers.forEach((trigger) => {
            if (validTriggers[trigger]) {
                selectedTriggers[trigger] = true;
            }
        });
        // Parse modifiers for triggers
        keys(validTriggers).forEach((trigger) => {
            if (bindings.modifiers[trigger]) {
                selectedTriggers[trigger] = true;
            }
        });
        // Sanitize triggers
        config.trigger = keys(selectedTriggers).join(' ');
        if (config.trigger === 'blur') {
            // Blur by itself is useless, so convert it to focus
            config.trigger = 'focus';
        }
        if (!config.trigger) {
            // Remove trigger config
            delete config.trigger;
        }
        return config;
    }
    // --- Method overrides ---
    isWithContent(tip) {
        tip = tip || this.$tip;
        if (!tip) {
            /* istanbul ignore next */
            return false;
        }
        const hasTitle = Boolean((select(Selector.TITLE, tip) || {}).innerHTML);
        const hasContent = Boolean((select(Selector.CONTENT, tip) || {}).innerHTML);
        return hasTitle || hasContent;
    }
    addAttachmentClass(attachment) {
        addClass(this.getTipElement(), `${CLASS_PREFIX}-${attachment}`);
    }
    setContent(tip) {
        // we use append for html objects to maintain js events/components
        this.setElementContent(select(Selector.TITLE, tip), this.getTitle());
        this.setElementContent(select(Selector.CONTENT, tip), this.getContent());
        removeClass(tip, ClassName.FADE);
        removeClass(tip, ClassName.SHOW);
    }
    // This method may look identical to ToolTip version, but it uses a different RegEx defined above
    cleanTipClass() {
        const tip = this.getTipElement();
        const tabClass = tip.className.match(BS_CLASS_PREFIX_REGEX);
        if (!isNull(tabClass) && tabClass.length > 0) {
            tabClass.forEach((cls) => {
                removeClass(tip, cls);
            });
        }
    }
    getTitle() {
        let config = this.$config;
        let title = config.title || '';
        /* istanbul ignore next */
        if (isFunction(title)) {
            title = title(this.$element);
        }
        /* istanbul ignore next */
        if (isObject(title) && title.nodeType && !title.innerHTML.trim()) {
            // We have a dom node, but without inner content, so just return an empty string
            title = '';
        }
        if (isString(title)) {
            title = title.trim();
        }
        if (!title) {
            // Try and grab element's title attribute
            title = getAttr(this.$element, 'title') || getAttr(this.$element, 'data-original-title') || '';
            title = title.trim();
        }
        return title;
    }
    // New methods
    getContent() {
        let config = this.$config;
        let content = config.content || '';
        /* istanbul ignore next */
        if (isFunction(content)) {
            content = content(this.$element);
        }
        /* istanbul ignore next */
        if (isObject(content) && content.nodeType && !content.innerHTML.trim()) {
            // We have a dom node, but without inner content, so just return an empty string
            content = '';
        }
        if (isString(content)) {
            content = content.trim();
        }
        return content;
    }
}
/*
 * Export our directive
 */
const VBPopover = PopOver.GetBvDirective();

export default VBPopover;
export { PopOver, VBPopover };
