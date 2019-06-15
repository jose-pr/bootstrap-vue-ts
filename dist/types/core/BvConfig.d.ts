import OurVue from '../utils/vue';
export declare class BvConfig {
    private $_config;
    private $_cachedBreakpoints;
    constructor();
    static readonly Defaults: BvConfigOptions;
    private readonly defaults;
    getDefaults(): BvConfigOptions;
    setConfig(config?: BvConfigOptions): void;
    resetConfig(): void;
    getConfig(): BvConfigOptions;
    getConfigValue(key: string): BvConfigOptions;
}
export declare const setConfig: (config?: {}, Vue?: import("vue/types/vue").VueConstructor<OurVue>) => void;
export declare const resetConfig: () => void;
