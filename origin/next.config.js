const { NodeModuleFederation } = require('@telenko/node-mf')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const path = require('path')

require('dotenv').config({
  path: '.env',
})

const { dependencies } = require('./package.json')

module.exports = {
  webpack5: true,
  webpackDevMiddleware: (config) => ({ ...config }),
  webpack: (config, { isServer }) => ({
    ...config,
    plugins: [
      ...config.plugins,
      new (isServer ? NodeModuleFederation : ModuleFederationPlugin)({
        remotes: {
          remoteLib: isServer
            ? `remoteLib@${process.env.LIB_URL}:${process.env.LIB_PORT}/node/remoteEntry.js`
            : {
                external: `
              external new Promise((resolve, _) => {
                window['remoteLib'].init({
                  react: {
                    '${dependencies.react}': {
                      get: () => Promise.resolve().then(() => globalThis.React),
                    },
                  },
                });
                resolve({
                  get: (request) => window['remoteLib'].get(request),
                  init: (args) => {},
                });
              });
            `,
              },
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: dependencies.react,
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: dependencies['react-dom'],
            eager: true,
          },
        },
      }),
    ],
    experiments: {
      topLevelAwait: true,
    },
  }),
}
