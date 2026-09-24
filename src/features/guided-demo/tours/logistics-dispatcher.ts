import type { TourDefinition } from "../types";
export const logisticsDispatcherTour: TourDefinition = {key:"logistics-dispatcher",title:"Dispatch field guide",steps:[
  {key:"dispatch",title:"Review ready loads",body:"Use the real dispatch workspace to review pickup, delivery and available capacity.",route:(l,s)=>`/${l}/logistics/${s??"gati-demo-logistics"}/dispatch`,anchor:"dispatch-dashboard",permission:"shipments.dispatch",icon:"truck"},
  {key:"quotes",title:"Compare vehicle quotes",body:"Compare capacity, refrigeration, arrival and freight before assigning the trip.",route:(l)=>`/${l}/fpo/logistics`,anchor:"logistics-quotes",permission:"shipments.dispatch",icon:"truck"},
  {key:"route",title:"Watch the route",body:"The map uses a clearly labelled simulated vehicle position.",route:(l)=>`/${l}/shipments/shipment-1072`,anchor:"tracking-map",permission:"shipments.read",icon:"field"},
]};
