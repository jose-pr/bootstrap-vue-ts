import { functionalComponent } from "../../utils";
const props = {
    tag: {
        type: String,
        default: "nav"
    },
    type: {
        type: String,
        default: "light"
    },
    variant: {
        type: String,
        default: "dark"
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
export const BNavbar = functionalComponent({
    props: props,
    methods: {
        Test: () => '123'
    }
});
export default BNavbar;
