<p align="center"><img src="https://user-images.githubusercontent.com/8326331/133301616-504b30a2-a015-4de8-b611-60539f133cfc.png" height="200px" /></p>

## Development

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

### CSS

See `variables.scss` for a palette of acceptable colors/fonts/etc to use.

### Notes

To simplify app/router/etc configuration, the app only works when served from root.
Hosting on e.g. GitHub Pages like monarch-initiative.github.io/monarch-ui is not possible without changes.
