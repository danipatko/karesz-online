/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    typescript: { tsconfigPath: './tsconfig.next.json' },
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 5000,
            aggregateTimeout: 300,
        };
        return config;
    },
};

module.exports = nextConfig;
