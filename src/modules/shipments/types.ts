export type TrackingEvent={type:"departed"|"checkpoint"|"delay"|"temperature"|"delivered";label:string;occurredAt:string;latitude?:number;longitude?:number;temperatureCelsius?:number};
