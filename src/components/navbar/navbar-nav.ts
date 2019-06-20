import Vue from 'vue'
import { isString, BooleanLike, functionalComponent, PropsDef } from '@utils'

export interface BNavbarNavConfig {
  tag: string
  type: string
  variant: string
  toggleable: BooleanLike
  fixed: string
  sticky: BooleanLike
  print: BooleanLike
}

const props: PropsDef<BNavbarNavConfig> = {
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
}

export const BNavbarNav = functionalComponent<BNavbarNavConfig>({
  props: props,
  methods: {
    Test: () => '123'
  }
})

export default BNavbarNav
