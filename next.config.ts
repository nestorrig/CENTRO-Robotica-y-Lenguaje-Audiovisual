import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};
module.exports = {
  allowedDevOrigins: ["192.168.100.12"],
};

export default nextConfig;
