import { o as functionalComponent } from '../../chunks/a38114fa.js';
import '../../chunks/1b6c0039.js';
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
