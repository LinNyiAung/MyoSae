/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive:'#dbe8c9',
        olive2:'#c4d9a6',
        olive3: '#acca82',
        olive4: '#94ba5e',
        olive5: '#7ba145',
        olive6: '#607d35',
        olive7: '#445926',
        olive8: '#293617',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}