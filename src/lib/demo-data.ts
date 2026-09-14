export const fpo = {
  name: "Awadh Pragati Farmer Producer Company",
  shortName: "Awadh Pragati FPC",
  location: "Gonda, Uttar Pradesh",
  trustScore: 92,
  members: 1248,
  verifiedSince: "2022",
};

export const dashboardMetrics = [
  { label: "Registered farmers", value: "1,248", note: "+34 this month", tone: "green" },
  { label: "Harvests due", value: "86", note: "Next 14 days", tone: "gold" },
  { label: "Active stock", value: "418 t", note: "18 published lots", tone: "green" },
  { label: "Pending orders", value: "7", note: "₹31.6 lakh value", tone: "gold" },
  { label: "Trucks in transit", value: "3", note: "All on schedule", tone: "blue" },
  { label: "Protected amount", value: "₹24.8L", note: "Mock settlement account", tone: "green" },
  { label: "FPO earnings", value: "₹1.32L", note: "September", tone: "earth" },
];

export type Lot = {
  id: string; name: string; variety: string; location: string; pricePaise: number; quantityKg: number; grade: "A" | "B"; harvest: string;
  image: string; colour: string; certifications: string[]; moisture: number; confidence: number; fpo: string;
};

export const lots: Lot[] = [
  { id: "lot-potato-gonda", name: "Grade A potato", variety: "Kufri Bahar", location: "Gonda, UP", pricePaise: 1850, quantityKg: 42000, grade: "A", harvest: "12 Sep 2026", image: "POTATO", colour: "#D9B36C", certifications: ["Lab verified"], moisture: 78.2, confidence: 94, fpo: fpo.shortName },
  { id: "lot-onion-nashik", name: "Red onion", variety: "Nashik Red", location: "Nashik, Maharashtra", pricePaise: 2600, quantityKg: 38000, grade: "A", harvest: "10 Sep 2026", image: "ONION", colour: "#A75458", certifications: ["Residue tested"], moisture: 86.1, confidence: 91, fpo: "Sahyadri Growers Collective" },
  { id: "lot-tomato-varanasi", name: "Tomato", variety: "Abhinav", location: "Varanasi, UP", pricePaise: 2200, quantityKg: 18000, grade: "B", harvest: "14 Sep 2026", image: "TOMATO", colour: "#D94C38", certifications: ["FPO declared"], moisture: 93.4, confidence: 87, fpo: "Kashi Kisan Utpadak Sangh" },
  { id: "lot-paddy-kanpur", name: "Basmati paddy", variety: "Pusa 1509", location: "Kanpur, UP", pricePaise: 3850, quantityKg: 75000, grade: "A", harvest: "28 Sep 2026", image: "PADDY", colour: "#C89A3D", certifications: ["AGMARK", "Lab verified"], moisture: 12.4, confidence: 96, fpo: "Ganga Plains FPC" },
  { id: "lot-peas-lucknow", name: "Green peas", variety: "Arkel", location: "Lucknow, UP", pricePaise: 4400, quantityKg: 12000, grade: "A", harvest: "02 Oct 2026", image: "PEAS", colour: "#5E9E54", certifications: ["Residue tested"], moisture: 74.7, confidence: 90, fpo: "Lucknow Hariyali FPO" },
  { id: "lot-mango-malihabad", name: "Malihabadi mango", variety: "Dasheri", location: "Malihabad, UP", pricePaise: 6200, quantityKg: 25000, grade: "A", harvest: "Season 2027", image: "MANGO", colour: "#E3AE35", certifications: ["GI region", "GlobalG.A.P. ready"], moisture: 81.8, confidence: 93, fpo: "Malihabad Aam Utpadak FPC" },
];

export const farmers = [
  { id: "farmer-ram", name: "Ram Kishan Verma", village: "Mankapur", land: "3.2 acres", crops: "Potato, paddy", payout: "₹84,250", verified: true },
  { id: "farmer-sunita", name: "Sunita Devi", village: "Colonelganj", land: "2.1 acres", crops: "Tomato, peas", payout: "₹61,800", verified: true },
  { id: "farmer-irfan", name: "Mohd. Irfan", village: "Tarabganj", land: "4.6 acres", crops: "Basmati paddy", payout: "₹1,12,400", verified: true },
  { id: "farmer-geeta", name: "Geeta Maurya", village: "Katra Bazar", land: "1.8 acres", crops: "Potato", payout: "₹47,900", verified: false },
  { id: "farmer-rajendra", name: "Rajendra Prasad", village: "Rupaidih", land: "5.0 acres", crops: "Paddy, mustard", payout: "₹1,34,700", verified: true },
];

export const logisticsQuotes = [
  { id: "ace", vehicle: "Tata Ace", capacity: "750 kg", freightPaise: 420000, pickup: "Today, 4–6 PM", delivery: "Tomorrow, 9 AM", refrigerated: false, insurance: true, rating: 4.7, available: 3 },
  { id: "bolero", vehicle: "Mahindra Bolero PikUp", capacity: "1.7 t", freightPaise: 680000, pickup: "Today, 6–8 PM", delivery: "Tomorrow, 11 AM", refrigerated: false, insurance: true, rating: 4.8, available: 2 },
  { id: "eicher", vehicle: "Eicher medium truck", capacity: "7.5 t", freightPaise: 1820000, pickup: "Tomorrow, 6 AM", delivery: "Tomorrow, 8 PM", refrigerated: false, insurance: true, rating: 4.6, available: 4 },
  { id: "14ft", vehicle: "14-foot truck", capacity: "4.5 t", freightPaise: 1240000, pickup: "Today, 9 PM", delivery: "Tomorrow, 3 PM", refrigerated: false, insurance: true, rating: 4.5, available: 2 },
  { id: "reefer", vehicle: "Refrigerated truck", capacity: "6 t", freightPaise: 2480000, pickup: "Tomorrow, 5 AM", delivery: "Tomorrow, 7 PM", refrigerated: true, insurance: true, rating: 4.9, available: 1 },
  { id: "cold", vehicle: "Cold-storage vehicle", capacity: "3.5 t", freightPaise: 1960000, pickup: "Tomorrow, 7 AM", delivery: "Tomorrow, 5 PM", refrigerated: true, insurance: true, rating: 4.7, available: 2 },
];

export const order = { id: "AB-260914-1072", buyer: "Lucknow Fresh Mart", lot: lots[0], quantityKg: 10000, status: "IN_TRANSIT", produceValuePaise: 20000000 };

export const forecastRows = [
  { crop: "Potato", district: "Gonda", demand: "High", range: "₹19–₹23/kg", confidence: 82, pressure: "Balanced", window: "20–24 Sep", buyer: "Institutional kitchens" },
  { crop: "Basmati paddy", district: "Kanpur", demand: "Rising", range: "₹38–₹43/kg", confidence: 76, pressure: "Low supply", window: "28 Sep–04 Oct", buyer: "Exporters" },
  { crop: "Tomato", district: "Varanasi", demand: "Moderate", range: "₹20–₹27/kg", confidence: 68, pressure: "High arrivals", window: "Within 3 days", buyer: "Hotels & processors" },
];
