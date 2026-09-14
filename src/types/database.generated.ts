export type Json=string|number|boolean|null|{[key:string]:Json|undefined}|Json[];
export type Database={public:{Tables:{[key:string]:{Row:Record<string,unknown>;Insert:Record<string,unknown>;Update:Record<string,unknown>;Relationships:[]}};Views:{[key:string]:never};Functions:{[key:string]:never};Enums:{[key:string]:string};CompositeTypes:{[key:string]:never}}};
