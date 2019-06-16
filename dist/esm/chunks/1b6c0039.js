import { i as isArray, a as isPlainObject, k as keys, b as isObject, d as deepFreeze, O as OurVue, c as isUndefined, e as isNull, f as isString } from './a38114fa.js';
import 'vue';

const cloneDeep = (obj, defaultValue = obj) => {
    if (isArray(obj)) {
        return obj.reduce((result, val) => [...result, cloneDeep(val, val)], []);
    }
    if (isPlainObject(obj)) {
        return keys(obj).reduce((result, key) => (Object.assign({}, result, { [key]: cloneDeep(obj[key], obj[key]) })), {});
    }
    return defaultValue;
};

/**
 * Get property defined by dot/array notation in string.
 *
 * @link https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf#gistcomment-1935901
 *
 * @param {Object} obj
 * @param {string|Array} path
 * @param {*} defaultValue (optional)
 * @return {*}
 */
const get = (obj, path, defaultValue = null) => {
    // Handle array of path values
    path = isArray(path) ? path.join('.') : path;
    // If no path or no object passed
    if (!path || !isObject(obj)) {
        return defaultValue;
    }
    // Handle edge case where user has dot(s) in top-level item field key
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2762
    if (obj.hasOwnProperty(path)) {
        return obj[path];
    }
    // Handle string array notation (numeric indices only)
    path = String(path).replace(/\[(\d+)]/g, '.$1');
    const steps = path.split('.').filter(Boolean);
    // Handle case where someone passes a string of only dots
    if (steps.length === 0) {
        return defaultValue;
    }
    // Traverse path in object to find result
    return steps.every(step => isObject(obj) && obj.hasOwnProperty(step) && (obj = obj[step]) != null)
        ? obj
        : defaultValue;
};

const BV_CONFIG_PROP_NAME = '$bvConfig';
// General BootstrapVue configuration
//
// BREAKPOINT DEFINITIONS
//
// Some components (BCol and BFormGroup) generate props based on breakpoints, and this
// occurs when the component is first loaded (evaluated), which may happen before the
// config is created/modified
//
// To get around this we make these components async (lazy evaluation)
// The component definition is only called/executed when the first access to the
// component is used (and cached on subsequent uses)
//
// See: https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components
//
// PROP DEFAULTS
//
// For default values on props, we use the default value factory function approach so
// so that the default values are pulled in at each component instantiation
//
//  props: {
//    variant: {
//      type: String,
//      default: () => getConfigComponent('BAlert', 'variant')
//    }
//  }
// prettier-ignore
var DEFAULTS = deepFreeze({
    // Breakpoints
    breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    // Component Specific defaults are keyed by the component
    // name (PascalCase) and prop name (camelCase)
    BAlert: {
        dismissLabel: 'Close',
        variant: 'info'
    },
    BBadge: {
        variant: 'secondary'
    },
    BButton: {
        variant: 'secondary'
    },
    BButtonClose: {
        // `textVariant` is `null` to inherit the current text color
        textVariant: null,
        ariaLabel: 'Close'
    },
    BCardSubTitle: {
        // BCard and BCardBody also inherit this prop
        subTitleTextVariant: 'muted'
    },
    BCarousel: {
        labelPrev: 'Previous Slide',
        labelNext: 'Next Slide',
        labelGotoSlide: 'Goto Slide',
        labelIndicators: 'Select a slide to display'
    },
    BDropdown: {
        toggleText: 'Toggle Dropdown',
        variant: 'secondary',
        splitVariant: null
    },
    BFormFile: {
        browseText: 'Browse',
        // Chrome default file prompt
        placeholder: 'No file chosen',
        dropPlaceholder: 'Drop files here'
    },
    BFormText: {
        textVariant: 'muted'
    },
    BImg: {
        blankColor: 'transparent'
    },
    BImgLazy: {
        blankColor: 'transparent'
    },
    BJumbotron: {
        bgVariant: null,
        borderVariant: null,
        textVariant: null
    },
    BListGroupItem: {
        variant: null
    },
    BModal: {
        titleTag: 'h5',
        size: 'md',
        headerBgVariant: null,
        headerBorderVariant: null,
        headerTextVariant: null,
        headerCloseVariant: null,
        bodyBgVariant: null,
        bodyTextVariant: null,
        footerBgVariant: null,
        footerBorderVariant: null,
        footerTextVariant: null,
        cancelTitle: 'Cancel',
        cancelVariant: 'secondary',
        okTitle: 'OK',
        okVariant: 'primary',
        headerCloseLabel: 'Close'
    },
    BNavbar: {
        variant: null
    },
    BNavbarToggle: {
        label: 'Toggle navigation'
    },
    BProgress: {
        variant: null
    },
    BProgressBar: {
        variant: null
    },
    BSpinner: {
        variant: null
    },
    BTable: {
        selectedVariant: 'primary',
        headVariant: null,
        footVariant: null
    },
    BToast: {
        toaster: 'b-toaster-top-right',
        autoHideDelay: 5000,
        variant: null,
        toastClass: null,
        headerClass: null,
        bodyClass: null,
        solid: false
    },
    BToaster: {
        ariaLive: null,
        ariaAtomic: null,
        role: null
    },
    BTooltip: {
        delay: 0,
        boundary: 'scrollParent',
        boundaryPadding: 5
    },
    BPopover: {
        delay: 0,
        boundary: 'scrollParent',
        boundaryPadding: 5
    }
});

// --- Constants ---
const VueProto = OurVue.prototype;

const TestPartial1 = () => {
    return 'TEST PARTIAL 1';
};

/**
 * Convert a value to a string that can be rendered.
 */
const toString = (val, spaces = 2) => {
    return isUndefined(val) || isNull(val)
        ? ''
        : isArray(val) || (isPlainObject(val) && val.toString === Object.prototype.toString)
            ? JSON.stringify(val, null, spaces)
            : String(val);
};

const ANCHOR_TAG = 'a';
// Precompile RegExp
const commaRE = /%2C/g;
const encodeReserveRE = /[!'()*]/g;
// Method to replace reserved chars
const encodeReserveReplacer = (c) => '%' + c.charCodeAt(0).toString(16);
// Fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = (str) => encodeURIComponent(toString(str))
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ',');
// Stringifies an object of query parameters
// See: https://github.com/vuejs/vue-router/blob/dev/src/util/query.js
const stringifyQueryObj = (obj) => {
    if (!isPlainObject(obj)) {
        return '';
    }
    const query = keys(obj)
        .map(key => {
        const val = obj[key];
        if (isUndefined(val)) {
            return '';
        }
        else if (isNull(val)) {
            return encode(key);
        }
        else if (isArray(val)) {
            return val
                .reduce((results, val2) => {
                if (isNull(val2)) {
                    results.push(encode(key));
                }
                else if (!isUndefined(val2)) {
                    // Faster than string interpolation
                    results.push(encode(key) + '=' + encode(val2));
                }
                return results;
            }, [])
                .join('&');
        }
        // Faster than string interpolation
        return encode(key) + '=' + encode(val);
    })
        /* must check for length, as we only want to filter empty strings, not things that look falsey! */
        .filter(x => x.length > 0)
        .join('&');
    return query ? `?${query}` : '';
};
const isRouterLink = (tag) => tag !== ANCHOR_TAG;
const computeTag = ({ to, disabled } = {}, thisOrParent) => {
    return thisOrParent.$router && to && !disabled
        ? thisOrParent.$nuxt
            ? 'nuxt-link'
            : 'router-link'
        : ANCHOR_TAG;
};
const computeRel = ({ target, rel } = {}) => {
    if (target === '_blank' && isNull(rel)) {
        return 'noopener';
    }
    return rel || null;
};
const computeHref = ({ href, to } = {}, tag = ANCHOR_TAG, fallback = '#', toFallback = '/') => {
    // We've already checked the $router in computeTag(), so isRouterLink() indicates a live router.
    // When deferring to Vue Router's router-link, don't use the href attribute at all.
    // We return null, and then remove href from the attributes passed to router-link
    if (isRouterLink(tag)) {
        return null;
    }
    // Return `href` when explicitly provided
    if (href) {
        return href;
    }
    // Reconstruct `href` when `to` used, but no router
    if (to) {
        // Fallback to `to` prop (if `to` is a string)
        if (isString(to)) {
            return to || toFallback;
        }
        // Fallback to `to.path + to.query + to.hash` prop (if `to` is an object)
        let _to = to;
        if (isPlainObject(to) && (_to.path || _to.query || _to.hash)) {
            const path = toString(_to.path);
            const query = stringifyQueryObj(_to.query);
            let hash = toString(_to.hash);
            hash = !hash || hash.charAt(0) === '#' ? hash : `#${hash}`;
            return `${path}${query}${hash}` || toFallback;
        }
    }
    // If nothing is provided return the fallback
    return fallback;
};

export { BV_CONFIG_PROP_NAME as B, DEFAULTS as D, TestPartial1 as T, computeTag as a, computeHref as b, cloneDeep as c, computeRel as d, get as g, isRouterLink as i };
