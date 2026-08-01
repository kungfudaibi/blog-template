import type { NextConfig } from "next";

import { createSecurityHeaderRules } from "./lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Content is read by server routes at runtime; include it explicitly instead of
  // letting dynamic fixture paths make the tracer scan the entire repository.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
  async headers() {
    return createSecurityHeaderRules(process.env.NODE_ENV === "development");
  },
};

export default nextConfig;
