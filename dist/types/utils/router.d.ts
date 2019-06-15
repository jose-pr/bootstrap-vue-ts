import { Dict } from './types';
export declare const stringifyQueryObj: (obj: any) => string;
export declare const parseQuery: (query: any) => Dict<string | (string | null)[] | null>;
export declare const isRouterLink: (tag: string) => boolean;
interface routerPathObj {
    path?: string;
    query?: string;
    hash?: string;
}
export declare const computeTag: ({ to, disabled }: {
    to?: string | routerPathObj | undefined;
    disabled?: boolean | undefined;
} | undefined, thisOrParent: any) => "a" | "nuxt-link" | "router-link";
export declare const computeRel: ({ target, rel }?: {
    target?: string | undefined;
    rel?: string | undefined;
}) => string | null;
export declare const computeHref: ({ href, to }?: {
    href?: string | undefined;
    to?: string | routerPathObj | undefined;
}, tag?: string, fallback?: string, toFallback?: string) => string | null;
export {};
