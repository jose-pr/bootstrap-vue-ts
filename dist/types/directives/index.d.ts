export declare const directivePlugins: {
    VBModalPlugin: import("../core/BvPlugin").BvPlugin;
};
export declare const directivesPlugin: {
    install: {
        (Vue: import("vue").VueConstructor<import("vue").default>, config?: {}): void;
        installed: boolean;
    };
};
export * from './modal';
