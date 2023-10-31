// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const OSANO_SRC = process.env.OSANO_SRC;
const scripts = [];
if (OSANO_SRC) {
  scripts.push({
    src: OSANO_SRC,
    async: false
  })
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Marlowe',
  tagline: 'Peer to peer financial agreements',
  favicon: 'img/favicon.ico',
  url: 'https://play.marlowe.iohk.io/',
  baseUrl: '/',
  organizationName: 'Marlowe', // Usually your GitHub org/user name.
  projectName: 'Marlowe', // Usually your repo name.
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl:
          //   'https://github.com/input-output-hk/marlowe-doc/edit/main/docs',
          docLayoutComponent: '@theme/DocPage',
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  themes: [
    'docusaurus-theme-openapi-docs',
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
  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        path: 'tutorials',
        routeBasePath: 'tutorials',
        sidebarPath: require.resolve('./sidebar-tutorial.js'),
        docLayoutComponent: '@theme/DocPage',
        docItemComponent: '@theme/ApiItem',
      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'runtime',
        docsPluginId: 'api',
        config: {
          runtime: {
            specPath: "static/api/openapi.latest.json", // path or URL to the OpenAPI spec
            outputDir: 'api/latest', // output directory for generated *.mdx and sidebar.js files
            sidebarOptions: {
              groupPathsBy: 'tag', // generate a sidebar.js slice that groups operations by tag
            },
            version: '0.0.3',
            label: 'v0.0.3',
            baseUrl: '/api/latest',
            versions: {
              '0.0.2': {
                specPath: 'static/api/openapi.0.0.2.json',
                outputDir: 'api/0.0.2', // No trailing slash
                label: 'v0.0.2',
                baseUrl: '/api/0.0.2', // Leading slash is important
              },
            },
          },
        }
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./sidebars-api.js'),
        docLayoutComponent: '@theme/DocPage',
        docItemComponent: '@theme/ApiItem',
      },
    ],
  ],
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
          src: 'img/marlowe-logo-primary-black-purple.svg',
          srcDark: 'img/marlowe-logo-primary-white-purple.svg',
          href: 'https://marlowe.iohk.io/',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: 'tutorials',
            position: 'left',
            label: 'Tutorials',
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
                href: 'https://cardano.stackexchange.com/questions/tagged/marlowe',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/channels/826816523368005654/936295815926927390',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/marlowe_io',
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
        darkTheme: darkCodeTheme,
        additionalLanguages: ['rest', 'haskell', 'http'],
      },
    }
  ),
  scripts,
  customFields: {
    matomoBaseUrl: process.env.MATOMO_BASE_URL,
    matomoSiteId: process.env.MATOMO_SITE_ID
  }
};

module.exports = config;

