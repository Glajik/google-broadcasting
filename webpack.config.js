const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/broadcasting.js',
  },
  output: {
    library: 'Broadcasting',
    libraryTarget: 'umd',
    globalObject: 'this',
    // umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: [['@babel/preset-env', { modules: false }]],
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
  ],
  optimization: {
    minimize: false,
  },
};
