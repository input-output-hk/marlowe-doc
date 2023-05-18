// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Marlowe',
  tagline: 'Peer to peer financial agreements',
  favicon: 'img/favicon.ico',
  url: 'https://marlowe-finance.io',
  baseUrl: '/',
  organizationName: 'Marlowe', // Usually your GitHub org/user name.
  projectName: 'Marlowe', // Usually your repo name.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'docusaurus-preset-openapi',
      ({
        api: {
          path: require.resolve('./openapi.latest.json'),
          routeBasePath: 'api',
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/input-output-hk/marlowe-doc/edit/main/docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        indexBlog: false,
      }),
    ],
  ],
  plugins: ['docusaurus-plugin-sass'],
  markdown: {
    mermaid: true,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Marlowe Logo',
          src: 'img/marlowe-logo-light.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'dropdown',
            label: 'Community',
            position: 'left',
            items: [
              {
                label: 'Github',
                href: 'https://github.com/input-output-hk/marlowe',
              },
              {
                label: 'Stack Exchange',
                href: 'https://cardano.stackexchange.com/',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/inputoutput',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/InputOutputHK',
              },
            ],
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
      },
    }
  ),
};

module.exports = config;

