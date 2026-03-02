const PRODUCTION_URL = "https://dca-system-iota.vercel.app";

const rawRootUrl =
  process.env.NEXT_PUBLIC_URL ||
  PRODUCTION_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

const ROOT_URL = rawRootUrl.replace(/\/$/, "");

const DEFAULT_ACCOUNT_ASSOCIATION = {
  header:
    "eyJmaWQiOjQxMzk1MCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDYxMzYwZEFDMkU3NTljNjA4ZDhBMDJmRTVjYjcwNmYxOTBDYTRkZDYifQ",
  payload: "eyJkb21haW4iOiJkY2Etc3lzdGVtLWlvdGEudmVyY2VsLmFwcCJ9",
  signature:
    "oRfKnATBkntfqRBP/9D2BBh5T7aC5bfrG51+Mb+ztJN+/CZ8Ey8dzoTnOymaEowB/6w4z4Qri/NUDcjzeFP0exw=",
} as const;

const DEFAULT_OWNER_ADDRESS = "0x31270214B9CeA11f1a07E3A55B4f6643A64F94ff";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      process.env.FARCASTER_HEADER ?? DEFAULT_ACCOUNT_ASSOCIATION.header,
    payload:
      process.env.FARCASTER_PAYLOAD ?? DEFAULT_ACCOUNT_ASSOCIATION.payload,
    signature:
      process.env.FARCASTER_SIGNATURE ?? DEFAULT_ACCOUNT_ASSOCIATION.signature,
  },
  baseBuilder: {
    ownerAddress:
      process.env.BASE_BUILDER_OWNER_ADDRESS ?? DEFAULT_OWNER_ADDRESS,
  },
  miniapp: {
    version: "1",
    name: "BaseDca",
    subtitle: "Bitcoin DCA planner",
    description:
      "Create and save Bitcoin DCA plans without wallet connection.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0f172a",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["bitcoin", "dca", "planner"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Bitcoin DCA planner",
    ogTitle: "BaseDca",
    ogDescription: "Create and track Bitcoin DCA plans without wallet access.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
