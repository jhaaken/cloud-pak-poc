# Case2App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  See more details below

## how to run locally

- run locally using `npm install` then `npm start`

## configure github repo for gh-pages

the repo you plan to host this react-app in needs to be configured for `gh-pages` so it knows how to 

- goto repo's `settings`, then `pages`
- from there you can configure which branch you want to use for gh-pages 

## how to deploy

- push a deployment using `npm run deploy` which will do a build then push to gh-pages branch
- the `homepage` property in the `package.json` is key for the built code to work properly on your target repo.  Should match what you are using in your target repo
- once the `npm run deploy` is done, on github.com you can goto the repo's `actions` to watch for a github action that finishes the build using jekyll.
- right now there are `case2app.json` files in `/public/repo/case/<case-name>` which would simulate the type of file we could build either as a yaml or json then need to save that in the repo or somewhere public for the app to read it
  - there is a nodejs script that will create/update this data that can be run locally for POC

## references

- carbon design
  - https://carbondesignsystem.com/developing/react-tutorial/overview - gives an overview on how to create a new react-app with carbon-design
  - https://github.com/carbon-design-system/carbon
    - https://react.carbondesignsystem.com/ - carbon react components story book
  - https://github.com/carbon-design-system/ibm-products
    - https://ibm-products.carbondesignsystem.com - ibm-products carbon components story book
  - https://carbondesignsystem.com/guidelines/icons/library/ - carbon icon library
- github-pages
  - https://www.npmjs.com/package/gh-pages - gh-pages package for build & deploy
  - https://create-react-app.dev/docs/deployment/#github-pages 
  - https://pages.github.com/

## Getting Started with Create React App

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

#### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

#### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
