module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "@babel/plugin-transform-private-methods",
      { loose: true }
    ],
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: process.env.ENVFILE || ".env",
        blacklist: null,
        whitelist: null,
        safe: true,
        allowUndefined: true
      }
    ]
  ]
};
