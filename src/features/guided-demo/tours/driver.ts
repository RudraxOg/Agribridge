import type { TourDefinition } from "../types";
export const driverTour: TourDefinition = {key:"driver",title:"Driver trip guide",steps:[
  {key:"trips",title:"Open your assigned trip",body:"Drivers only see trips assigned to them and can submit permitted updates.",route:(l,s)=>`/${l}/logistics/${s??"gati-demo-logistics"}/my-trips`,anchor:"assigned-trip",permission:"shipments.read",icon:"truck"},
  {key:"proof",title:"Submit delivery proof",body:"Upload the delivery proof for your assigned shipment. It remains private to order participants.",route:(l)=>`/${l}/shipments/shipment-1072`,anchor:"delivery-proof",permission:"files.upload",icon:"shield"},
]};
