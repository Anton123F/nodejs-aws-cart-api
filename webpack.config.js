const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  // const entryPoint = './src/main.ts';
  const entryPoint = './src/main.ts';
  const filename = path.basename(entryPoint, path.extname(entryPoint)) + '.js';

  return {
    ...options,
    entry: entryPoint,
    externals: [],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
      ],
    },
    output: {
      ...options.output,
      filename: filename,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};