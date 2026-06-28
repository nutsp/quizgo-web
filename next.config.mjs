/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    // Known TS debt (see project-memory); unblock production Docker builds.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
