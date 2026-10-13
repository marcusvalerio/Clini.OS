import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        clinic: {
          ink: "#202522",
          muted: "#747C75",
          line: "#E6EAE5",
          canvas: "#F7F8F5",
          green: "#507A63",
          "green-dark": "#315741",
          mint: "#E8F1E9",
          amber: "#F4E9D4"
        }
      },
      boxShadow: {
        soft: "0 12px 40px rgba(29, 45, 34, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
