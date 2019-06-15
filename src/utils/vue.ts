import Vue , { FunctionalComponentOptions, VueConstructor} from "vue";
import { RecordPropsDefinition } from "vue/types/options"
import { Dict } from './types';


//
// Single point of contact for Vue
//
// TODO:
//   Conditionally import Vue if no global Vue
//
export default Vue
export * from 'vue'
export * from 'vue/types/options'

export function functionalComponent<Props>(options: Omit<FunctionalComponentOptions<Props,RecordPropsDefinition<Props>>,"functional">&{methods?:Dict<Function>}){
    return Vue.extend<Props>({
        ...options,
        functional:true
    });
}
