export const priceIdByType: Record<"50" | "100" | "300", { "prod": string; "dev": string }> = {
  50: { "dev": "price_1NmJhdEEDyBTUKxwRNIYh5rw", "prod": "price_1NsSN2EEDyBTUKxwSBUrqwLL" },
  100: { "dev": "price_1NmJhdEEDyBTUKxw2Sj4FYe1", "prod": "price_1NsSN2EEDyBTUKxwJGNbBqui" },
  300: { "dev": "price_1NsPwgEEDyBTUKxw4EoTWZq8", "prod": "price_1NsSN2EEDyBTUKxwPvUnEHia" }
};

export const getStripePriceId = (type: 50 | 100 | 300): string => {
  if (process.env.NODE_ENV === "development") return priceIdByType[type].dev;
  return priceIdByType[type].prod;
};

export const pricesByType = { 50: 4.99, 100: 9.99, 300: 14.99 };

export const getPriceIdCreditsCountKeyByValue = (value: string): string | undefined => {
  if (process.env.NODE_ENV === "development") {
    return Object.keys(priceIdByType).find((key) => priceIdByType[key as "50" | "100" | "300"].dev === value);
  }

  return Object.keys(priceIdByType).find((key) => priceIdByType[key as "50" | "100" | "300"].prod === value);
};