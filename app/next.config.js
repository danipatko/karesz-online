/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    typescript: { tsconfigPath: './tsconfig.next.json' },
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 100,
            aggregateTimeout: 20,
        };
        return config;
    },
};

module.exports = nextConfig;
