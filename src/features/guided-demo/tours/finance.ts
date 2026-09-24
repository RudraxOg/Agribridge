import type { TourDefinition } from "../types";
export const financeTour: TourDefinition = {key:"finance",title:"Finance reconciliation guide",steps:[
  {key:"payments",title:"Review the amount",body:"See the produce subtotal, FPO 4%, AgriBridge 1%, logistics and adjustments in paise-backed totals.",route:(l,s)=>`/${l}/fpo/${s??"awadh-pragati-fpc"}/settlements`,anchor:"escrow-breakdown",permission:"settlements.read",icon:"wallet"},
  {key:"settlement",title:"Follow releases",body:"Loading releases the first 50%; delivery confirmation releases the remaining 50%.",route:(l)=>`/${l}/settlements/order-1072`,anchor:"settlement-breakdown",permission:"settlements.read",icon:"shield"},
]};
