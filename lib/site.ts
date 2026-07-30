const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim() || LOCAL_SITE_URL;
  const url = new URL(configuredUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use http or https");
  }

  return url;
}

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString();
}
