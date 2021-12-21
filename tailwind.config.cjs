module.exports = {
  purge: [ ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        darkgray: '#27272a',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge:{
    enabled:false,
    content:
    [
      './src/**/*.html',
      './src/**/*.svelte'
    ],  
  }
}
