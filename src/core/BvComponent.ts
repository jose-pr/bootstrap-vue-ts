import { Primitive, Dict } from '../utils';

export type BvComponentConfig = Dict<Primitive|Dict<Primitive|null|undefined>|Array<Primitive>|null|undefined>

export interface BvComponent{
    
}