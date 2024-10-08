const tailwindcss = require("tailwindcss");
// const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("autoprefixer"),
    tailwindcss("./tailwind.js"),
    // process.env.NODE_ENV === "production" &&
    //   purgecss({
    //     content: ["./src/**/*.js"],
    //     css: ["./src/**/*.css"],
    //   }),
  ],
};