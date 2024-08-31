const createExpoWebpackConfigAsync = require("@expo/webpack-config")

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  // Customize the config before returning it.
  // config.resolve.alias["../Utilities/Platform"] = "react-native-web/dist/exports/Platform"
  config.resolve.alias["react-native$"] = "react-native-web"
  // // config.resolve.extensions = [".tsx", ".ts", ".js", ".ios.js", ".android.js", ".web.js"]

  return config
}
