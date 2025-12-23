/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff4d00",
                "primary-hover": "#e64500",
                "bg-dark": "#0a0a0a",
                "bg-card": "#141414",
                "bg-sidebar": "#0f0f0f",
            },
        },
    },
    plugins: [],
}
