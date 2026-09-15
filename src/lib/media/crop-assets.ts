export type CropAsset = {
  key: "basmati" | "mango" | "onion" | "peas" | "potato" | "tomato";
  label: string;
  photoSrc: string;
  generatedFallbackSrc: string;
  sequenceKey?: "potato" | "tomato";
};

const cropAssets: Record<CropAsset["key"], CropAsset> = {
  basmati: {
    key: "basmati",
    label: "basmati paddy",
    photoSrc: "/stocks/basmati.jpg",
    generatedFallbackSrc: "/generated/processed/paddy-cover-card-640.webp",
  },
  mango: {
    key: "mango",
    label: "mango",
    photoSrc: "/stocks/mango.jpg",
    generatedFallbackSrc: "/generated/processed/mango-cover-card-640.webp",
  },
  onion: {
    key: "onion",
    label: "red onion",
    photoSrc: "/stocks/onion.jpg",
    generatedFallbackSrc: "/generated/processed/onion-cover-card-640.webp",
  },
  peas: {
    key: "peas",
    label: "green peas",
    photoSrc: "/stocks/peas.jpg",
    generatedFallbackSrc: "/generated/processed/peas-cover-card-640.webp",
  },
  potato: {
    key: "potato",
    label: "potato",
    photoSrc: "/stocks/potatoes.jpg",
    generatedFallbackSrc: "/generated/processed/potato-cover-card-640.webp",
    sequenceKey: "potato",
  },
  tomato: {
    key: "tomato",
    label: "tomato",
    photoSrc: "/stocks/tomato.jpg",
    generatedFallbackSrc: "/generated/processed/tomato-cover-card-640.webp",
    sequenceKey: "tomato",
  },
};

export function getCropAsset(value: string): CropAsset {
  const crop = value.toLowerCase();
  if (crop.includes("onion")) return cropAssets.onion;
  if (crop.includes("tomato")) return cropAssets.tomato;
  if (crop.includes("paddy") || crop.includes("rice") || crop.includes("basmati")) return cropAssets.basmati;
  if (crop.includes("pea")) return cropAssets.peas;
  if (crop.includes("mango")) return cropAssets.mango;
  return cropAssets.potato;
}
