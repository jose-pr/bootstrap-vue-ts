import OurVue from './utils/vue';
export declare class BvConfig {
    $_config: BvConfigOptions;
    $_cachedBreakpoints: string[] | null;
    constructor();
    static readonly Defaults: Readonly<BvConfigOptions>;
    readonly defaults: Readonly<BvConfigOptions>;
    getDefaults(): Readonly<BvConfigOptions>;
    setConfig(config?: BvConfigOptions): void;
    resetConfig(): void;
    getConfig(): BvConfigOptions;
    getConfigValue(key: string): any;
}
export declare const setConfig: (config?: {}, Vue?: import("vue/types/vue").VueConstructor<OurVue>) => void;
export declare const resetConfig: () => void;
