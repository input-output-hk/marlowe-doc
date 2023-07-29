// @ts-check

const apiVersions = require('./api/latest/versions.json')
const {
  versionSelector,
  versionCrumb,
} = require('docusaurus-plugin-openapi-docs/lib/sidebars/utils');

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  'api-0.0.2': [
    {
      type: 'html',
      defaultStyle: true,
      value: versionSelector(apiVersions),
      className: 'version-button',
    },
    {
      type: "html",
      defaultStyle: true,
      value: versionCrumb(`v0.0.2`),
    },
    {
      type: "category",
      label: "Marlowe Runtime",
      link: {
        type: "generated-index",
        title: "Runtime API",
        description:
          "REST endpoints for Marlowe",
        slug: "/api/0.0.2",
      },
      items: require('./api/0.0.2/sidebar.js'),
    },
  ],
  'api-0.0.3': [
    {
      type: 'html',
      defaultStyle: true,
      value: versionSelector(apiVersions),
      className: 'version-button',
    },
    {
      type: "html",
      defaultStyle: true,
      value: versionCrumb(`v0.0.3`),
    },
    {
      type: "category",
      label: "Marlowe Runtime",
      link: {
        type: "generated-index",
        title: "Runtime API",
        description:
          "Marlowe Runtime REST API",
        slug: "/api/latest",
      },
      items: require('./api/latest/sidebar.js'),
    },
  ],
};
  
module.exports = sidebars;
  