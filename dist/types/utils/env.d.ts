/**
 * Utilities to get information about the current environment
 */
export declare const hasWindowSupport: boolean;
export declare const hasDocumentSupport: boolean;
export declare const hasNavigatorSupport: boolean;
export declare const hasPromiseSupport: boolean;
export declare const hasMutationObserverSupport: boolean;
export declare const isBrowser: boolean;
export declare const userAgent: string;
export declare const isJSDOM: boolean;
export declare const isIE: boolean;
export declare const hasPassiveEventSupport: boolean;
export declare const hasTouchSupport: boolean;
export declare const hasPointerEventSupport: boolean;
export declare const hasIntersectionObserverSupport: boolean;
export declare const getEnv: (key: string, fallback?: null) => any;
export declare const getNoWarn: () => any;
