import typography from '@tailwindcss/typography'
import contentVisibility from 'tailwindcss-content-visibility'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      height: {
        'screen-fill': '-webkit-fill-available'
      }
    }
  },
  plugins: [
    typography,
    contentVisibility,
    daisyui
  ],
  daisyui: {
    styled: true,
    themes: ['light'],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: ''
  }
}
