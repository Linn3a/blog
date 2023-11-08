/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig
module.exports = {
    generateBuildId: async () => {
      return "build";
    },
    distDir: "out",
  };