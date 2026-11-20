import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  basePath: isGitHubPages ? "/division2-expertise-calculator" : undefined,
  output: isGitHubPages ? "export" : undefined,
  trailingSlash: isGitHubPages,
};

export default nextConfig;
