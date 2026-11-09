import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "motion"],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "exceljs", "@react-pdf/renderer"],
};

export default nextConfig;
