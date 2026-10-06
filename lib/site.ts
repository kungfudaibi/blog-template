const LOCAL_SITE_URL = "http://localhost:3000";
const PUBLIC_SITE_URL = "https://www.zhujiechong.org";

export function getSiteUrl() {
  const fallbackUrl = process.env.NODE_ENV === "production"
    ? PUBLIC_SITE_URL
    : LOCAL_SITE_URL;
  const configuredUrl = process.env.SITE_URL?.trim() || fallbackUrl;
  const url = new URL(configuredUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use http or https");
  }

  if (
    process.env.NODE_ENV === "production" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  ) {
    return new URL(PUBLIC_SITE_URL);
  }

  return url;
}

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString();
}
