<p align="center"><img src="https://user-images.githubusercontent.com/8326331/133301616-504b30a2-a015-4de8-b611-60539f133cfc.png" height="200px" /></p>

![Uptime Robot status](https://img.shields.io/uptimerobot/status/m789510441-3925163e68cf6a3e0c57dc6c?label=website%20status) ![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m789510441-3925163e68cf6a3e0c57dc6c?label=website%20uptime%20ratio) ![Uptime Robot status](https://img.shields.io/uptimerobot/status/m789510547-1aca51572498527e9d4b9966?label=API%20status) ![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m789510547-1aca51572498527e9d4b9966?label=API%20uptime%20ratio)

## Development

### Overview

This is a Vue project that has been initialized with [`vue-cli`](https://cli.vuejs.org/) with the following options:

- Yarn
- Vue 3
- Typescript
- Eslint and Prettier
- Vuex (for global state management)
- Vue router
- Jest (unit testing, via [`vue-test-utils`](https://next.vue-test-utils.vuejs.org/guide/))
- Cypress (e2e testing, via [`vue-test-utils`](https://next.vue-test-utils.vuejs.org/guide/))
- Sass (with dart-sass)

Additional notable features installed:

- [Axe](https://www.deque.com/axe/) (via [`jest-axe`](https://github.com/nickcolley/jest-axe)) for accessibility testing

### Figma sketch

https://www.figma.com/file/VxRrD9Tfjpg0CWMVS5qLKr/Monarch-UI-redesign?node-id=9%3A6

### Setup

Install [Node](https://nodejs.org/) (> 14) and [Yarn](https://yarnpkg.com/) if you haven't already.
Clone the repo and run `yarn install` to install dependencies.

### Commands

- `yarn serve` - Start development server with auto-refresh and hot-reloading
- `yarn build` - Build a production version of the app
- `yarn test:lint` - Run lint check
- `yarn test:unit` - Run unit tests
- `yarn test:e2e` - Run end-to-end tests
- `yarn test:axe` - Run accessibility tests
- `yarn test` - Run all tests (except for e2e gui)
- `yarn lint` - Lint and fix files
- `yarn test:gui` - Run end-to-end tests in visible browser to watch them run
- `yarn fresh` - Clear cache and `node_modules` and reinstall dependencies

### Continuous Integration

On pull requests, the app is automatically tested and will not allow merging without all tests passing and at least one peer review.
Netlify is used to build and host live deploy previews of the changes in a PR for convenient in-situ testing.

When merging into main, the app is automatically built and deployed to GitHub Pages.
Note: To simplify app/router/etc configuration, the app only works when served from root.
Hosting at a default GitHub Pages url like monarch-initiative.github.io/monarch-ui is not possible without changes.

### Directory structure

- `/.github` - GitHub Actions continuous integration workflows for testing and deploying the app.
- `/dist` - Where the built app is outputted to after running `yarn build`.
- `/figma` - Backup/local copy of Figma sketch for app.
- `/public` - Folder whose contents get copied over verbatim to build folder.
  Use as little as possible.
- `/src` - Main source code that gets compiled, along with installed packages in `/node_modules`, into the final product.
  - `/api` - Code that interfaces directly with any external services or data sources.
    As much as possible, data transformation should take place here, putting it into the desired format, leaving `.vue` files as mostly presentational (and some local UI state).
    Data transformation should take place here as much as possible, keeping `.vue` files as presentational as possible.
  - `/assets` - Static resources like images.
  - `/components` - Reusable building blocks of UI.
  - `/directives` - See [Vue directives](https://v3.vuejs.org/guide/custom-directive.html#custom-directives).
  - `/global` - Components, directives, styles, and other "global" resources that always -- whether running the app normally or setting up and mounting a test -- need to be included in the Vue application instance.
  - `/router` - See [Vue router](https://router.vuejs.org/).
  - `/store` - See [Vuex](https://vuex.vuejs.org/) (similar to Redux).
    Most useful for managing global and complex state.
  - `/types` - Folder for any Typescript Types that need to be shared across files.
    Any types needed only in a single file should just go in that file.
  - `/util` - Miscellaneous utility functions to do generic tasks.
  - `/views` - Organizes the site into pages.
    Directory structure and file names should correlate to urls.
- `/tests` - Suite of tests to verify functionality and ensure quality.
- `package.json` - What third party packages are necessary for this app to run, and which versions.
  Also where the `yarn ___` shorthand commands are defined.
  `yarn.lock` - Detailed list of all dependencies and sub-dependencies, and their versions, providing a last known good configuration.
- `.eslintrs.js`, `babel.config.js`, etc. - Separate configuration files for the various tools involved in the development pipeline.
- `.env` - Environment variable file.
  A convenient place to set static, global pieces of information that need to be repeated throughout the app, such as metadata about the app.

### Guidelines

Wherever possible, use custom components like `AppHeading` and `AppLink` instead of native elements like `h1` and `a`.

See `variables.scss` for a palette of acceptable colors/fonts/etc to use.

Keep configuration files as minimal as possible and conform to presets.
For example, avoid overriding default eslint rules as much as possible.
