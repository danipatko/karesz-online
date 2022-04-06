module.exports = {
    content: [
        'src/pages/**/*.{js,ts,jsx,tsx}',
        'src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                karesz: '#005eff',
                'karesz-light': '#227fff',
                back: '#0F1419',
                'back-vs': '#2f2f2f',
                main: '#333C4A',
                'main-highlight': '#555E6C',
                fore: '#323EDD',
                'fore-highlight': '#545FEE',
            },
        },
    },
    plugins: [],
};
