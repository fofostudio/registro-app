// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: "rgb(229 231 235)",
                input: "rgb(229 231 235)",
                ring: "rgb(59 130 246)",
                background: "white",
                foreground: "rgb(17 24 39)",
                primary: {
                    DEFAULT: "rgb(59 130 246)",
                    foreground: "white",
                },
                destructive: {
                    DEFAULT: "rgb(239 68 68)",
                    foreground: "white",
                },
                muted: {
                    DEFAULT: "rgb(243 244 246)",
                    foreground: "rgb(107 114 128)",
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
