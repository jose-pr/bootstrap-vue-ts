import { n as functionalComponent } from '../../chunks/f3e511bd.js';
import '../../chunks/efcf0387.js';
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
const BNavbar = functionalComponent({
    props: props,
    methods: {
        Test: () => '123'
    }
});

export default BNavbar;
export { BNavbar };