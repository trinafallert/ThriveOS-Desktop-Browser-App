// ThriveOS: minimal env — no external API URL or analytics keys required
export const env = {
  VITE_BROWSEROS_SERVER_PORT: 3747 as number | undefined,
  PROD: (import.meta.env?.PROD ?? true) as boolean,
}
