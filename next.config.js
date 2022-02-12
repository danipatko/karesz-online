/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    typescript: { tsconfigPath: "./tsconfig.next.json" }
};

module.exports = nextConfig;
