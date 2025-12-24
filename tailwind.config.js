/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'veriscan-dark': '#0f172a',
                'veriscan-light': '#f8fafc', // Slate-50
                'veriscan-purple': '#7c3aed',
                'veriscan-teal': '#0d9488', // Darker teal for light mode contrast
                'glass-panel': 'rgba(255, 255, 255, 0.7)', // More opaque for light mode
                'glass-panel-dark': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
