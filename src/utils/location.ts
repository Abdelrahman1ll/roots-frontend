import egyptGovernorates from "../data/egyptGovernorates.json";

/**
 * Common variations and transliterations for Egyptian governorates
 */
const mappedVariations: Record<string, string> = {
  fayyum: "Fayoum",
  fayum: "Fayoum",
  qahirah: "Cairo",
  jizah: "Giza",
  jiza: "Giza",
  suhaj: "Sohag",
  qina: "Qena",
  uqsur: "Luxor",
  dumyat: "Damietta",
  suways: "Suez",
  "bur said": "Port Said",
  "isma'iliyah": "Ismailia",
  ismailiyah: "Ismailia",
  daqahliyah: "Dakahlia",
  sharqiyah: "Sharqia",
  buhayrah: "Beheira",
  gharbiyah: "Gharbia",
  minufiyah: "Monufia",
  qalyubiyah: "Qalyubia",
  "kafr ash shaykh": "Kafr El Sheikh",
  "bani suwayf": "Beni Suef",
  "shimal sina": "North Sinai",
  "janub sina": "South Sinai",
  "al wadi al jadid": "New Valley",
  "al bahr al ahmar": "Red Sea",
};

/**
 * Normalizes strings for governorate matching
 */
const normalize = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/^(muhaf[a-z]*at|al|el)\s+/gi, "") // Remove common prefixes
    .replace(/\s+/g, " ");
};

/**
 * Utility to detect the user's Egyptian governorate using IP-based detection
 * with a fallback to the browser's Geolocation API.
 */
export const detectUserGovernorate = async (): Promise<{
  state: string | null;
  area: string | null;
} | null> => {
  /**
   * Internal helper to normalize and match a name against Egypt governorates
   */
  const findMatch = (rawName: string): string | null => {
    const normalizedName = normalize(rawName);

    // 1. Exact match
    const match = egyptGovernorates.find(
      (gov) => normalize(gov) === normalizedName,
    );
    if (match) return match;

    // 2. Manual variations
    for (const [variation, canonical] of Object.entries(mappedVariations)) {
      if (normalizedName.includes(variation)) return canonical;
    }

    // 3. Fuzzy match
    return (
      egyptGovernorates.find(
        (gov) =>
          normalizedName.includes(normalize(gov)) ||
          normalize(gov).includes(normalizedName),
      ) || null
    );
  };

  // --- Step 1: IP-based Geolocation (No permission prompt) ---
  try {
    const ipResponse = await fetch("https://ipapi.co/json/");
    const ipData = await ipResponse.json();

    if (ipData && ipData.country_name === "Egypt") {
      const potentialNames = [ipData.region, ipData.city];
      for (const name of potentialNames) {
        if (!name) continue;
        const matched = findMatch(name);
        if (matched) {
          console.log(`[Location] Detected via IP: ${matched}`);
          return {
            state: matched,
            area: ipData.city !== matched ? ipData.city : null,
          };
        }
      }
    }
  } catch (error) {
    console.warn(
      "[Location] IP Geolocation failed, trying browser API...",
      error,
    );
  }

  // --- Step 2: Browser-based Geolocation (Requires permission prompt) ---
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await response.json();

          const potentialNames = new Set<string>();
          if (data.principalSubdivision)
            potentialNames.add(data.principalSubdivision);
          if (data.city) potentialNames.add(data.city);
          if (data.locality) potentialNames.add(data.locality);

          if (data.localityInfo?.administrative) {
            data.localityInfo.administrative.forEach(
              (adm: { name: string }) => {
                if (adm.name) potentialNames.add(adm.name);
              },
            );
          }

          let matchedGov: string | null = null;
          for (const rawName of potentialNames) {
            matchedGov = findMatch(rawName);
            if (matchedGov) break;
          }

          let suggestedArea: string | null = null;
          const locality = data.locality || data.city;
          if (
            locality &&
            (!matchedGov ||
              !normalize(locality).includes(normalize(matchedGov)))
          ) {
            suggestedArea = locality;
          }

          resolve({ state: matchedGov, area: suggestedArea });
        } catch (error) {
          console.error("[Location] Reverse geocoding failed:", error);
          resolve(null);
        }
      },
      () => {
        // Log errors but resolve null to let the user pick manually
        resolve(null);
      },
      { timeout: 5000 },
    );
  });
};
