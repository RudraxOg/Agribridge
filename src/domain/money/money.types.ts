export type ChargeBearer = "buyer" | "seller";

export type OrderCharge = {
  code: "freight" | "insurance" | "packaging" | "assaying" | "tax" | "provider" | "other";
  label: string;
  amountPaise: bigint;
  bearer: ChargeBearer;
};

export type OrderCalculationInput = {
  quantity: string | number;
  unitPricePaise: bigint;
  charges?: OrderCharge[];
};

export type OrderCalculation = {
  produceValuePaise: bigint;
  fpoSharePaise: bigint;
  agriBridgeSharePaise: bigint;
  farmerPoolPaise: bigint;
  buyerChargesPaise: bigint;
  sellerChargesPaise: bigint;
  buyerPayablePaise: bigint;
  netFarmerPayoutPaise: bigint;
  firstReleasePaise: bigint;
  secondReleasePaise: bigint;
};
