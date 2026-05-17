import { env } from "./env";

export const payosConfig = {
  clientId: env.PAYOS_CLIENT_ID,
  apiKey: env.PAYOS_API_KEY,
  checksumKey: env.PAYOS_CHECKSUM_KEY
};
