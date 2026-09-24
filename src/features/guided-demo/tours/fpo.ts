import type { TourDefinition } from "../types";
export const fpoTour: TourDefinition = {key:"fpo",title:"FPO field guide",steps:[
  {key:"dashboard",title:"Your FPO dashboard",body:"See farmers, active stock, orders and protected settlement amounts in one place.",route:(l)=>`/${l}/fpo/overview`,anchor:"dashboard-metrics",icon:"field"},
  {key:"farmers",title:"Register a farmer",body:"Use assisted registration for consent, masked references, land and crop details.",route:(l)=>`/${l}/fpo/farmers`,anchor:"add-farmer-button",permission:"farmers.write",icon:"people"},
  {key:"calendar",title:"Plan the crop calendar",body:"Sowing and harvest windows help your team plan supply before demand arrives.",route:(l)=>`/${l}/fpo/crop-calendar`,anchor:"crop-calendar",permission:"farmers.read",icon:"chart"},
  {key:"stock",title:"List a stock lot",body:"Bring contributing farmers, quantity, collection centre and grade into one traceable lot.",route:(l)=>`/${l}/fpo/stock/new`,anchor:"stock-listing-wizard",permission:"lots.write",icon:"box"},
  {key:"quality",title:"Add quality proof",body:"Original media stays private. Processed listing images and safe traceability are buyer-facing.",route:(l)=>`/${l}/fpo/stock/new`,anchor:"quality-upload",permission:"files.upload",icon:"shield"},
  {key:"orders",title:"Follow the settlement",body:"The demo order shows the 50% loading release, 50% delivery release, fees and logistics.",route:(l)=>`/${l}/fpo/orders`,anchor:"settlement-breakdown",permission:"orders.read",icon:"wallet"},
  {key:"forecast",title:"Use demand estimates",body:"Compare 15-day and 30-day estimates before deciding when and where to sell.",route:(l)=>`/${l}/fpo/forecast`,anchor:"forecast-panel",icon:"chart"},
]};
