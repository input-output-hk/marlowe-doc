// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const OSANO_SRC = process.env.OSANO_SRC;
const scripts = [
  {
    src: 'https://www.feedbackrocket.io/sdk/v1.1.js',
    async: true,
    'data-fr-id': 'MUUFimprPtTseMFmHxVrP',
    'data-fr-theme': 'dynamic',
  },
];
if (OSANO_SRC) {
  // @ts-ignore
  scripts.push({
    src: OSANO_SRC,
    async: false,
  });
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Marlowe",
  tagline: "Peer to peer financial agreements",
  favicon: "img/favicon.ico",
  url: "https://play.marlowe.iohk.io/",
  baseUrl: "/",
  organizationName: "Marlowe", // Usually your GitHub org/user name.
  projectName: "Marlowe", // Usually your repo name.
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "docusaurus-preset-openapi",
      {
        api: {
          path: require.resolve("./static/api/openapi.latest.json"),
          routeBasePath: "api",
        },
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/input-output-hk/marlowe-doc/edit/main",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      },
    ],
  ],

  themes: [
    "@docusaurus/theme-mermaid",
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
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "tutorials",
        path: "tutorials",
        routeBasePath: "tutorials",
        sidebarPath: require.resolve("./sidebar-tutorial.js"),
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
        title: "",
        logo: {
          alt: "Marlowe Logo",
          src: "img/marlowe-logo-primary-black-purple.svg",
          srcDark: "img/marlowe-logo-primary-white-purple.svg",
          href: "https://marlowe.iohk.io/",
        },
        items: [
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Documentation",
          },
          {
            to: "tutorials",
            position: "left",
            label: "Tutorials",
          },
          {
            type: "dropdown",
            label: "Community",
            position: "left",
            items: [
              {
                label: "Github",
                href: "https://github.com/input-output-hk/marlowe",
              },
              {
                label: "Stack Exchange",
                href: "https://cardano.stackexchange.com/questions/tagged/marlowe",
              },
              {
                label: "Discord",
                href: "https://discord.com/channels/826816523368005654/936295815926927390",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/marlowe_io",
              },
            ],
          },
          {
            type: "search",
            position: "right",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["rest", "haskell", "http"],
      },
    }),
  scripts,
  customFields: {
    posthogApiKey: process.env.POSTHOG_API_KEY,
    posthogApiHost: process.env.POSTHOG_API_HOST,
    posthogProjectId: process.env.POSTHOG_PROJECT_ID,
  },
};

module.exports = config;
