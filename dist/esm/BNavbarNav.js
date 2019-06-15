import { n as functionalComponent } from './chunk-f3e511bd.js';
import './chunk-efcf0387.js';
import 'vue';

const props = {
    tag: {
        type: String,
        default: 'nav'
    },
    type: {
        type: String,
        default: 'light'
    },
    variant: {
        type: String,
        default: 'dark'
    },
    toggleable: {
        type: [Boolean, String],
        default: false
    },
    fixed: {
        type: String
    },
    sticky: {
        type: Boolean,
        default: false
    },
    print: {
        type: Boolean,
        default: false
    }
};
const BNavbarNav = functionalComponent({
    props: props,
    methods: {
        Test: () => '123'
    }
});

export default BNavbarNav;
export { BNavbarNav };
