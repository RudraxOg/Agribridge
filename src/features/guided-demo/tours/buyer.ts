import type { TourDefinition } from "../types";
export const buyerTour: TourDefinition = {key:"buyer",title:"Buyer procurement guide",steps:[
  {key:"marketplace",title:"Explore verified lots",body:"Filter real demo lots by crop, district, grade, quantity and harvest timing.",route:(l)=>`/${l}/buyer/marketplace`,anchor:"marketplace-filters",icon:"field"},
  {key:"inspection",title:"Inspect quality proof",body:"Open a lot to view gallery media, 360 frames, quality metrics and certificate access.",route:(l)=>`/${l}/buyer/products/lot-potato-gonda`,anchor:"product-quality-proof",permission:"lots.read",icon:"shield"},
  {key:"order",title:"Create a secure order",body:"Choose logistics, review landed cost, then use the labelled demo payment provider.",route:(l)=>`/${l}/buyer/orders`,anchor:"buyer-order-list",permission:"orders.create",icon:"wallet"},
  {key:"tracking",title:"Track the shipment",body:"Follow the simulated route and delivery milestones for the seeded order.",route:(l)=>`/${l}/shipments/shipment-1072`,anchor:"tracking-map",permission:"shipments.read",icon:"truck"},
]};
