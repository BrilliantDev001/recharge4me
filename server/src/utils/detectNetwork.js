// Nigerian mobile network prefixes. Based on NCC allocations, cross-
// referenced across current provider documentation. Since Mobile
// Number Portability (MNP) has existed in Nigeria since 2013, a
// prefix is a strong DEFAULT, not a guarantee — a ported number
// keeps its original prefix but may belong to a different network
// today. This is why the detected value is stored as an editable
// default on the user's profile, not an unchangeable fact.
const NETWORK_PREFIXES = {
  MTN: [
    "0803",
    "0806",
    "0703",
    "0706",
    "0813",
    "0814",
    "0816",
    "0810",
    "0903",
    "0906",
    "0913",
    "0916",
    "0704",
  ],
  Airtel: [
    "0802",
    "0808",
    "0708",
    "0812",
    "0701",
    "0902",
    "0901",
    "0904",
    "0907",
    "0912",
  ],
  Glo: ["0805", "0807", "0705", "0811", "0815", "0905", "0915"],
  "9mobile": ["0809", "0817", "0818", "0908", "0909"],
};

function detectNetworkFromPhone(phone) {
  if (!phone) return null;

  // Normalize +234 international format to local 0-prefixed format
  const normalized = phone.startsWith("+234") ? `0${phone.slice(4)}` : phone;
  const prefix = normalized.slice(0, 4);

  for (const [network, prefixes] of Object.entries(NETWORK_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }

  return null; // unrecognized prefix — user can set it manually in Settings
}

module.exports = { detectNetworkFromPhone };
