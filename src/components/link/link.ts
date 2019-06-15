import Vue from 'Vue'
import { mergeData } from 'vue-functional-data-merge'
import { PropOptions, CreateElement } from 'vue'
import { BvComponentConfig } from '../../core/BvComponent'
import { PropsDef, Dict, keys, arrayIncludes, concat, isRouterLink, isFunction, computeTag, computeRel, computeHref, isVueElement, functionalComponent } from '../../utils';

/**
 * The Link component is used in many other BV components.
 * As such, sharing its props makes supporting all its features easier.
 * However, some components need to modify the defaults for their own purpose.
 * Prefer sharing a fresh copy of the props to ensure mutations
 * do not affect other component references to the props.
 *
 * https://github.com/vuejs/vue-router/blob/dev/src/components/link.js
 * @return {{}}
 */
export interface BLinkConfig extends BvComponentConfig {
  href?: string
  rel?: string
  target?: string
  active?: boolean
  disabled?: boolean
  to?:
    | string
    | {
        path?: string
        query?: string
        hash?: string
      }
  append?: boolean
  replace?: boolean
  event?: string | []
  activeClass?: string
  exact?: boolean
  exactActiveClass?: boolean
  routerTag?: string
  noPrefetch?: boolean
}
export const propsFactory: () => PropsDef<BLinkConfig> = () => {
  return {
    href: {
      type: String,
      default: null
    },
    rel: {
      type: String,
      default: null
    },
    target: {
      type: String,
      default: '_self'
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // router-link specific props
    to: {
      type: [String, Object],
      default: null
    },
    append: {
      type: Boolean,
      default: false
    },
    replace: {
      type: Boolean,
      default: false
    },
    event: {
      type: [String, Array],
      default: 'click'
    },
    activeClass: {
      type: String
      // default: undefined
    },
    exact: {
      type: Boolean,
      default: false
    },
    exactActiveClass: {
      type: String
      // default: undefined
    },
    routerTag: {
      type: String,
      default: 'a'
    },
    // nuxt-link specific prop(s)
    noPrefetch: {
      type: Boolean,
      default: false
    }
  }
}

export const props = propsFactory()

// Return a fresh copy of <b-link> props
// Containing only the specified prop(s)
export const pickLinkProps = (propsToPick: string[]) => {
  const freshLinkProps = propsFactory() as Dict<PropOptions>
  // Normalize everything to array.
  propsToPick = concat(propsToPick)

  return keys(freshLinkProps).reduce<Dict<PropOptions>>((memo, prop) => {
    if (arrayIncludes(propsToPick, prop)) {
      memo[prop] = freshLinkProps[prop]
    }

    return memo
  }, {})
}

// Return a fresh copy of <b-link> props
// Keeping all but the specified omitting prop(s)
export const omitLinkProps = (propsToOmit: string[]) => {
  const freshLinkProps = propsFactory() as Dict<PropOptions>
  // Normalize everything to array.
  propsToOmit = concat(propsToOmit)

  return keys(props).reduce<Dict<PropOptions>>((memo, prop) => {
    if (!arrayIncludes(propsToOmit, prop)) {
      memo[prop] = freshLinkProps[prop]
    }

    return memo
  }, {})
}

const clickHandlerFactory = ({
  disabled,
  tag,
  href,
  suppliedHandler,
  parent
}: {
  disabled: boolean
  tag: string
  href: string | null
  suppliedHandler: ((...args:any)=>void)[]
  parent: Vue
}) => {
  return function onClick(evt:  Event) {  
    if (disabled && evt instanceof Event) {
      // Stop event from bubbling up.
      evt.stopPropagation()
      // Kill the event loop attached to this specific EventTarget.
      // Needed to prevent vue-router for doing its thing
      evt.stopImmediatePropagation()
    } else {
      if (isRouterLink(tag) && isVueElement(evt.target)) {
        // Router links do not emit instance 'click' events, so we
        // add in an $emit('click', evt) on it's vue instance
        /* istanbul ignore next: difficult to test, but we know it works */
        evt.target.__vue__.$emit('click', evt)
      }
      // Call the suppliedHandler(s), if any provided
      let args = Array.from(arguments)
      concat(suppliedHandler)
        .filter(h => isFunction(h))
        .forEach(handler => {
          handler(...args)
        })
      parent.$root.$emit('clicked::link', evt)
    }

    if ((!isRouterLink(tag) && href === '#') || disabled) {
      // Stop scroll-to-top behavior or navigation on regular links
      // when href is just '#'
      evt.preventDefault()
    }
  }
}

// @vue/component
export default functionalComponent<BLinkConfig>({
  props: propsFactory(),
  render(h, { props, data, parent, children }) {
    const tag = computeTag(props, parent)
    const rel = computeRel(props)
    const href = computeHref(props, tag)
    const eventType = isRouterLink(tag) ? 'nativeOn' : 'on'
    const suppliedHandler = (data[eventType] || {}).click as ((...args:any)=>void)[]
    const handlers = {
      click: clickHandlerFactory({ tag, href, disabled: props.disabled!, suppliedHandler, parent })
    }

    const componentData = mergeData(data, {
      class: { active: props.active, disabled: props.disabled },
      attrs: {
        rel,
        target: props.target,
        tabindex: props.disabled ? '-1' : data.attrs ? data.attrs.tabindex : null,
        'aria-disabled': props.disabled ? 'true' : null
      },
      props: { ...props, tag: props.routerTag }
    })

    // If href attribute exists on router-link (even undefined or null) it fails working on SSR
    // So we explicitly add it here if needed (i.e. if computeHref() is truthy)
    if (href) {
      componentData!.attrs!.href = href
    } else {
      // Ensure the prop HREF does not exist for router links
      delete componentData!.props!.href
    }

    // We want to overwrite any click handler since our callback
    // will invoke the user supplied handler if !props.disabled
    componentData[eventType] = { ...(componentData[eventType] || {}), ...handlers }

    return h(tag, componentData, children)
  }
})
