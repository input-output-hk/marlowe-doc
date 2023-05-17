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
          customCss: require.resolve('./src/css/custom.css'),
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
  markdown: {
    mermaid: true,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
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
            label: 'Getting Started',
          },
          {
            to: '/docs',
            label: 'Documentation',
            position: 'left',
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
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/introduction',
              },
            ],
          },
          {
            title: 'Community',
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
            title: 'More',
            items: [
              {
                label: 'Privacy Policy',
                href: 'https://static.iohk.io/gdpr/IOHK-Data-Protection-GDPR-Policy.pdf',
              },
              {
                label: 'Terms and Conditions',
                href: 'https://plutus-static.s3.eu-central-1.amazonaws.com/IOHK+Website+Terms+%26+Conditions+(Final).pdf',
              },
              {
                label: 'iohk.io',
                href: 'https://iohk.io',
              },
              {
                label: 'cardano.org',
                href: 'https://cardano.org',
              },
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
      },
    }
  ),
};

module.exports = config;

