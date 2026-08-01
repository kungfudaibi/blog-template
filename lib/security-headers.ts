export type SecurityHeader = Readonly<{ key: string; value: string }>;

export type SecurityHeaderRule = Readonly<{
  source: string;
  headers: SecurityHeader[];
}>;

export function createSecurityHeaders(isDevelopment: boolean): SecurityHeader[] {
  const scriptSource = isDevelopment
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";
  const connectSource = isDevelopment
    ? "connect-src 'self' ws: http: https:"
    : "connect-src 'self'";
  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    scriptSource,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    connectSource,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: policy },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    ...(isDevelopment
      ? []
      : [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]),
  ];
}

export function createSecurityHeaderRules(isDevelopment: boolean): SecurityHeaderRule[] {
  return [
    {
      source: "/:path*",
      headers: createSecurityHeaders(isDevelopment),
    },
  ];
}
