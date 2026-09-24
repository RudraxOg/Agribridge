import type { RoleKey } from "@/lib/authorization/permissions";
import type { TourDefinition } from "../types";
import { buyerTour } from "./buyer";
import { driverTour } from "./driver";
import { financeTour } from "./finance";
import { fpoTour } from "./fpo";
import { logisticsDispatcherTour } from "./logistics-dispatcher";
export function tourForRole(role:RoleKey):TourDefinition { if(role==="logistics_driver")return driverTour; if(role==="logistics_owner"||role==="logistics_dispatcher")return logisticsDispatcherTour; if(role==="buyer_finance"||role==="fpo_finance")return financeTour; if(role.startsWith("buyer_"))return buyerTour; return fpoTour; }
