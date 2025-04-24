const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '23bcgd', // Cypress Cloud
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalOriginDependencies: true
  },
  video: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  "watchForFileChanges": false,
});
