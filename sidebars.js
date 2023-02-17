// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'introduction',
        'getting-started-with-the-marlowe-playground',
        'marlowe-language-guide',
        'writing-marlowe-with-blockly',
        'using-the-haskell-editor',
        'using-the-javascript-editor',
      ],
    },
    {
      type: 'category',
      label: 'Browse Examples',
      collapsed: false,
      items: [
        'examples/contract-examples',
        'examples/runtime-examples',
        'examples/cli-tool-examples',
        'examples/cli-cookbook',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: [
        'tutorials/tutorials-overview',
        'tutorials/video-tutorials',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Overview',
      collapsed: false,
      items: [
        'architecture',
      ],
    },
    {
      type: 'category',
      label: 'Developer Tools',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Developers',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/dsl',
        'development/platform',
        'development/playground',
        'development/runtime',
        'development/cli',
        'development/lambda',
        'development/dev-resources',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise Integration',
      collapsed: false,
      items: [
        'enterprise/integration',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      collapsed: false,
      items: [
        'support/faq',
        'support/discord',
        'support/github-repos',
        'support/contact',
      ],
    },
  ],
};

module.exports = sidebars;
