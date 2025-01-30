const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 300,
  viewportWidth: 500,
  defaultBrowser: 'electron',
  e2e: {
    setupNodeEvents(on, config) {},
    supportFile: false,
    baseUrl: 'https://todomvc-vercel-gleb-bahmutov.vercel.app/',
  },
})
