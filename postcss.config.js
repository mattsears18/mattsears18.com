module.exports = {
  plugins: {
    // Tailwind v4 ships its PostCSS integration as a dedicated plugin and
    // handles vendor prefixing internally via Lightning CSS — no autoprefixer.
    '@tailwindcss/postcss': {},
  },
};
