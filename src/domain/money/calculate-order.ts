import Decimal from "decimal.js";
import type { OrderCalculation, OrderCalculationInput } from "./money.types";

function sum(values: bigint[]) {
  return values.reduce((total, value) => total + value, 0n);
}

export function calculateOrder(input: OrderCalculationInput): OrderCalculation {
  const quantity = new Decimal(input.quantity);
  if (quantity.lte(0) || input.unitPricePaise <= 0n) throw new Error("Quantity and unit price must be positive");

  const produceValuePaise = BigInt(quantity.mul(input.unitPricePaise.toString()).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toFixed(0));
  const fpoSharePaise = (produceValuePaise * 4n) / 100n;
  const agriBridgeSharePaise = produceValuePaise / 100n;
  const farmerPoolPaise = produceValuePaise - fpoSharePaise - agriBridgeSharePaise;
  const charges = input.charges ?? [];
  const buyerChargesPaise = sum(charges.filter((charge) => charge.bearer === "buyer").map((charge) => charge.amountPaise));
  const sellerChargesPaise = sum(charges.filter((charge) => charge.bearer === "seller").map((charge) => charge.amountPaise));
  const netFarmerPayoutPaise = farmerPoolPaise - sellerChargesPaise;
  if (netFarmerPayoutPaise < 0n) throw new Error("Seller charges cannot exceed the farmer payout pool");
  const firstReleasePaise = netFarmerPayoutPaise / 2n;

  return {
    produceValuePaise,
    fpoSharePaise,
    agriBridgeSharePaise,
    farmerPoolPaise,
    buyerChargesPaise,
    sellerChargesPaise,
    buyerPayablePaise: produceValuePaise + buyerChargesPaise,
    netFarmerPayoutPaise,
    firstReleasePaise,
    secondReleasePaise: netFarmerPayoutPaise - firstReleasePaise,
  };
}
