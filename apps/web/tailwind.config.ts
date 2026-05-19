import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // <- ESTA ES LA CLAVE
  ],
  theme: {
    extend: {
      colors: {
        // Acá agregamos la paleta de KinePro
        'kine-blue': '#005C9C',
        'kine-blue-light': '#99D5F2',
        'kine-blue-deep': '#002D4C',
        'pro-green': '#4AA54D',
        'pro-green-light': '#A1DFA0',
        'pro-green-deep': '#1B7C1E',
        'teal-accent': '#29B6B6',
        'light-bg': '#F1F1F1',
      },
    },
  },
  plugins: [],
};
export default config;