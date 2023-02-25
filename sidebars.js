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
        'getting-started/getting-started-with-the-marlowe-playground',
        'getting-started/marlowe-language-guide',
        'getting-started/writing-marlowe-with-blockly',
        'getting-started/using-the-haskell-editor',
        'getting-started/using-the-javascript-editor',
      ],
    },
    {
      type: 'category',
      label: 'Browse Examples',
      collapsed: true,
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
      collapsed: true,
      items: [
        'tutorials/tutorials-overview',
        'tutorials/video-tutorials',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Overview',
      collapsed: true,
      items: [
        'architecture',
      ],
    },
    {
      type: 'category',
      label: 'Developer Tools',
      collapsed: true,
      link: {
        type: 'generated-index',
        title: 'Developers',
        description: 'Learn more about Marlowe\'s ecosystem of developer tools',
      },
      items: [
        'development/deployment-overview',
        'development/dsl',
        'development/platform',
        'development/playground',
        'development/runtime',
        'development/cli',
        'development/dev-resources',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise Integration',
      collapsed: true,
      items: [
        'enterprise/integration',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      collapsed: true,
      items: [
        'support/faq',
        'support/dev-discussions',
        'support/contact',
      ],
    },
  ],
};

module.exports = sidebars;
