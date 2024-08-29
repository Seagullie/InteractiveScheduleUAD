console.log("Running babel.config.js")

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo", "@babel/preset-typescript"],
    plugins: [
      // "react-native-reanimated/plugin",
      // "@babel/plugin-transform-export-namespace-from",
      ["module:react-native-dotenv"],
    ],
    // env: {
    //   production: {
    //     plugins: ["transform-remove-console"],
    //   },
    // },
  }
}
