const axios = require("axios");

const vtpassClient = axios.create({
  baseURL: process.env.VTPASS_BASE_URL,
  auth: {
    username: process.env.VTPASS_EMAIL,
    password: process.env.VTPASS_PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

const NETWORK_SERVICE_IDS = {
  MTN: "mtn",
  Airtel: "airtel",
  Glo: "glo",
  "9mobile": "etisalat",
};

// Data bundles use entirely different serviceIDs from airtime.
const DATA_SERVICE_IDS = {
  MTN: "mtn-data",
  Airtel: "airtel-data",
  Glo: "glo-data",
  "9mobile": "etisalat-data",
};

function generateRequestId() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const datePrefix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(
    now.getHours(),
  )}${pad(now.getMinutes())}`;
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${datePrefix}${randomSuffix}`;
}

/**
 * Purchases airtime for a phone number via VTpass.
 * NOTE: sandbox mode has specific test phone numbers/amounts that
 * simulate success vs. failure — check the "Testing" section of the
 * VTpass sandbox docs in your dashboard for the current values, since
 * these can change and I don't want to hand you stale specifics.
 */
async function purchaseAirtime({ network, phone, amountNaira }) {
  const serviceID = NETWORK_SERVICE_IDS[network];
  if (!serviceID) {
    throw new Error(`Unsupported network for VTpass airtime: ${network}`);
  }

  const requestId = generateRequestId();

  try {
    const response = await vtpassClient.post("/pay", {
      request_id: requestId,
      serviceID,
      amount: amountNaira,
      phone,
    });

    return { requestId, data: response.data };
  } catch (error) {
    // Surface VTpass's actual error body (e.g. "Invalid API Key",
    // "IP not whitelisted") instead of a bare "status code 401".
    const vtpassMessage =
      error.response?.data?.response_description ||
      error.response?.data?.message ||
      JSON.stringify(error.response?.data) ||
      error.message;
    throw new Error(
      `VTpass error (${error.response?.status || "unknown"}): ${vtpassMessage}`,
    );
  }
}

/**
 * Fetches the real, current list of data bundles VTpass sells for a
 * given network. Prices come straight from VTpass — never hardcoded,
 * since they can change.
 */
async function getDataVariations(network) {
  const serviceID = DATA_SERVICE_IDS[network];
  if (!serviceID) {
    throw new Error(`Unsupported network for VTpass data: ${network}`);
  }

  try {
    const response = await vtpassClient.get("/service-variations", {
      params: { serviceID },
    });

    // VTpass's own docs show this key inconsistently as "variations"
    // vs "varations" (their typo) depending on endpoint/response —
    // reading both defensively rather than trusting one spelling.
    const variations = response.data?.content?.variations || response.data?.content?.varations || [];

    return variations.map((v) => ({
      code: v.variation_code,
      label: v.name,
      price: Number(v.variation_amount),
    }));
  } catch (error) {
    const vtpassMessage = error.response?.data?.response_description || error.message;
    throw new Error(`Failed to fetch data bundles: ${vtpassMessage}`);
  }
}

/**
 * Purchases a specific data bundle. Price is determined entirely by
 * variationCode on VTpass's side — any "amount" sent is informational
 * only and ignored by VTpass, per their own documentation.
 */
async function purchaseData({ network, phone, variationCode }) {
  const serviceID = DATA_SERVICE_IDS[network];
  if (!serviceID) {
    throw new Error(`Unsupported network for VTpass data: ${network}`);
  }

  const requestId = generateRequestId();

  try {
    const response = await vtpassClient.post("/pay", {
      request_id: requestId,
      serviceID,
      billersCode: phone,
      variation_code: variationCode,
      phone,
    });

    return { requestId, data: response.data };
  } catch (error) {
    const vtpassMessage =
      error.response?.data?.response_description ||
      error.response?.data?.message ||
      JSON.stringify(error.response?.data) ||
      error.message;
    throw new Error(`VTpass error (${error.response?.status || "unknown"}): ${vtpassMessage}`);
  }
}

module.exports = { purchaseAirtime, getDataVariations, purchaseData };
