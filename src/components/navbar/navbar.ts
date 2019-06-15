import { BooleanLike, functionalComponent, PropsDef } from "../../utils";

export interface BNavbarConfig {
    tag?: string|null;
    type?: string|null;
    variant?: string|null;
    toggleable?: BooleanLike;
    fixed?: string;
    sticky?: BooleanLike;
    print?: BooleanLike;
}

const props:PropsDef<BNavbarConfig> = {
  tag:{
    type:String,
    default:"nav"
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

export const BNavbar = functionalComponent<BNavbarConfig>({
  props: props,
  methods:{
    Test:()=>'123'
  }
});

export default BNavbar;