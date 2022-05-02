module.exports = {
    content: [
        'src/pages/**/*.{js,ts,jsx,tsx}',
        'src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                dkaresz: '#005eff',
                karesz: '#227fff', // blue
                back: '#0F1419', // back
                lback: '#232933', // light back
                main: '#333C4A', // main
                vsc: '#2f2f2f', // vscode gray
            },
        },
    },
    plugins: [],
};
